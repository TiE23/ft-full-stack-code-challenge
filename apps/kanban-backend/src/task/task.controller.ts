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
import { Task } from './entities/task.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Patch(':taskId/moveto/:categoryId/:position')
  changeCategory(
    @Param('taskId') taskId: number,
    @Param('categoryId') categoryId: number,
    @Param('position') position: number
  ): Promise<Task> {
    return this.taskService.moveAndReposition(taskId, categoryId, position);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.taskService.delete(id);
  }
}
