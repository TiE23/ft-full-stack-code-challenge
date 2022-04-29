import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CategoryService } from '../category/category.service';

import { EntityNotFoundException } from '../exceptions/EntityNotFoundException';
import { repositionEntity } from '../utils/common.utils';
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
  async changeCategory(
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

    // Borrow the old Category.
    const oldCategory = targetTask.category;
    if (categoryId === oldCategory.id) {
      // No need. The Task won't move anywhere!
      return targetTask;
    }

    // Find the Category we want to move to and give it to our Task object.
    const moveToCategory = await this.categoriesService.findOne(categoryId);

    if (!moveToCategory) {
      throw new EntityNotFoundException('Category', categoryId);
    }

    targetTask.category = moveToCategory;

    // Update the Task. The Cascade option for the Relation will handle the rest.
    await this.tasksRepository.update({ id: taskId }, targetTask);

    // Simple solution to order the Task into the desired position.
    await this.reposition(taskId, position);

    // Return the newly updated Task so that we can get updated Category relation.
    return await this.tasksRepository.findOne(targetTask.id, {
      relations: ['category'],
    });
  }

  async reposition(id: number, newPosition: number): Promise<Task> {
    const targetTask = await this.tasksRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!targetTask) {
      throw new EntityNotFoundException('Task', id);
    }

    // Get the Tasks that belong to the Category we're inserting into and sort them.
    const sortedSiblingTasks = lexicallySortEntities(
      targetTask.category.tasks,
      'ASC'
    );

    let prevLex = '';
    let nextLex = '';

    if (newPosition >= sortedSiblingTasks.length) {
      // After the end.
      prevLex = sortedSiblingTasks[sortedSiblingTasks.length - 1].lexical_order;
    } else if (sortedSiblingTasks[newPosition].id === id) {
      // There is no change in position.
      return targetTask;
    } else if (newPosition === 0) {
      // Before the start.
      nextLex = sortedSiblingTasks[0].lexical_order;
    } else {
      // Set the prev and next lex strings to be between where we want to insert.
      prevLex = sortedSiblingTasks[newPosition - 1].lexical_order;
      nextLex = sortedSiblingTasks[newPosition].lexical_order;
    }

    // Generate the lexical order string that will sort it between these Tasks.
    targetTask.lexical_order = repositionEntity<Task>(
      sortedSiblingTasks,
      id,
      newPosition
    );

    await this.tasksRepository.update(
      { id },
      {
        ...targetTask,
        // category: undefined,  // Don't attempt to modify the Category.
      }
    );

    return this.tasksRepository.findOne(id, { relations: ['category'] });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.tasksRepository.delete(id);
  }
}
