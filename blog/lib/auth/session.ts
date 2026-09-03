import { getIronSession, type SessionOptions } from "iron-session"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"

export interface SessionData {
  isLoggedIn: boolean
  username?: string
}

function getSessionPassword(): string {
  const password = process.env.SESSION_SECRET
  if (password && password.length >= 32) return password
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set and at least 32 characters long")
  }
  return "development-secret-min-32-characters-long!!"
}

export function getSessionOptions(): SessionOptions {
  return {
    password: getSessionPassword(),
    cookieName: "digital-sage-writer",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, getSessionOptions())
}

export async function getSessionFromRequest(request: NextRequest, response: NextResponse) {
  return getIronSession<SessionData>(request, response, getSessionOptions())
}
