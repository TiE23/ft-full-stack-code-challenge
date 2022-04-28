import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from '../../category/entities/category.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => Category, (category) => category.tasks, {
    onDelete: 'CASCADE', // Automatically delete Task when Category is deleted.
    cascade: ['update'], // Automatically update categories when adding new task.
    nullable: false, // A Task will always belong to a category.
  })
  category: Category;

  @CreateDateColumn({ nullable: false })
  created_at: Date;

  @UpdateDateColumn({ nullable: false })
  updated_at: Date;
}
