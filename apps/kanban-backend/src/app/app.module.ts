import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: ['src/**/*.entity.ts'],
      autoLoadEntities: true,
      synchronize: true,
      database: 'kanban-db.sqlite3',
      type: 'sqlite'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
