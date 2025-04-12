import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Bell, Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
                Nunca mais esqueça de tomar seus medicamentos
              </h1>
              <p className="text-xl text-blue-700">
                O Medication Reminder ajuda você a gerenciar seus medicamentos com lembretes personalizados, garantindo
                que você nunca perca uma dose.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/register">Criar Conta Grátis</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Link href="/login">Fazer Login</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Medication Reminder App"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Benefícios do Medication Reminder</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <Bell className="h-12 w-12 text-blue-600 mb-2" />
                <CardTitle>Lembretes Personalizados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Configure lembretes personalizados para cada medicamento, com horários e frequências específicas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <Calendar className="h-12 w-12 text-blue-600 mb-2" />
                <CardTitle>Histórico Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acompanhe seu histórico de medicamentos tomados e mantenha um registro completo do seu tratamento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <Clock className="h-12 w-12 text-blue-600 mb-2" />
                <CardTitle>Nunca Esqueça</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receba notificações no momento certo, garantindo que você nunca esqueça de tomar seus medicamentos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-blue-900">Planos e Preços</h2>
          <p className="text-center text-blue-700 mb-12 max-w-2xl mx-auto">
            Escolha o plano que melhor atende às suas necessidades
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Plano Gratuito</CardTitle>
                <CardDescription className="text-xl font-bold mt-2">R$ 0,00</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Até 3 lembretes de medicamentos</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Notificações por e-mail</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Histórico básico</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  <Link href="/register">Começar Grátis</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white border-blue-200 border-2">
              <CardHeader className="text-center pb-2">
                <div className="bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-full w-fit mx-auto mb-2">
                  Recomendado
                </div>
                <CardTitle className="text-2xl">Plano Premium</CardTitle>
                <CardDescription className="text-xl font-bold mt-2">R$ 19,90/mês</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Lembretes ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Notificações por e-mail e WhatsApp</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Histórico completo e estatísticas</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Compartilhamento com cuidadores</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  <Link href="/register?plan=premium">Assinar Premium</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-900">Pronto para nunca mais esquecer seus medicamentos?</h2>
          <p className="text-xl text-blue-700 mb-8">
            Junte-se a milhares de pessoas que confiam no Medication Reminder para gerenciar seus medicamentos.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/register" className="flex items-center">
              Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
