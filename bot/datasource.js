const { config } = require('dotenv');
const { glob } = require('glob');
const { DataSource } = require('typeorm');
config();

const { MIGRATE_DATABASE_URL } = process.env;

const dataSource = new DataSource({
    type: 'mysql',
    url: MIGRATE_DATABASE_URL,
    entities: [
        // We use the injector to accomplish this in the app, but need this
        // here to find entities, too.
        ...glob
            .sync('./src/**/*.entity.ts')
            .map((file) => Object.values(require(file)))
            .flat(),
    ],
    migrations: [
        ...glob
            .sync('./src/migrations/*.ts')
            .map((file) => Object.values(require(file)))
            .flat(),
    ],
    cli: {
        migrationsDir: 'src/migrations',
    },
});

module.exports = {
    dataSource,
};
