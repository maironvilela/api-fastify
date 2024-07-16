import { knex as setupKnex, Knex } from 'knex'
import { env } from './src/env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_URL === 'sqlite'
      ? { filename: env.DATABASE_URL }
      : env.DATABASE_URL,

  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}

export const knex = setupKnex(config)
