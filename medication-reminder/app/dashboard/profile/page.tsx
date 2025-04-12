"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, Shield, CreditCard, Upload, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()

  // Estado do formulário
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState("(11) 98765-4321")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Estado das preferências
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [whatsappNotifications, setWhatsappNotifications] = useState(false)
  const [reminderNotifications, setReminderNotifications] = useState(true)
  const [refillNotifications, setRefillNotifications] = useState(true)
  const [summaryNotifications, setSummaryNotifications] = useState(true)
  const [quietStart, setQuietStart] = useState("22:00")
  const [quietEnd, setQuietEnd] = useState("07:00")

  // Estado de validação
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Função para salvar informações pessoais
  const savePersonalInfo = () => {
    // Validação
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Nome é obrigatório"
    if (!email.trim()) newErrors.email = "E-mail é obrigatório"
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "E-mail inválido"

    if (password || confirmPassword) {
      if (password.length < 6) newErrors.password = "A senha deve ter pelo menos 6 caracteres"
      if (password !== confirmPassword) newErrors.confirmPassword = "As senhas não coincidem"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Simulação de salvamento
      setTimeout(() => {
        toast({
          title: "Informações atualizadas",
          description: "Suas informações pessoais foram atualizadas com sucesso!",
        })
      }, 500)
    }
  }

  // Função para salvar preferências
  const savePreferences = () => {
    // Simulação de salvamento
    setTimeout(() => {
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram atualizadas com sucesso!",
      })
    }, 500)
  }

  // Função para fazer upgrade
  const upgradeAccount = () => {
    toast({
      title: "Upgrade solicitado",
      description: "Você será redirecionado para a página de pagamento.",
    })
  }

  // Função para salvar informações de pagamento
  const savePaymentInfo = () => {
    toast({
      title: "Informações de pagamento salvas",
      description: "Suas informações de pagamento foram salvas com sucesso!",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="notifications">Preferências</TabsTrigger>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
                    <AvatarFallback className="text-2xl">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar foto
                  </Button>
                </div>

                <div className="grid gap-4 flex-1">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9"
                        aria-invalid={!!errors.name}
                      />
                    </div>
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        placeholder="Seu telefone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Nova Senha (opcional)</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      aria-invalid={!!errors.password}
                    />
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9"
                      aria-invalid={!!errors.confirmPassword}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={savePersonalInfo}>
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Preferências de Notificação</CardTitle>
              <CardDescription>Configure como deseja receber seus lembretes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Canais de Notificação</h3>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        className="rounded text-blue-600"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                      <Label htmlFor="email-notifications">Notificações por E-mail</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="whatsapp-notifications"
                        className="rounded text-blue-600"
                        disabled
                        checked={whatsappNotifications}
                        onChange={(e) => setWhatsappNotifications(e.target.checked)}
                      />
                      <Label htmlFor="whatsapp-notifications">Notificações por WhatsApp</Label>
                      <Badge variant="outline" className="ml-2 text-xs">
                        Premium
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Tipos de Lembretes</h3>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="reminder-notifications"
                        className="rounded text-blue-600"
                        checked={reminderNotifications}
                        onChange={(e) => setReminderNotifications(e.target.checked)}
                      />
                      <Label htmlFor="reminder-notifications">Lembretes de medicamentos</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="refill-notifications"
                        className="rounded text-blue-600"
                        checked={refillNotifications}
                        onChange={(e) => setRefillNotifications(e.target.checked)}
                      />
                      <Label htmlFor="refill-notifications">Alertas de reabastecimento</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="summary-notifications"
                        className="rounded text-blue-600"
                        checked={summaryNotifications}
                        onChange={(e) => setSummaryNotifications(e.target.checked)}
                      />
                      <Label htmlFor="summary-notifications">Resumo diário</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Horários de Notificação</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quiet-start">Início do período silencioso</Label>
                      <Input
                        id="quiet-start"
                        type="time"
                        value={quietStart}
                        onChange={(e) => setQuietStart(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="quiet-end">Fim do período silencioso</Label>
                      <Input
                        id="quiet-end"
                        type="time"
                        value={quietEnd}
                        onChange={(e) => setQuietEnd(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={savePreferences}>
                Salvar Preferências
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Detalhes da Assinatura</CardTitle>
              <CardDescription>Gerencie seu plano e informações de pagamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">
                      Plano Atual: {user?.plan === "premium" ? "Premium" : "Gratuito"}
                    </h3>
                    <p className="text-sm text-blue-700">
                      {user?.plan === "premium"
                        ? "Lembretes ilimitados e recursos premium"
                        : "Até 3 lembretes de medicamentos"}
                    </p>
                  </div>
                  <Badge className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 self-start md:self-center">Ativo</Badge>
                </div>
              </div>

              {user?.plan !== "premium" && (
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Upgrade para o Plano Premium</h3>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Lembretes ilimitados</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Notificações por e-mail e WhatsApp</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Histórico completo e estatísticas</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Compartilhamento com cuidadores</span>
                    </li>
                  </ul>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold">R$ 19,90</span>
                      <span className="text-gray-600">/mês</span>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={upgradeAccount}>
                      Fazer Upgrade
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">Cancele a qualquer momento. Sem taxas adicionais.</div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Informações de Pagamento</h3>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="card-number">Número do Cartão</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="card-number" placeholder="0000 0000 0000 0000" className="pl-9" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiry">Data de Validade</Label>
                      <Input id="expiry" placeholder="MM/AA" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="card-name">Nome no Cartão</Label>
                    <Input id="card-name" placeholder="Nome como aparece no cartão" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={savePaymentInfo}>
                Salvar Informações de Pagamento
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
