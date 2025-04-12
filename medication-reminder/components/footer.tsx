import Link from "next/link"
import { Bell } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-1 rounded-md">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-bold text-xl">Medication Reminder</span>
            </div>
            <p className="text-blue-200">
              Nunca mais esqueça de tomar seus medicamentos com nosso sistema de lembretes personalizados.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Produto</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-blue-200 hover:text-white">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-blue-200 hover:text-white">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-blue-200 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-blue-200 hover:text-white">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-200 hover:text-white">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-blue-200 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-blue-200 hover:text-white">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-200 hover:text-white">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-blue-200 hover:text-white">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
          <p>&copy; {new Date().getFullYear()} Medication Reminder. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
