import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CategoryEntity } from '../../category/entities/category.entity';
import { LexicalOrder } from '../../types/entity.types';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => CategoryEntity, (category) => category.tasks, {
    onDelete: 'CASCADE', // Automatically delete Task when Category is deleted.
    cascade: ['update'], // Automatically update Category when adding new Task.
    nullable: false, // A Task will always belong to a Category.
  })
  category: CategoryEntity;

  @Column({ nullable: false, type: 'varchar' })
  lexical_order: LexicalOrder;

  @CreateDateColumn({ nullable: false })
  created_at: Date;

  @UpdateDateColumn({ nullable: false })
  updated_at: Date;
}
