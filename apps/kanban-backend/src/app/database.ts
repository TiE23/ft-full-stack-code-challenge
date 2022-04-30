import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * To keep the Database config consistent between dev and test.
 * Provide the name of the file you want to save the sqlite3 file to.
 * For testing, use ':memory:' to avoid writing anything to disk.
 */
export function makeDatabase(database: string): TypeOrmModuleOptions {
  return {
    // entities: ['src/**/*.entity.ts'],
    // e2e testing is impossible otherwise https://stackoverflow.com/a/68080829/3120546
    entities: [__dirname + '/../**/*.entity.ts'],
    autoLoadEntities: true,
    synchronize: true,
    database,
    type: 'sqlite',
  };
}
