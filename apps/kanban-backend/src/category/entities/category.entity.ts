import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { TaskEntity } from '../../task/entities/task.entity';
import { LexicalOrder } from '../../types/entity.types';

/**
 * Here I've chosen to use TypeORM's Data Mapper approach to spread things out.
 * https://typeorm.io/active-record-data-mapper
 */
@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  title: string;

  @OneToMany(() => TaskEntity, (task) => task.category, {
    nullable: false,
    cascade: ['insert'],
    eager: true, // Want to always return tasks when loading Category entities.
  })
  tasks: TaskEntity[];

  @Column({ nullable: false, type: 'varchar' })
  lexical_order: LexicalOrder;

  @CreateDateColumn({ nullable: false })
  created_at: Date;

  @UpdateDateColumn({ nullable: false })
  updated_at: Date;
}
