import { db, schema } from 'hub:db'
import { users } from '../db/schema'

export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Seed database with initial admin user if no users exist'
  },
  async run() {
    // Delete existing users
    await db.delete(schema.users)
    console.log('Existing users deleted.')

    // Create admin user
    const hashedPassword = await useHashPassword('!password!')

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
