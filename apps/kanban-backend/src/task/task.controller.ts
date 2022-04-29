import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DeleteResult } from 'typeorm';
import { Task } from './entities/task.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Patch(':taskId/moveto/:categoryId')
  move(
    @Param('taskId') taskId: number,
    @Param('categoryId') categoryId: number
  ): Promise<Task> {
    return this.taskService.move(taskId, categoryId);
  }

  @Patch(':id/repositionto/:newPosition')
  reposition(
    @Param('id') id: number,
    @Param('newPosition') newPosition: number
  ): Promise<Task> {
    return this.taskService.reposition(id, newPosition);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<DeleteResult> {
    return this.taskService.remove(id);
  }
}
