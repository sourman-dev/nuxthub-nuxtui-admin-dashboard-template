/**
 * Hash a password with bcrypt using the configured salt
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
export async function useHashPassword(password: string): Promise<string> {
  const config = useRuntimeConfig()
  const salt = config.passwordSalt || ''
  return await hashPassword(salt + password)
}

/**
 * Verify a password against a hashed password
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns True if password matches, false otherwise
 */
export async function useVerifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const config = useRuntimeConfig()
  const salt = config.passwordSalt || ''
  return await verifyPassword(hashedPassword, salt + password)
}
