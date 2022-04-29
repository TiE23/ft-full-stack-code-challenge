import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CategoryService } from '../category/category.service';

import { EntityNotFoundException } from '../exceptions/EntityNotFoundException';
import { positionEntity } from '../utils/common.utils';
import { lexicallySortEntities } from '../utils/common.utils';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private categoriesService: CategoryService
  ) {}

  /**
   * Updates a Task. Will not create a Task if the ID isn't found, it'll
   * throw instead. (Use with PATCH, not PUT).
   * @param id
   * @param updateTaskDto
   * @returns
   */
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const targetTask = await this.tasksRepository.findOne({
      where: { id },
    });

    if (!targetTask) {
      throw new EntityNotFoundException('Task', id);
    }

    await this.tasksRepository.update({ id }, updateTaskDto);
    return await this.tasksRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  /**
   * Moves a Task to a different Category based on ID values. If an ID doesn't
   * exist for either Task or Category it'll throw.
   * It also takes new position argument to allow both changing Categories and
   * inserting the Task between its new siblings.
   * @param taskId
   * @param categoryId
   * @param position
   * @returns
   */
  async moveAndReposition(
    taskId: number,
    categoryId: number,
    position: number
  ): Promise<Task> {
    // Get the Task by its ID. Also retrieve its relation to Category, we'll need it.
    const targetTask = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['category'],
    });

    if (!targetTask) {
      throw new EntityNotFoundException('Task', taskId);
    }

    // Find the Category we want to move to and give it to our Task object.
    const moveToCategory = await this.categoriesService.findOne(categoryId);

    if (!moveToCategory) {
      throw new EntityNotFoundException('Category', categoryId);
    }

    targetTask.category = moveToCategory;

    // Get the Tasks that belong to the Category we're inserting into and sort them.
    const sortedSiblingTasks = lexicallySortEntities(
      moveToCategory.tasks,
      'ASC'
    );

    // Generate the lexical order string that will sort it between these Tasks.
    targetTask.lexical_order = positionEntity<Task>(
      sortedSiblingTasks,
      taskId,
      position
    );

    // Update the Task. The Cascade option for the Relation will handle the rest.
    await this.tasksRepository.update({ id: taskId }, targetTask);

    // Return the newly updated Task so that we can get updated Category relation.
    return await this.tasksRepository.findOne(targetTask.id, {
      relations: ['category'],
    });
  }

  /**
   * Deletes a Task by its ID.
   * Will not throw an error if the ID doesn't exist.
   * @param id
   * @returns
   */
  async delete(id: number): Promise<DeleteResult> {
    return await this.tasksRepository.delete(id);
  }
}
