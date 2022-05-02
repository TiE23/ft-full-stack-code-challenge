import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult } from 'typeorm';
import { taskFactory } from '../testUtils/task.testUtils';
import { UpdateTaskDto } from './dto/update-task.dto';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  const mockProviders: Provider[] = [
    {
      provide: TaskService,
      useValue: {
        update: jest.fn().mockReturnValue('Please Mock Me'),
        moveAndReposition: jest.fn().mockReturnValue('Please Mock Me'),
        delete: jest.fn().mockReturnValue('Please Mock Me'),
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [...mockProviders],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get(TaskService);
  });

  describe('update()', () => {
    it('should correctly call update service', async () => {
      const taskDto: UpdateTaskDto = { title: 'Updated task' };
      const task = taskFactory({ id: 1, title: 'Task' });

      const mockUpdate = jest
        .spyOn(taskService, 'update')
        .mockResolvedValue(task);

      const updateResult = await taskController.update(0, taskDto);
      expect(updateResult).toBe(task);
      expect(mockUpdate).toBeCalledWith(0, taskDto);
    });
  });

  describe('update()', () => {
    it('should correctly call update service', async () => {
      const taskDto: UpdateTaskDto = { title: 'Updated task' };
      const task = taskFactory({ id: 1, title: 'Task' });

      const mockUpdate = jest
        .spyOn(taskService, 'update')
        .mockResolvedValue(task);

      const updateResult = await taskController.update(0, taskDto);
      expect(updateResult).toBe(task);
      expect(mockUpdate).toBeCalledWith(0, taskDto);
    });
  });

  describe('moveAndReposition()', () => {
    it('should correctly call moveAndReposition service', async () => {
      const task = taskFactory({ id: 1, title: 'Task' });

      const mockUpdate = jest
        .spyOn(taskService, 'moveAndReposition')
        .mockResolvedValue(task);

      const moveResult = await taskController.moveAndReposition(0, 0, 0);
      expect(moveResult).toBe(task);
      expect(mockUpdate).toBeCalledWith(0, 0, 0);
    });
  });

  describe('delete()', () => {
    it('should correctly call delete service', async () => {
      const mockDeleteResult: DeleteResult = { raw: null };
      const mockDelete = jest
        .spyOn(taskService, 'delete')
        .mockResolvedValue(mockDeleteResult);

      const deleteResult = await taskController.delete(0);
      expect(deleteResult).toBe(mockDeleteResult);
      expect(mockDelete).toBeCalledWith(0);
    });
  });
});
