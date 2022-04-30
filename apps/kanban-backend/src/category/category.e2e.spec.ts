import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import * as supertest from 'supertest';

import { makeDatabase } from '../app/database';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { CategoryModule } from './category.module';
import { TaskModule } from '../task/task.module';
import { configureApp } from '../utils/configureApp';

describe('Category e2e tests', () => {
  let app: INestApplication;
  let categoriesRepository: Repository<CategoryEntity>;
  let categoriesService: CategoryService;
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
    categoriesService = app.get(CategoryService);
    connection = app.get(Connection);
  });

  afterAll(async () => {
    await app.close();
  });

  // Clear the Categories table. Defined this as a function to allow for precise execution.
  const resetCategoriesTable = async () => {
    await categoriesRepository.clear();
    // Reset SQLite's internal sequence table to 0 for consistent id values.
    await connection.createQueryRunner().query(
      // https://www.designcise.com/web/tutorial/how-to-reset-autoincrement-number-sequence-in-sqlite
      "UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = 'category_entity'"
    );
  };

  // Seed the Category table by using the service directly.
  const seedCategories = async (count: number) => {
    for (let n = 1; n <= count; ++n) {
      await categoriesService.create({ title: `Category ${n}` });
    }
  };

  describe('happy path creating, reading, updating, and deleting Categories', () => {
    describe('POST /category; create()', () => {
      afterAll(async () => {
        await resetCategoriesTable();
      });

      it('should create a Category', async () => {
        await supertest(app.getHttpServer())
          .post('/api/category')
          .send({ title: 'Category 1' })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual(
              expect.objectContaining({
                title: 'Category 1',
              })
            );
          });
      });

      it('should create a second Category', async () => {
        await supertest(app.getHttpServer())
          .post('/api/category')
          .send({ title: 'Category 2' })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual(
              expect.objectContaining({
                title: 'Category 2',
              })
            );
          });
      });
    });

    describe('GET /category; findAll()', () => {
      beforeAll(async () => {
        // Seed with two Categories.
        await seedCategories(2);
      });

      afterAll(async () => {
        await resetCategoriesTable();
      });

      it('should find the Categories that were created', async () => {
        await supertest(app.getHttpServer())
          .get('/api/category')
          .expect(200)
          .expect((res) => {
            expect(res.body.length).toEqual(2);
            expect(res.body[0]).toEqual(
              expect.objectContaining({
                title: 'Category 1',
              })
            );
            expect(res.body[1]).toEqual(
              expect.objectContaining({
                title: 'Category 2',
              })
            );
          });
      });
    });

    describe('GET /category/:id; findOne()', () => {
      beforeAll(async () => {
        // Seed with one Category.
        await seedCategories(1);
      });

      afterAll(async () => {
        await resetCategoriesTable();
      });

      it('should find a specific Category', async () => {
        await supertest(app.getHttpServer())
          .get('/api/category/1')
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              id: 1,
              title: 'Category 1',
              tasks: [],
              lexical_order: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            });
          });
      });
    });

    describe('POST /category/:id; update()', () => {
      beforeAll(async () => {
        // Seed with one Category.
        await seedCategories(1);
      });

      afterAll(async () => {
        await resetCategoriesTable();
      });

      it('should update a specific Category', async () => {
        await supertest(app.getHttpServer())
          .patch('/api/category/1')
          .send({ title: 'Updated Title' })
          .expect(200)
          .expect((res) => {
            expect(res.body.title).toBe('Updated Title');
          });
      });
    });

    describe('PATCH /category/:id/repositionto/:newPosition; reposition()', () => {
      beforeAll(async () => {
        // Seed with three Categories.
        await seedCategories(3);
      });

      afterAll(async () => {
        await resetCategoriesTable();
      });

      it('should update the lexical_order of the moved Category', async () => {
        /**
         * Typically 3 Categories will have the lexical_orders 'n', 'u', and 'x'.
         * If we move the third Category to the front, it should be 'g', which
         * is less than 'n'.
         */
        await supertest(app.getHttpServer())
          .patch('/api/category/3/repositionto/0')
          .expect(200)
          .expect((res) => {
            expect(res.body.lexical_order < 'n').toBe(true);
            expect(res.body.lexical_order).toBe('g');
          });
      });

      it('should have sorted the Categories on retrieval', async () => {
        /**
         * Retrieve the Categories, which should now be ordered
         */
        await supertest(app.getHttpServer())
          .get('/api/category')
          .expect((res) => {
            expect(res.body[0].id).toBe(3);
            expect(res.body[1].id).toBe(1);
            expect(res.body[2].id).toBe(2);
          });
      });
    });

    describe('POST /category/:id/addtask; addTask()', () => {
      beforeAll(async () => {
        // Seed with three Categories.
        await seedCategories(3);
      });

      afterAll(async () => {
        await resetCategoriesTable();
      });

      it('should add a new Task to a targeted Category', async () => {
        await supertest(app.getHttpServer())
          .post('/api/category/1/addtask')
          .send({ title: 'Task 1.1' })
          .expect(201)
          .expect((res) => {
            expect(res.body.tasks.length).toBe(1);
            expect(res.body.tasks[0].title).toBe('Task 1.1');
          });
      });

      it('should add a second new Task to a targeted Category', async () => {
        await supertest(app.getHttpServer())
          .post('/api/category/1/addtask')
          .send({ title: 'Task 1.2' })
          .expect(201)
          .expect((res) => {
            expect(res.body.tasks.length).toBe(2);
            expect(res.body.tasks[0].title).toBe('Task 1.1');
            expect(res.body.tasks[1].title).toBe('Task 1.2');
            expect(
              res.body.tasks[0].lexical_order < res.body.tasks[1].lexical_order
            ).toBe(true);
          });
      });
    });
    describe('DELETE /category/:id; delete()', () => {
      beforeAll(async () => {
        // Seed with one Category.
        await seedCategories(1);
      });

      afterAll(async () => {
        await resetCategoriesTable();
      });

      it('should delete a Category', async () => {
        await supertest(app.getHttpServer())
          .delete('/api/category/1')
          .expect(200)
          .expect((res) => {
            expect(res.body.affected).toBe(1);
          });
      });

      it('should return 200 trying to delete a non-existant Category', async () => {
        await supertest(app.getHttpServer())
          .delete('/api/category/999')
          .expect(200)
          .expect((res) => {
            expect(res.body.affected).toBe(0);
          });
      });
    });
  });
});
