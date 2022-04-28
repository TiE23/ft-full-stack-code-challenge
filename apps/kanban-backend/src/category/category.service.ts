import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoriesRepository.save(createCategoryDto);
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
    this.categoriesRepository.createQueryBuilder();
    await this.categoriesRepository.update({ id }, updateCategoryDto);
    return await this.categoriesRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
  }

  async remove(id: number) {
    const categoryToDelete = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
    return await this.categoriesRepository.remove(categoryToDelete);
  }
}
