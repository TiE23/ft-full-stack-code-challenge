import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskEntity } from './entities/task.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    TypeOrmModule.forFeature([CategoryEntity]),
  ],
  controllers: [TaskController],
  providers: [TaskService, CategoryService],
})
export class TaskModule {}
