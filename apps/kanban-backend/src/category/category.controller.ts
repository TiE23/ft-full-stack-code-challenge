import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateTaskDto } from '../task/dto/create-task.dto';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Patch(':id/repositionto/:newPosition')
  reposition(
    @Param('id') id: number,
    @Param('newPosition') newPosition: number
  ): Promise<Category> {
    return this.categoryService.reposition(id, newPosition);
  }

  @Post(':id/addtask')
  addTask(
    @Param('id') id: number,
    @Body() createTaskDto: CreateTaskDto
  ): Promise<Category> {
    return this.categoryService.addTask(id, createTaskDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}
