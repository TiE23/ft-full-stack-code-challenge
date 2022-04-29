import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Task } from '../task/entities/task.entity';
import { CreateTaskDto } from '../task/dto/create-task.dto';

import { EntityNotFoundException } from '../exceptions/EntityNotFoundException';
import { insertLexicalSort, positionEntity } from '../utils/common.utils';
import { lexicallySortEntities } from '../utils/common.utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  /**
   * Creates a new Category with no Tasks and a lexical_order property that will
   * make it sort to the end.
   * @param createCategoryDto
   * @returns
   */
  async create(createCategoryDto: CreateCategoryDto) {
    // Creating a new Category always defaults to the end. So, grab the last Category.
    const categories = await this.categoriesRepository.find({
      order: { lexical_order: 'DESC' }, // DESC (z, y, x, ... a) order.
      take: 1, // Only need the first Category (which is the last lexically sorted).
    });
    const lexicalOrder =
      categories.length > 0
        ? insertLexicalSort(categories[0].lexical_order, '')
        : insertLexicalSort('', '');

    return await this.categoriesRepository.save({
      ...createCategoryDto,
      lexical_order: lexicalOrder,
    });
  }

  /**
   * Returns all Categories and their Tasks.
   * @returns
   */
  async findAll() {
    return await this.categoriesRepository.find({ relations: ['tasks'] });
  }

  /**
   * Returns one Category and its Tasks. If not found, it'll throw.
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!category) {
      throw new EntityNotFoundException('Category', id);
    }

    return category;
  }

  /**
   * Updates a Category. Will not create a Category if the ID isn't found, it'll
   * throw instead. (Use with PATCH, not PUT).
   * @param id
   * @param updateCategoryDto
   * @returns
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    const targetCategory = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!targetCategory) {
      throw new EntityNotFoundException('Category', id);
    }

    await this.categoriesRepository.update({ id }, updateCategoryDto);
    return await this.categoriesRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
  }

  /**
   * Repositions a Category found by its ID to sort before, after, or between its
   * siblings through their lexical_order properties.
   * @param id
   * @param newPosition
   * @returns
   */
  async reposition(id: number, newPosition: number): Promise<Category> {
    const targetCategory = await this.categoriesRepository.findOne({
      where: { id },
      loadEagerRelations: false, // Do not need Tasks relation.
    });

    if (!targetCategory) {
      throw new EntityNotFoundException('Category', id);
    }

    const categories = await this.categoriesRepository.find({
      order: { lexical_order: 'ASC' },
    });

    // Generate the lexical order string that will sort it between these Categories.
    targetCategory.lexical_order = positionEntity<Category>(
      categories,
      id,
      newPosition
    );

    await this.categoriesRepository.update({ id }, targetCategory);
    return targetCategory;
  }

  /**
   * Add a Task to the targeted Category by its ID.
   * This is intended to be the only way to create Tasks, as all tasks will
   * belong to a Category.
   * New Tasks will be appended to the end of the Tasks list and will have a
   * fitting lexical_order property to reflect its new position.
   * @param id
   * @param createTaskDto
   * @returns
   */
  async addTask(id: number, createTaskDto: CreateTaskDto): Promise<Category> {
    // Here we grab the Category we're going to be inserting into.
    const insertCategory = await this.categoriesRepository.findOne(id);

    if (!insertCategory) {
      throw new EntityNotFoundException('Category', id);
    }

    // Get the Tasks that belong to the Category we're inserting into and sort them.
    const sortedSiblingTasks = lexicallySortEntities(
      insertCategory.tasks,
      'ASC'
    );

    // Calculate the new order position.
    const lexicalOrder =
      sortedSiblingTasks.length > 0
        ? insertLexicalSort(sortedSiblingTasks[0].lexical_order, '')
        : insertLexicalSort('', '');

    // Build the new Task.
    const newTask = new Task();
    newTask.title = createTaskDto.title;
    newTask.lexical_order = lexicalOrder;

    insertCategory.tasks.push(newTask);

    return await this.categoriesRepository.save(insertCategory);
  }

  /**
   * Deletes a Category by its ID.
   * Will not throw an error if the ID doesn't exist.
   * Worth noting here that Task entities are configured in such a way as they
   * are deleted when their parent Category is deleted.
   * @param id
   * @returns
   */
  async delete(id: number): Promise<DeleteResult> {
    return await this.categoriesRepository.delete(id);
  }
}
