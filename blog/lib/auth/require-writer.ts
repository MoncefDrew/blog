import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"

export async function requireWriter() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    redirect("/login")
  }
  return session
}

export async function isWriterLoggedIn(): Promise<boolean> {
  const session = await getSession()
  return Boolean(session.isLoggedIn)
}
