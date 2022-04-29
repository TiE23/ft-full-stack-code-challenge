import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Task } from '../task/entities/task.entity';
import { CreateTaskDto } from '../task/dto/create-task.dto';

import { EntityNotFoundException } from '../exceptions/EntityNotFoundException';
import { insertLexicalSort } from '../utils/common.utils';
import { lexicalSortTasks } from '../utils/task.utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

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

  async findAll() {
    return await this.categoriesRepository.find({ relations: ['tasks'] });
  }

  async findOne(id: number) {
    return await this.categoriesRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
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

  async reposition(id: number, newPosition: number) {
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

    let prevLex = '';
    let nextLex = '';

    if (newPosition >= categories.length) {
      // After the end.
      prevLex = categories[categories.length - 1].lexical_order;
    } else if (categories[newPosition].id === id) {
      // There is no change in position.
      return targetCategory;
    } else if (newPosition === 0) {
      // Before the start.
      nextLex = categories[0].lexical_order;
    } else {
      // Set the prev and next lex strings to be between where we want to insert.
      prevLex = categories[newPosition - 1].lexical_order;
      nextLex = categories[newPosition].lexical_order;
    }

    // Generate the lexical order string that will sort it between these Categories.
    targetCategory.lexical_order = insertLexicalSort(prevLex, nextLex);

    await this.categoriesRepository.update({ id }, targetCategory);
    return targetCategory;
  }

  async remove(id: number) {
    return await this.categoriesRepository.delete(id);
  }

  async addTask(id: number, createTaskDto: CreateTaskDto) {
    // Here we grab the Category we're going to be inserting into.
    const insertCategory = await this.categoriesRepository.findOne(id);

    if (!insertCategory) {
      throw new EntityNotFoundException('Category', id);
    }

    // Get the Tasks that belong to the Category we're inserting into and sort them.
    const sortedSiblingTasks = lexicalSortTasks(insertCategory.tasks, 'ASC');

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
}
