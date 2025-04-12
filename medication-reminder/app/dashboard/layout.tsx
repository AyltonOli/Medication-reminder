"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, User, Settings, LogOut, PieChart, Calendar, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { MedicationProvider } from "@/contexts/medication-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Protege a rota - redireciona para login se não estiver autenticado
  useEffect(() => {
    setMounted(true)
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Não renderiza nada até verificar a autenticação
  if (!mounted || isLoading) {
    return <DashboardSkeleton />
  }

  // Não renderiza o conteúdo se não estiver autenticado
  if (!user) {
    return null
  }

  return (
    <MedicationProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-1 rounded-md">
                <Bell className="h-6 w-6" />
              </div>
              <span className="font-bold text-lg text-blue-900">Medication Reminder</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-3 py-2 rounded-md bg-blue-50 text-blue-700"
            >
              <PieChart className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/medications"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Bell className="h-5 w-5" />
              <span>Medicamentos</span>
            </Link>
            <Link
              href="/dashboard/history"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Calendar className="h-5 w-5" />
              <span>Histórico</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <User className="h-5 w-5" />
              <span>Perfil</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">Plano {user.plan === "premium" ? "Premium" : "Gratuito"}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top navigation */}
          <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
            <div className="md:hidden flex items-center space-x-2">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white p-1 rounded-md">
                  <Bell className="h-5 w-5" />
                </div>
                <span className="font-bold text-blue-900">Medication Reminder</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Link href="/dashboard/medications/new" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Medicamento
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Mobile navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
            <div className="flex justify-around py-2">
              <Link href="/dashboard" className="flex flex-col items-center p-2 text-blue-600">
                <PieChart className="h-6 w-6" />
                <span className="text-xs mt-1">Dashboard</span>
              </Link>
              <Link href="/dashboard/medications" className="flex flex-col items-center p-2 text-gray-600">
                <Bell className="h-6 w-6" />
                <span className="text-xs mt-1">Medicamentos</span>
              </Link>
              <Link href="/dashboard/medications/new" className="flex flex-col items-center p-2 text-gray-600">
                <div className="bg-blue-600 rounded-full p-2 -mt-6">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs mt-1">Adicionar</span>
              </Link>
              <Link href="/dashboard/history" className="flex flex-col items-center p-2 text-gray-600">
                <Calendar className="h-6 w-6" />
                <span className="text-xs mt-1">Histórico</span>
              </Link>
              <Link href="/dashboard/profile" className="flex flex-col items-center p-2 text-gray-600">
                <User className="h-6 w-6" />
                <span className="text-xs mt-1">Perfil</span>
              </Link>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">{children}</main>
        </div>
      </div>
    </MedicationProvider>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
