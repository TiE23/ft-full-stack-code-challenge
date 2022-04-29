import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from '../../category/entities/category.entity';
import { LexicalOrder } from '../../types/entity.types';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => Category, (category) => category.tasks, {
    onDelete: 'CASCADE', // Automatically delete Task when Category is deleted.
    cascade: ['update'], // Automatically update Category when adding new Task.
    nullable: false, // A Task will always belong to a Category.
  })
  category: Category;

  @Column({ nullable: false, type: 'varchar' })
  lexical_order: LexicalOrder;

  @CreateDateColumn({ nullable: false })
  created_at: Date;

  @UpdateDateColumn({ nullable: false })
  updated_at: Date;
}
