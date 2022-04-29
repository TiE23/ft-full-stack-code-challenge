import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Task } from '../../task/entities/task.entity';

/**
 * Here I've chosen to use TypeORM's Data Mapper approach to spread things out.
 * https://typeorm.io/active-record-data-mapper
 */
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  title: string;

  @OneToMany(() => Task, (task) => task.category, {
    nullable: false,
    cascade: ['insert'],
    eager: true, // Want to always return tasks when loading Category entities.
  })
  tasks: Task[];

  @Column({ nullable: false })
  lexical_order: string;

  @CreateDateColumn({ nullable: false })
  created_at: Date;

  @UpdateDateColumn({ nullable: false })
  updated_at: Date;
}
