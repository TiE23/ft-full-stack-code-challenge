import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

import { insertLexiSort } from '../utils/lexigraphicalSorting';
import { EntityNotFoundException } from '../exceptions/EntityNotFoundException';

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
      take: 1,
    });
    const lexicalOrder =
      categories.length > 0
        ? insertLexiSort(categories[0].lexical_order, '')
        : insertLexiSort('', '');

    return await this.categoriesRepository.save(
      {
        ...createCategoryDto,
        lexical_order: lexicalOrder,
      },
      {
        reload: true,
      }
    );
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
    } else if (newPosition === 0) {
      // Before the start.
      nextLex = categories[0].lexical_order;
    } else if (id === categories[newPosition].id) {
      // No change in position.
      return targetCategory;
    } else {
      // Set the prev and next lex strings to be between where we want to insert.
      prevLex = categories[newPosition - 1].lexical_order;
      nextLex = categories[newPosition].lexical_order;
    }

    // Generate the lexical order string that will sort it between these Categories.
    targetCategory.lexical_order = insertLexiSort(prevLex, nextLex);

    await this.categoriesRepository.update({ id }, targetCategory);
    return targetCategory;
  }

  async remove(id: number) {
    return await this.categoriesRepository.delete(id);
  }
}
