import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { DATABASE_URL } from './config.js';

const sequelize = new Sequelize(DATABASE_URL, { dialect: 'postgres' });

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js'
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
};

const runMigrations = async (): Promise<void> => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig: { name: string }): string => mig.name)
  });
};

const rollbackMigration = async (): Promise<void> => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async (): Promise<null> => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('database connected');
  } catch (err) {
    console.log('connecting database failed');
    console.log(err);
    return process.exit(1);
  }
  return null;
};

export { connectToDatabase, sequelize, rollbackMigration };
