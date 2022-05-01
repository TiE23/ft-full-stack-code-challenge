import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { CreateTaskDto } from '../task/dto/create-task.dto';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<CategoryEntity> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(): Promise<CategoryEntity[]> {
    return this.categoryService.findAll();
  }

  @Get(':categoryId')
  findOne(@Param('categoryId') categoryId: number): Promise<CategoryEntity> {
    return this.categoryService.findOne(categoryId);
  }

  @Patch(':categoryId')
  update(
    @Param('categoryId') categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryEntity> {
    return this.categoryService.update(categoryId, updateCategoryDto);
  }

  @Patch(':categoryId/repositionto/:newPosition')
  reposition(
    @Param('categoryId') categoryId: number,
    @Param('newPosition') newPosition: number
  ): Promise<CategoryEntity> {
    return this.categoryService.reposition(categoryId, newPosition);
  }

  @Post(':categoryId/addtask')
  addTask(
    @Param('categoryId') categoryId: number,
    @Body() createTaskDto: CreateTaskDto
  ): Promise<CategoryEntity> {
    return this.categoryService.addTask(categoryId, createTaskDto);
  }

  @Delete(':categoryId')
  delete(@Param('categoryId') categoryId: number): Promise<DeleteResult> {
    return this.categoryService.delete(categoryId);
  }
}
