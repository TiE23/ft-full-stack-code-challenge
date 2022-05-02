import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { makeDatabase } from './configureDatabase';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TaskModule } from '../task/task.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(makeDatabase('kanban-db.sqlite3')),
    CategoryModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
