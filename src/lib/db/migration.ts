import path from 'path';
import { fileURLToPath } from 'url';
import { promises } from 'fs';
import { db } from './';
import { FileMigrationProvider, Migrator } from 'kysely';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigration = async () => {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs: promises,
      path,
      migrationFolder: path.join(__dirname, 'migrations')
    })
  })

  const { error, results } = await migrator.migrateToLatest()

  if (error) {
    console.error('failed to apply migrations')
    console.error(error)
    process.exit(1)
  }

  results?.forEach((result) => {
    if (result.status === 'Success') {
      console.log(`migration "${result.migrationName}" was executed successfully`)
    } else if (result.status === 'Error') {
      console.error(`migration "${result.migrationName}" has failed`)
    }
  })

  await db.destroy()
}

runMigration()
