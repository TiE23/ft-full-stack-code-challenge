import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { CategoryService } from '../category/category.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private categoriesService: CategoryService
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    // Here we grab the Category we're going to be inserting into.
    const insertCategory = await this.categoriesService.findOne(
      createTaskDto.categoryId
    );

    // Build the new Task, providing the Category we found.
    const newTask = new Task();
    newTask.title = createTaskDto.title;
    newTask.category = insertCategory;

    // Cascade rule will take care of the update to Category for us.
    return await this.tasksRepository.save(newTask);
  }

  async findAll() {
    return await this.tasksRepository.find({
      relations: ['category'],
    });
  }

  async findOne(id: number) {
    return await this.tasksRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.tasksRepository.update({ id }, updateTaskDto);
    return await this.tasksRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async remove(id: number) {
    const taskToDelete = await this.tasksRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    return await this.tasksRepository.remove(taskToDelete);
  }
}
