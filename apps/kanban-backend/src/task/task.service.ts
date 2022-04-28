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
    const savedTask = await this.tasksRepository.save(newTask);

    // Return the newly saved Task so that we can get updated Category relation.
    return await this.tasksRepository.findOne(savedTask.id, {
      relations: ['category'],
    });
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

  async move(taskId: number, categoryId: number) {
    // Get the Task by its ID. Also retrieve its relation to Category, we'll need it.
    const targetTask = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['category'],
    });

    // Borrow the old Category.
    const oldCategory = targetTask.category;
    if (categoryId === oldCategory.id) {
      // No need. The Task won't move anywhere!
      return targetTask;
    }

    // Find the Category we want to move to and give it to our Task object.
    const moveToCategory = await this.categoriesService.findOne(categoryId);
    targetTask.category = moveToCategory;

    // Update the Task. The Cascade option for the Relation will handle the rest.
    await this.tasksRepository.update({ id: taskId }, targetTask);

    // Return the updated Task.
    return targetTask;
  }

  async remove(id: number) {
    const taskToDelete = await this.tasksRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    return await this.tasksRepository.delete(id);
  }
}
