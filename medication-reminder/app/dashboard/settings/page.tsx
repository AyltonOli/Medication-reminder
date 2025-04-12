"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Settings() {
  const { logout } = useAuth()
  const { toast } = useToast()

  // Estado das configurações
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("pt-BR")
  const [emailDigest, setEmailDigest] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [autoMarkAsMissed, setAutoMarkAsMissed] = useState(true)

  // Estado para diálogo de confirmação
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Função para salvar configurações
  const saveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso!",
    })
  }

  // Função para excluir conta
  const deleteAccount = () => {
    setShowDeleteDialog(false)

    // Simulação de exclusão
    setTimeout(() => {
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso. Redirecionando...",
      })

      // Logout após exclusão
      setTimeout(() => {
        logout()
      }, 2000)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações da sua conta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Preferências de Aparência</CardTitle>
          <CardDescription>Personalize a aparência do aplicativo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">Ative o modo escuro para reduzir o cansaço visual</p>
            </div>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Configurações de Notificação</CardTitle>
          <CardDescription>Gerencie como você recebe notificações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-digest">Resumo por E-mail</Label>
              <p className="text-sm text-muted-foreground">Receba um resumo diário dos seus medicamentos por e-mail</p>
            </div>
            <Switch id="email-digest" checked={emailDigest} onCheckedChange={setEmailDigest} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Notificações Push</Label>
              <p className="text-sm text-muted-foreground">Receba notificações push no seu navegador</p>
            </div>
            <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-alerts">Alertas Sonoros</Label>
              <p className="text-sm text-muted-foreground">Reproduzir som ao receber notificações</p>
            </div>
            <Switch id="sound-alerts" checked={soundAlerts} onCheckedChange={setSoundAlerts} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Configurações de Medicamentos</CardTitle>
          <CardDescription>Personalize o comportamento dos lembretes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-mark">Marcar Automaticamente como Não Tomado</Label>
              <p className="text-sm text-muted-foreground">
                Marcar automaticamente como não tomado após 2 horas do horário programado
              </p>
            </div>
            <Switch id="auto-mark" checked={autoMarkAsMissed} onCheckedChange={setAutoMarkAsMissed} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveSettings}>
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-xl text-red-600">Zona de Perigo</CardTitle>
          <CardDescription>Ações irreversíveis para sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Excluir sua conta removerá permanentemente todos os seus dados, incluindo medicamentos, histórico e
            configurações. Esta ação não pode ser desfeita.
          </p>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            Excluir Minha Conta
          </Button>
        </CardContent>
      </Card>

      {/* Diálogo de confirmação para excluir conta */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos
              servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAccount} className="bg-red-600 hover:bg-red-700">
              Excluir Conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
