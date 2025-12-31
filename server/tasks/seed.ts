import {db, schema } from "hub:db"
import { users } from "../db/schema"
export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Seed database with initial admin user if no users exist'
  },
  async run() {

    // Check if users already exist
    const existingUsers = await db.select().from(schema.users).all()

    if (existingUsers.length > 0) {
      console.log('Users already exist. Skipping seed.')
      return { result: 'skipped' }
    }

    // Create admin user
    const hashedPassword = await hashPassword('!password!')

    await db.insert(users).values({
      email: 'admin@local.dev',
      hashedPassword,
      name: 'Admin',
      createdAt: new Date()
    })

    console.log('✅ Admin user created: admin@local.dev / !password!')

    return { result: 'success' }
  }
})
