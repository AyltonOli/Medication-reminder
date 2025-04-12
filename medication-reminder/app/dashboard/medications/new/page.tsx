"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { FormDescription } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Calendar, ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useMedication } from "@/contexts/medication-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function NewMedication() {
  const router = useRouter()
  const { addMedication, isLoading } = useMedication()
  const { toast } = useToast()

  // Estado do formulário
  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [notes, setNotes] = useState("")
  const [times, setTimes] = useState<string[]>(["08:00"])
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [whatsappNotifications, setWhatsappNotifications] = useState(false)
  const [earlyReminder, setEarlyReminder] = useState(false)
  const [confirmationReminder, setConfirmationReminder] = useState(true)

  // Estado de validação
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("basic")

  const addTime = () => {
    setTimes([...times, ""])
  }

  const removeTime = (index: number) => {
    setTimes(times.filter((_, i) => i !== index))
  }

  const updateTime = (index: number, value: string) => {
    const newTimes = [...times]
    newTimes[index] = value
    setTimes(newTimes)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validação básica
    if (!name.trim()) newErrors.name = "Nome do medicamento é obrigatório"
    if (!dosage.trim()) newErrors.dosage = "Dosagem é obrigatória"
    if (!frequency.trim()) newErrors.frequency = "Frequência é obrigatória"

    // Validação de horários
    if (times.some((time) => !time)) {
      newErrors.times = "Todos os horários devem ser preenchidos"
    }

    // Validação de datas
    if (!startDate) newErrors.startDate = "Data de início é obrigatória"
    if (endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = "Data de término deve ser posterior à data de início"
    }

    setErrors(newErrors)

    // Se houver erros, muda para a aba correspondente
    if (Object.keys(newErrors).some((key) => ["name", "dosage", "frequency"].includes(key))) {
      setActiveTab("basic")
      return false
    } else if (Object.keys(newErrors).some((key) => ["times", "startDate", "endDate"].includes(key))) {
      setActiveTab("schedule")
      return false
    }

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await addMedication({
        name,
        dosage,
        frequency,
        notes,
        times: times.filter((t) => t),
        startDate,
        endDate: endDate || undefined,
      })

      toast({
        title: "Medicamento adicionado",
        description: `${name} foi adicionado com sucesso!`,
      })

      router.push("/dashboard/medications")
    } catch (error) {
      toast({
        title: "Erro ao adicionar medicamento",
        description: "Ocorreu um erro ao adicionar o medicamento. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard/medications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Novo Medicamento</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-xl">Informações do Medicamento</CardTitle>
            <CardDescription>Preencha os detalhes do medicamento e configure os lembretes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="schedule">Horários</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome do Medicamento</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Paracetamol"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dosage">Dosagem</Label>
                    <Input
                      id="dosage"
                      placeholder="Ex: 1 comprimido, 20 gotas"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      aria-invalid={!!errors.dosage}
                    />
                    {errors.dosage && <p className="text-sm text-red-500">{errors.dosage}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger aria-invalid={!!errors.frequency}>
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Diário">Diário</SelectItem>
                        <SelectItem value="1x ao dia">1x ao dia</SelectItem>
                        <SelectItem value="2x ao dia">2x ao dia</SelectItem>
                        <SelectItem value="3x ao dia">3x ao dia</SelectItem>
                        <SelectItem value="4x ao dia">4x ao dia</SelectItem>
                        <SelectItem value="Semanal">Semanal</SelectItem>
                        <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                        <SelectItem value="Mensal">Mensal</SelectItem>
                        <SelectItem value="Se necessário">Se necessário</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.frequency && <p className="text-sm text-red-500">{errors.frequency}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Ex: Tomar após as refeições"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Horários para tomar</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addTime} className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Horário
                    </Button>
                  </div>

                  {times.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="time"
                            value={time}
                            onChange={(e) => updateTime(index, e.target.value)}
                            className="pl-9"
                            aria-invalid={!!errors.times}
                          />
                        </div>
                      </div>
                      {times.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTime(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {errors.times && <p className="text-sm text-red-500">{errors.times}</p>}

                  <div className="grid gap-2 mt-6">
                    <Label htmlFor="start-date">Data de Início</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="start-date"
                        type="date"
                        className="pl-9"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        aria-invalid={!!errors.startDate}
                      />
                    </div>
                    {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="end-date">Data de Término (opcional)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="end-date"
                        type="date"
                        className="pl-9"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        aria-invalid={!!errors.endDate}
                      />
                    </div>
                    {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por E-mail</Label>
                      <FormDescription>Receba lembretes por e-mail</FormDescription>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por WhatsApp</Label>
                      <FormDescription>Receba lembretes por WhatsApp (Plano Premium)</FormDescription>
                    </div>
                    <Switch checked={whatsappNotifications} onCheckedChange={setWhatsappNotifications} disabled />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Lembrete Antecipado</Label>
                      <FormDescription>Receba um lembrete 15 minutos antes</FormDescription>
                    </div>
                    <Switch checked={earlyReminder} onCheckedChange={setEarlyReminder} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Lembrete de Confirmação</Label>
                      <FormDescription>Confirme se tomou o medicamento</FormDescription>
                    </div>
                    <Switch checked={confirmationReminder} onCheckedChange={setConfirmationReminder} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/medications">Cancelar</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Medicamento"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
