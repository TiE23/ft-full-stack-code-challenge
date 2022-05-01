import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Patch(':taskId')
  update(
    @Param('taskId') taskId: number,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<TaskEntity> {
    return this.taskService.update(taskId, updateTaskDto);
  }

  @Patch(':taskId/moveto/:categoryId/:newPosition')
  moveAndReposition(
    @Param('taskId') taskId: number,
    @Param('categoryId') categoryId: number,
    @Param('newPosition') newPosition: number
  ): Promise<TaskEntity> {
    return this.taskService.moveAndReposition(taskId, categoryId, newPosition);
  }

  @Delete(':taskId')
  delete(@Param('taskId') taskId: number): Promise<DeleteResult> {
    return this.taskService.delete(taskId);
  }
}
