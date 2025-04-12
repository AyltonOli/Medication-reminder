"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, Plus, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useMedication } from "@/contexts/medication-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  const { user } = useAuth()
  const { medications, doses, isLoading, markDoseAsTaken } = useMedication()

  // Filtra medicamentos ativos
  const activeMedications = medications.filter((med) => med.active)

  // Filtra doses pendentes para hoje
  const today = new Date().toISOString().split("T")[0]
  const upcomingDoses = doses
    .filter((dose) => dose.date === today && dose.status === "pending")
    .sort((a, b) => a.time.localeCompare(b.time))

  // Filtra doses tomadas hoje
  const takenDoses = doses.filter((dose) => dose.date === today && dose.status === "taken")

  // Próxima dose
  const nextDose = upcomingDoses[0]

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.name.split(" ")[0]}!</h1>
          <p className="text-gray-600">Aqui está o resumo dos seus medicamentos para hoje.</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/medications/new" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Novo Medicamento
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-600" />
              Lembretes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeMedications.length}</p>
            <p className="text-gray-600">medicamentos configurados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Próxima Dose
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{nextDose?.time || "--:--"}</p>
            <p className="text-gray-600">{nextDose?.medicationName || "Nenhum medicamento"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-600" />
              Doses Tomadas Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{takenDoses.length}</p>
            <p className="text-gray-600">de {upcomingDoses.length + takenDoses.length} programadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Próximos Medicamentos</CardTitle>
          <CardDescription>Medicamentos programados para hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingDoses.length === 0 && takenDoses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum medicamento programado para hoje.</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/medications/new">Adicionar Medicamento</Link>
                </Button>
              </div>
            )}

            {upcomingDoses.map((dose) => (
              <div key={dose.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{dose.medicationName}</h3>
                    <p className="text-sm text-gray-600">{dose.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {dose.time}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => markDoseAsTaken(dose.id)}
                  >
                    Marcar como tomado
                  </Button>
                </div>
              </div>
            ))}

            {takenDoses.map((dose) => (
              <div key={dose.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{dose.medicationName}</h3>
                    <p className="text-sm text-gray-600">{dose.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {dose.time}
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">
                    Tomado
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Calendário de Medicamentos</CardTitle>
          <CardDescription>Visão geral dos seus medicamentos para a semana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-100">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="p-3 text-center font-medium text-sm">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 divide-x divide-y">
              {Array.from({ length: 7 }).map((_, i) => {
                // Calcula a data para este dia
                const date = new Date()
                date.setDate(date.getDate() + i)
                const dateStr = date.toISOString().split("T")[0]

                // Filtra doses para este dia
                const dayDoses = doses.filter((dose) => dose.date === dateStr)

                return (
                  <div key={i} className="p-3 h-24 overflow-y-auto">
                    <div className="text-right text-sm text-gray-500 mb-2">{date.getDate()}</div>
                    {dayDoses.map((dose) => (
                      <div
                        key={dose.id}
                        className={`text-xs p-1 rounded mb-1 ${
                          dose.status === "taken"
                            ? "bg-green-100 text-green-700"
                            : dose.status === "missed"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {dose.medicationName} - {dose.time}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40 mt-4 md:mt-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
