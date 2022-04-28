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

  @Column()
  title: string;

  @OneToMany(() => Task, (task) => task.category, {
    orphanedRowAction: 'delete', // Delete tasks when the category is deleted.
  })
  tasks: Task[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
