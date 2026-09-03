import Link from "next/link"
import { loginAction } from "./actions"

interface LoginPageProps {
  searchParams: Promise<{ from?: string; error?: string }>
}

function loginErrorMessage(error?: string) {
  if (error === "invalid") return "Invalid username or password."
  if (error === "missing") return "Username and password are required."
  return null
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { from, error } = await searchParams
  const redirectTo = from?.startsWith("/") ? from : "/writer"
  const errorMessage = loginErrorMessage(error)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bevel-out p-6 bg-content max-w-sm w-full">
        <div className="titlebar-embossed px-4 py-2 mb-4">
          <h1 className="text-sm font-bold font-mono">Writer Login</h1>
        </div>

        {errorMessage ? (
          <div className="frame bg-content-alt border-l-4 border-accent px-3 py-2 mb-4" role="alert">
            <p className="text-sm text-accent font-bold">{errorMessage}</p>
          </div>
        ) : null}

        <form action={loginAction} className="flex flex-col gap-3">
          <input type="hidden" name="from" value={redirectTo} />

          <div>
            <label className="text-xs font-mono font-bold block mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="bevel-in w-full px-2 py-2 text-base sm:text-sm font-mono text-black"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold block mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="bevel-in w-full px-2 py-2 text-base sm:text-sm font-mono text-black"
            />
          </div>

          <button type="submit" className="btn3d w-full py-2 text-sm font-bold mt-1">
            Sign In
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          <Link href="/" className="font-bold">
            &laquo; Back to the journal
          </Link>
        </p>
      </div>
    </div>
  )
}
