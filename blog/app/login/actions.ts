"use server"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { verifyWriterCredentials } from "@/lib/auth/password"

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const from = String(formData.get("from") ?? "/writer")

  if (!username || !password) {
    redirect("/login?error=missing")
  }

  const valid = await verifyWriterCredentials(username, password)
  if (!valid) {
    redirect("/login?error=invalid")
  }

  const session = await getSession()
  session.isLoggedIn = true
  session.username = username
  await session.save()

  redirect(from.startsWith("/") ? from : "/writer")
}

export async function logoutAction() {
  const session = await getSession()
  session.destroy()
  redirect("/")
}
