import { db, schema } from 'hub:db'
import { users } from '../db/schema'

export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Seed database with initial admin user if no users exist'
  },
  async run() {
    const config = useRuntimeConfig()
    const salt = config.passwordSalt || ''

    // Delete existing users
    await db.delete(schema.users)
    console.log('Existing users deleted.')

    // Create admin user
    const hashedPassword = await hashPassword(salt + '!password!')

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
