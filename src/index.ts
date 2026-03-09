import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { todos } from './db/schema'

async function main() {
  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(process.env.DATABASE_URL!, { prepare: false })
  const db = drizzle({ client })

  console.log('Insertando tarea de prueba...')

  try {
    await db.insert(todos).values({
      task: 'Verificar conexión con Drizzle',
      done: false
    })
    console.log('✅ ¡Tarea insertada con éxito!')

    const lista = await db.select().from(todos)
    console.log('Lista de tareas actual:', lista)
  } catch (error) {
    console.error('❌ Error al operar:', error)
  } finally {
    await client.end()
  }
}

main()
