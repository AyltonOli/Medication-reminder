"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Bell } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-1 rounded-md">
            <Bell className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl text-blue-900">Medication Reminder</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/features" className="text-gray-600 hover:text-blue-600">
            Funcionalidades
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
            Preços
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600">
            Sobre
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700">Criar Conta</Button>
          </Link>
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link
              href="/features"
              className="text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Funcionalidades
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Preços
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>
              Sobre
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Criar Conta</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
