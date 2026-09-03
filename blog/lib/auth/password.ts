import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { ensureDb, getDb } from "@/lib/db"
import { writers } from "@/lib/db/schema"

export async function verifyWriterCredentials(username: string, password: string): Promise<boolean> {
  await ensureDb()

  const [writer] = await getDb().select().from(writers).where(eq(writers.username, username)).limit(1)
  if (!writer) return false

  return bcrypt.compare(password, writer.passwordHash)
}
