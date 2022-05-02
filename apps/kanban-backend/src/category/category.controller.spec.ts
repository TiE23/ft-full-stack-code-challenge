import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from '../task/dto/create-task.dto';

import { categoryFactory } from '../testUtils/category.testUtils';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  // Infinite kudos to The Geek @ https://stackoverflow.com/a/67850093/3120546
  const mockProviders: Provider[] = [
    {
      provide: CategoryService,
      useValue: {
        create: jest.fn().mockReturnValue('Please Mock Me'),
        findAll: jest.fn().mockReturnValue('Please Mock Me'),
        findOne: jest.fn().mockReturnValue('Please Mock Me'),
        update: jest.fn().mockReturnValue('Please Mock Me'),
        reposition: jest.fn().mockReturnValue('Please Mock Me'),
        addTask: jest.fn().mockReturnValue('Please Mock Me'),
        delete: jest.fn().mockReturnValue('Please Mock Me'),
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [...mockProviders],
    }).compile();

    categoryController = module.get(CategoryController);
    categoryService = module.get(CategoryService);
  });

  describe('create()', () => {
    it('should correctly call create service', async () => {
      const categoryDto: CreateCategoryDto = { title: 'Category' };
      const category = categoryFactory({ id: 1, title: 'Category' });

      const mockCreate = jest
        .spyOn(categoryService, 'create')
        .mockResolvedValue(category);
      const createResult = await categoryController.create(categoryDto);
      expect(createResult).toBe(category);
      expect(mockCreate).toBeCalledWith(categoryDto);
    });
  });

  describe('findAll()', () => {
    it('should correctly call findAll service', async () => {
      const categories = [
        categoryFactory({ id: 0, title: 'Category 0' }),
        categoryFactory({ id: 1, title: 'Category 1' }),
        categoryFactory({ id: 2, title: 'Category 2' }),
      ];

      const mockFindAll = jest
        .spyOn(categoryService, 'findAll')
        .mockResolvedValue(categories);

      const findAllResult = await categoryController.findAll();
      expect(findAllResult).toBe(categories);
      expect(mockFindAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should correctly call findOne service', async () => {
      const category = categoryFactory({ id: 0, title: 'Category' });

      const mockFindOne = jest
        .spyOn(categoryService, 'findOne')
        .mockResolvedValue(category);

      const findOneResult = await categoryController.findOne(0);
      expect(findOneResult).toBe(category);
      expect(mockFindOne).toBeCalledWith(0);
    });
  });

  describe('update()', () => {
    it('should correctly call update service', async () => {
      const categoryDto: UpdateCategoryDto = { title: 'Category' };
      const category = categoryFactory({ id: 1, title: 'Category' });

      const mockUpdate = jest
        .spyOn(categoryService, 'update')
        .mockResolvedValue(category);

      const updateResult = await categoryController.update(0, categoryDto);
      expect(updateResult).toBe(category);
      expect(mockUpdate).toBeCalledWith(0, categoryDto);
    });
  });

  describe('reposition()', () => {
    it('should correctly call resposition service', async () => {
      const category = categoryFactory({ id: 1, title: 'Category' });

      const mockReposition = jest
        .spyOn(categoryService, 'reposition')
        .mockResolvedValue(category);

      const repositionResult = await categoryController.reposition(0, 0);
      expect(repositionResult).toBe(category);
      expect(mockReposition).toBeCalledWith(0, 0);
    });
  });

  describe('addTask()', () => {
    it('should correctly call addTask service', async () => {
      const taskDto: CreateTaskDto = { title: 'Task' };
      const category = categoryFactory({ id: 1, title: 'Category' });

      const mockAddTask = jest
        .spyOn(categoryService, 'addTask')
        .mockResolvedValue(category);

      const addTaskResult = await categoryController.addTask(0, taskDto);
      expect(addTaskResult).toBe(category);
      expect(mockAddTask).toBeCalledWith(0, taskDto);
    });
  });

  describe('delete()', () => {
    it('should correctly call delete service', async () => {
      const mockDeleteResult: DeleteResult = { raw: null };
      const mockDelete = jest
        .spyOn(categoryService, 'delete')
        .mockResolvedValue(mockDeleteResult);

      const deleteResult = await categoryController.delete(0);
      expect(deleteResult).toBe(mockDeleteResult);
      expect(mockDelete).toBeCalledWith(0);
    });
  });
});
