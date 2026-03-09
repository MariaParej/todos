import {
  pgTable,
  text,
  boolean,
  uuid,
  timestamp,
  bigint,
  serial
} from 'drizzle-orm/pg-core'

// PROFILES
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull()
})

// TODOS
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  task: text('task').notNull(),
  done: boolean('done').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  profilesId: uuid('profiles_id').references(() => profiles.id, {
    onDelete: 'cascade'
  })
})
