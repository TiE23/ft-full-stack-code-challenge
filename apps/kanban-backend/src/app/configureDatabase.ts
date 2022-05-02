import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/entities/category.entity';
import { TaskEntity } from '../task/entities/task.entity';
import { Subscribers } from './app.subscribers';

/**
 * To keep the Database config consistent between dev and test.
 * Provide the name of the file you want to save the sqlite3 file to.
 * For testing, use ':memory:' to avoid writing anything to disk.
 */
export function makeDatabase(database: string): TypeOrmModuleOptions {
  return {
    // e2e breaks without __dirname https://stackoverflow.com/a/68080829/3120546
    // entities: [__dirname + '/../**/*.entity.ts'],
    entities: [TaskEntity, CategoryEntity],
    subscribers: [Subscribers],
    autoLoadEntities: true,
    synchronize: true,
    database,
    type: 'sqlite',
  };
}
