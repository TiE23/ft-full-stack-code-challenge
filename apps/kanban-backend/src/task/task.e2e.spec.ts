import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import * as supertest from 'supertest';

import { makeDatabase } from '../app/database';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryModule } from '../category/category.module';
import { TaskModule } from '../task/task.module';
import { configureApp } from '../utils/configureApp';
import { TaskEntity } from './entities/task.entity';

describe('Task e2e tests', () => {
  let app: INestApplication;
  let categoriesRepository: Repository<CategoryEntity>;
  let categoriesService: CategoryService;
  let tasksRepository: Repository<TaskEntity>;
  let connection: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CategoryModule,
        TaskModule,
        TypeOrmModule.forRoot(makeDatabase(':memory:')),
      ],
    }).compile();

    app = module.createNestApplication();
    configureApp(app, 'api');
    await app.init();

    categoriesRepository = app.get(getRepositoryToken(CategoryEntity));
    tasksRepository = app.get(getRepositoryToken(TaskEntity));
    categoriesService = app.get(CategoryService);
    connection = app.get(Connection);
  });

  afterAll(async () => {
    await app.close();
  });

  // Clear the Categories table. Defined this as a function to allow for precise execution.
  const resetDatabase = async () => {
    await categoriesRepository.clear();
    await tasksRepository.clear();

    // Reset SQLite's internal sequence table to 0 for consistent id values.
    // https://www.designcise.com/web/tutorial/how-to-reset-autoincrement-number-sequence-in-sqlite
    const queryRunner = connection.createQueryRunner();
    await queryRunner.query(
      "UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = 'category_entity';"
    );
    await queryRunner.query(
      "UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = 'task_entity';"
    );
  };

  // Seed the Categories and their Tasks.
  const seedTasks = async (categoriesCount: number, taskCount: number) => {
    for (let c = 1; c <= categoriesCount; ++c) {
      await categoriesService.create({ title: `Category ${c}` });

      for (let t = 1; t <= taskCount; ++t) {
        await categoriesService.addTask(c, { title: `Task ${c}.${t}` });
      }
    }
  };

  describe('happy path', () => {
    describe('PATCH /task/:id; update()', () => {
      beforeAll(async () => {
        // Create a Category with three Tasks.
        await seedTasks(1, 3);
      });

      afterAll(async () => {
        await resetDatabase();
      });

      it('should update a Task', async () => {
        await supertest(app.getHttpServer())
          .patch('/api/task/1')
          .send({ title: 'Updated Task 1.1' })
          .expect(200)
          .expect((res) => {
            expect(res.body.title).toBe('Updated Task 1.1');
            expect(res.body.category.tasks.length).toBe(3);
          });
      });
    });

    describe('PATCH /task/:taskId/moveto/:categoryId/:position; moveAndReposition()', () => {
      beforeEach(async () => {
        // Create 3 Categories with three Tasks each.
        await seedTasks(3, 3);
      });

      afterEach(async () => {
        await resetDatabase();
      });

      it('should move Task 1 from Category 1 to Category 3 at position 0', async () => {
        await supertest(app.getHttpServer())
          .patch('/api/task/1/moveto/3/0')
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(1);
            expect(res.body.title).toBe('Task 1.1');
            expect(res.body.category.id).toBe(3);
            expect(res.body.category.tasks.length).toBe(4);
            expect(res.body.category.tasks[0].id).toBe(1);
            expect(
              res.body.category.tasks[0].lexical_order <
                res.body.category.tasks[1].lexical_order
            ).toBe(true);
          });
      });

      it('should move Task 1 from Category 1 to Category 3 at end', async () => {
        await supertest(app.getHttpServer())
          .patch('/api/task/1/moveto/3/-1') // -1 is the shortcut for 'the end'.
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(1);
            expect(res.body.title).toBe('Task 1.1');
            expect(res.body.category.id).toBe(3);
            expect(res.body.category.tasks.length).toBe(4);
            expect(
              res.body.category.tasks[3].lexical_order >
                res.body.category.tasks[2].lexical_order
            ).toBe(true);
            expect(res.body.category.tasks[0].id).toBe(7);
            expect(res.body.category.tasks[1].id).toBe(8);
            expect(res.body.category.tasks[2].id).toBe(9);
            expect(res.body.category.tasks[3].id).toBe(1);
          });
      });

      it('should reposition Task 1 from 0 to 1 within Category 1', async () => {
        await supertest(app.getHttpServer())
          .patch('/api/task/1/moveto/1/1')
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(1);
            expect(res.body.title).toBe('Task 1.1');
            expect(res.body.category.id).toBe(1);
            expect(res.body.category.tasks.length).toBe(3);
            expect(res.body.category.tasks[0].id).toBe(2);
            expect(res.body.category.tasks[1].id).toBe(1);
            expect(res.body.category.tasks[2].id).toBe(3);
            expect(
              res.body.category.tasks[0].lexical_order <
                res.body.category.tasks[1].lexical_order
            ).toBe(true);
          });
      });

      it('should move Task 1 from Category 1 to Category 4 at the end', async () => {
        // Create a new Category with no Tasks.
        await categoriesService.create({ title: 'Category 4' });

        await supertest(app.getHttpServer())
          .patch('/api/task/1/moveto/4/-1') // -1 is the shortcut for 'the end'.
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(1);
            expect(res.body.title).toBe('Task 1.1');
            expect(res.body.category.id).toBe(4);
            expect(res.body.category.tasks.length).toBe(1);
            expect(res.body.category.tasks[0].id).toBe(1);
          });
      });
    });

    describe('DELETE /task/:id; delete()', () => {
      beforeAll(async () => {
        // Create a Category with one Task.
        await seedTasks(1, 1);
      });

      afterAll(async () => {
        await resetDatabase();
      });

      it('should delete a Task', async () => {
        await supertest(app.getHttpServer())
          .delete('/api/task/1')
          .expect(200)
          .expect((res) => {
            expect(res.body.affected).toBe(1);
          });
      });

      it('should respond 200 trying to delete a non-existant Task', async () => {
        await supertest(app.getHttpServer())
          .delete('/api/task/55')
          .expect(200)
          .expect((res) => {
            expect(res.body.affected).toBe(0);
          });
      });
    });
  });

  describe('unhappy path', () => {
    describe('PATCH /task/:id; update()', () => {
      beforeAll(async () => {
        // Create a Category with one Task.
        await seedTasks(1, 1);
      });

      afterAll(async () => {
        await resetDatabase();
      });

      describe('given a Task that does not exist', () => {
        it('should respond 404 trying to update of Task that does not exist', async () => {
          await supertest(app.getHttpServer())
            .patch('/api/task/99')
            .send({ title: 'Updated Task 1.1' })
            .expect(404)
            .expect((res) => {
              expect(res.body.message).toMatch(/Task.*99/);
            });
        });
      });
    });

    describe('PATCH /task/:taskId/moveto/:categoryId/:position; moveAndReposition()', () => {
      beforeEach(async () => {
        // Create 3 Categories with three Tasks each.
        await seedTasks(3, 3);
      });

      afterEach(async () => {
        await resetDatabase();
      });

      describe('given a Task that does not exist', () => {
        it('should respond 404 (not found)', async () => {
          await supertest(app.getHttpServer())
            .patch('/api/task/99/moveto/1/0')
            .expect(404)
            .expect((res) => {
              expect(res.body.message).toMatch(/Task.*99/);
            });
        });
      });

      describe('given a Category that does not exist', () => {
        it('should respond 404 (not found)', async () => {
          await supertest(app.getHttpServer())
            .patch('/api/task/1/moveto/99/0')
            .expect(404)
            .expect((res) => {
              expect(res.body.message).toMatch(/Category.*99/);
            });
        });
      });
    });
  });
});
