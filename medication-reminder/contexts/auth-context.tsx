"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string
  email: string
  plan: "free" | "premium"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Simula verificação de autenticação ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("medication-reminder-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Simula login
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulação de chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validação simulada
      if (!email || !password) {
        throw new Error("Por favor, preencha todos os campos")
      }

      // Usuário simulado
      const mockUser: User = {
        id: "1",
        name: "João Silva",
        email,
        plan: "free",
      }

      // Salva no localStorage para persistência
      localStorage.setItem("medication-reminder-user", JSON.stringify(mockUser))
      setUser(mockUser)

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo de volta, ${mockUser.name}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Simula registro
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulação de chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validação simulada
      if (!name || !email || !password) {
        throw new Error("Por favor, preencha todos os campos")
      }

      // Usuário simulado
      const mockUser: User = {
        id: "1",
        name,
        email,
        plan: "free",
      }

      // Salva no localStorage para persistência
      localStorage.setItem("medication-reminder-user", JSON.stringify(mockUser))
      setUser(mockUser)

      toast({
        title: "Conta criada com sucesso",
        description: `Bem-vindo ao Medication Reminder, ${name}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Simula logout
  const logout = () => {
    localStorage.removeItem("medication-reminder-user")
    setUser(null)
    router.push("/")
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado da sua conta",
    })
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
