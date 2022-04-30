import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as supertest from 'supertest';

import { makeDatabase } from '../app/database';
// import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryModule } from './category.module';
import { configureApp } from '../utils/configureApp';

describe('Category e2e tests', () => {
  let app: INestApplication;
  let categoriesRepository: Repository<CategoryEntity>;
  // let categoriesService: CategoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CategoryModule,
        TypeOrmModule.forRoot(makeDatabase(':memory:')),
      ],
    })
      // Uncomment next two function calls to provide a mock service.
      // .overrideProvider(CategoryService)
      // .useValue({
      //   create: () =>
      //     categoryFactory({ id: 0, tasks: [], title: 'Mock Category' }),
      // })
      .compile();

    app = module.createNestApplication();
    configureApp(app, 'test');
    await app.init();

    categoriesRepository = app.get(getRepositoryToken(CategoryEntity));
    // categoriesService = app.get(CategoryService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('happy path creating, reading, updating, and deleting Categories', () => {
    const categoryDto1: CreateCategoryDto = {
      title: 'Category 1',
    };

    afterAll(async () => {
      // Clear the Categories repository when complete.
      await categoriesRepository.delete({});
    });

    describe('POST /category; create()', () => {
      it('should create a Category', async () => {
        await supertest(app.getHttpServer())
          .post('/test/category')
          .send(categoryDto1)
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual(
              expect.objectContaining({
                ...categoryDto1,
              })
            );
          });
      });
    });
    describe('GET /category; findAll()', () => {
      it('should create a Category', async () => {
        await supertest(app.getHttpServer())
          .get('/test/category')
          .expect(200)
          .expect((res) => {
            expect(res.body.length).toEqual(1);
            expect(res.body[0].title).toEqual('Category 1');
          });
      });
    });
  });
});
