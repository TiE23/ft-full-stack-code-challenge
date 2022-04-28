import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TaskModule } from '../task/task.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    CategoryModule,
    TaskModule,
    TypeOrmModule.forRoot({
      entities: ['src/**/*.entity.ts'],
      autoLoadEntities: true,
      synchronize: true,
      database: 'kanban-db.sqlite3',
      type: 'sqlite',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
