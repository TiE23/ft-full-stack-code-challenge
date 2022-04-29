import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TaskEntity } from '../task/entities/task.entity';
import { CreateTaskDto } from '../task/dto/create-task.dto';

import { EntityNotFoundException } from '../exceptions/EntityNotFoundException';
import {
  findLexicalPosition,
  positionEntity,
  lexicallySortEntities,
} from '../utils/common.utils';
import { sortTasksInCategory } from '../utils/category.utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>
  ) {}

  /**
   * Creates a new Category with no Tasks and a lexical_order property that will
   * make it sort to the end of all other Categories.
   * @param createCategoryDto
   * @returns
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    // Creating a new Category always defaults to the end. So, grab the last Category.
    const categories = await this.categoriesRepository.find({
      order: { lexical_order: 'DESC' }, // DESC (z, y, x, ... a) order.
      take: 1, // Only need the first Category (which is the last lexically sorted).
    });
    const lexicalOrder =
      categories.length > 0
        ? findLexicalPosition(categories[0].lexical_order, '')
        : findLexicalPosition('', '');

    return await this.categoriesRepository.save({
      ...createCategoryDto,
      lexical_order: lexicalOrder,
    });
  }

  /**
   * Finds all Categories.
   * @returnsall the Categories and their Tasks all sorted by lexical_order
   */
  async findAll(): Promise<CategoryEntity[]> {
    const categories = await this.categoriesRepository.find({
      relations: ['tasks'],
      order: { lexical_order: 'ASC' },
    });

    // Sort Category's Tasks before returning.
    categories.forEach((category) => sortTasksInCategory(category, 'ASC'));
    return categories;
  }

  /**
   * Finds one Category by ID.
   * If not found, it'll throw.
   * @param id
   * @returns the Category and its Tasks all sorted by lexical_order
   */
  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!category) {
      throw new EntityNotFoundException('Category', id);
    }

    // Sort Category's Tasks before returning.
    sortTasksInCategory(category, 'ASC');
    return category;
  }

  /**
   * Updates a Category.
   * Will not create a Category if the ID isn't found, it'll throw instead.
   * @param id
   * @param updateCategoryDto
   * @returns the Category with Tasks sorted by lexical_order
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryEntity> {
    const targetCategory = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!targetCategory) {
      throw new EntityNotFoundException('Category', id);
    }

    // Save the Category.
    const updatedCategory = await this.categoriesRepository.save({
      ...targetCategory,
      ...updateCategoryDto,
    });

    // Sort Category's Tasks before returning.
    sortTasksInCategory(updatedCategory, 'ASC');
    return updatedCategory;
  }

  /**
   * Repositions a Category found by its ID to sort before, after, or between its
   * siblings through their lexical_order properties.
   * @param id
   * @param newPosition
   * @returns the Category with Tasks sorted by lexical_order
   */
  async reposition(id: number, newPosition: number): Promise<CategoryEntity> {
    const targetCategory = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!targetCategory) {
      throw new EntityNotFoundException('Category', id);
    }

    const categories = await this.categoriesRepository.find({
      order: { lexical_order: 'ASC' },
    });

    // Generate the lexical order string that will sort it between these Categories.
    targetCategory.lexical_order = positionEntity<CategoryEntity>(
      categories,
      id,
      newPosition
    );

    // Save the Category.
    const updatedCategory = await this.categoriesRepository.save(
      targetCategory
    );

    // Sort Category's Tasks before returning.
    sortTasksInCategory(updatedCategory, 'ASC');
    return updatedCategory;
  }

  /**
   * Add a Task to the targeted Category by its ID.
   * This is intended to be the only way to create Tasks, as all tasks will
   * belong to a Category.
   * New Tasks will be appended to the end of the Tasks list and will have a
   * fitting lexical_order property to reflect its new position.
   * @param id
   * @param createTaskDto
   * @returns the Category with Tasks (the new one included) sorted by lexical_order
   */
  async addTask(
    id: number,
    createTaskDto: CreateTaskDto
  ): Promise<CategoryEntity> {
    // Here we grab the Category we're going to be inserting into.
    const targetCategory = await this.categoriesRepository.findOne(id);

    if (!targetCategory) {
      throw new EntityNotFoundException('Category', id);
    }

    // Get the Tasks that belong to the Category we're inserting into and sort them.
    const sortedSiblingTasks = lexicallySortEntities(
      targetCategory.tasks,
      'ASC'
    );

    // Build the new Task.
    const newTask = new TaskEntity();
    newTask.title = createTaskDto.title;
    newTask.lexical_order = positionEntity(sortedSiblingTasks, -1, -1);

    targetCategory.tasks.push(newTask);

    // Save the Category.
    const updatedCategory = await this.categoriesRepository.save(
      targetCategory
    );

    // Sort Category's Tasks before returning.
    sortTasksInCategory(updatedCategory, 'ASC');
    return updatedCategory;
  }

  /**
   * Deletes a Category by its ID.
   * Will not throw an error if the ID doesn't exist.
   * Worth noting here that Task entities are configured in such a way as they
   * are deleted when their parent Category is deleted.
   * @param id
   * @returns DeleteResult
   */
  async delete(id: number): Promise<DeleteResult> {
    return await this.categoriesRepository.delete(id);
  }
}
