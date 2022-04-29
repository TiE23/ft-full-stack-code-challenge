import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { CategoryService } from '../category/category.service';

import { insertLexiSort } from '../utils/lexigraphicalSorting';
import { EntityNotFoundException } from '../exceptions/EntityNotFoundException';

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

    if (!insertCategory) {
      throw new EntityNotFoundException('Category', createTaskDto.categoryId);
    }

    // Get the Tasks that belong to the Category we're inserting into and sort them.
    // Use Array.from() as to not to mutate the array as a precaution.
    const sortedSiblingTasks = Array.from(insertCategory.tasks).sort(
      ({ lexical_order: a }: Task, { lexical_order: b }: Task) =>
        a < b ? -1 : a > b ? 1 : 0 // DESC (z, y, x, ... a) order.
    );

    // Calculate the new order position.
    const lexicalOrder =
      sortedSiblingTasks.length > 0
        ? insertLexiSort(sortedSiblingTasks[0].lexical_order, '')
        : insertLexiSort('', '');

    // Build the new Task, providing the Category we found.
    const newTask = new Task();
    newTask.title = createTaskDto.title;
    newTask.category = insertCategory;
    newTask.lexical_order = lexicalOrder;

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

  async move(taskId: number, categoryId: number) {
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

    // Return the newly updated Task so that we can get updated Category relation.
    return await this.tasksRepository.findOne(targetTask.id, {
      relations: ['category'],
    });
  }

  async reposition(id: number, newPosition: number) {
    const targetTask = await this.tasksRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!targetTask) {
      throw new EntityNotFoundException('Task', id);
    }

    // Get the Tasks that belong to the Category we're inserting into and sort them.
    // Use Array.from() as to not to mutate the array as a precaution.
    const sortedSiblingTasks = Array.from(targetTask.category.tasks).sort(
      ({ lexical_order: a }: Task, { lexical_order: b }: Task) =>
        a < b ? 1 : a > b ? -1 : 0 // ASC (a, b, c, ... z) order.
    );

    // // Calculate the new order position.
    // const lexicalOrder =
    //   sortedSiblingTasks.length > 0
    //     ? insertLexiSort(sortedSiblingTasks[0].lexical_order, '')
    //     : insertLexiSort('', '');

    let prevLex = '';
    let nextLex = '';

    if (newPosition >= sortedSiblingTasks.length) {
      // After the end.
      prevLex = sortedSiblingTasks[sortedSiblingTasks.length - 1].lexical_order;
    } else if (newPosition === 0) {
      // Before the start.
      nextLex = sortedSiblingTasks[0].lexical_order;
    } else if (id === sortedSiblingTasks[newPosition].id) {
      // No change in position.
      return targetTask;
    } else {
      // Set the prev and next lex strings to be between where we want to insert.
      prevLex = sortedSiblingTasks[newPosition - 1].lexical_order;
      nextLex = sortedSiblingTasks[newPosition].lexical_order;
    }

    // Generate the lexical order string that will sort it between these Tasks.
    targetTask.lexical_order = insertLexiSort(prevLex, nextLex);

    await this.tasksRepository.update(
      { id },
      {
        ...targetTask,
        // category: undefined,  // Don't attempt to modify the Category.
      }
    );

    return this.tasksRepository.findOne(id);
  }

  async remove(id: number) {
    return await this.tasksRepository.delete(id);
  }
}
