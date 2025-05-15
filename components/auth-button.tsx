"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"

export function AuthButton() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  if (isLoading) {
    return (
      <Button disabled variant="outline">
        <span className="animate-pulse">Carregando...</span>
      </Button>
    )
  }

  if (session) {
    return (
      <Button onClick={() => signOut()} variant="outline">
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    )
  }

  return (
    <Button onClick={() => signIn("google")}>
      <LogIn className="mr-2 h-4 w-4" />
      Entrar com Google
    </Button>
  )
}
