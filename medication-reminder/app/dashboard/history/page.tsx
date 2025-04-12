"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Calendar, Clock, Download, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMedication } from "@/contexts/medication-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"

export default function History() {
  const { medications, doses, isLoading } = useMedication()
  const searchParams = useSearchParams()

  // Filtros
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedMedication, setSelectedMedication] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Inicializa o filtro de medicamento a partir da URL se existir
  useEffect(() => {
    const medicationId = searchParams.get("medication")
    if (medicationId) {
      setSelectedMedication(medicationId)
    }
  }, [searchParams])

  // Filtra as doses com base nos filtros selecionados
  const filteredDoses = doses.filter((dose) => {
    // Filtro de data
    if (selectedDate && dose.date !== selectedDate) return false

    // Filtro de medicamento
    if (selectedMedication !== "all" && dose.medicationId !== selectedMedication) return false

    // Filtro de status
    if (selectedStatus !== "all" && dose.status !== selectedStatus) return false

    return true
  })

  // Agrupa as doses por data
  const dosesByDate = filteredDoses.reduce(
    (acc, dose) => {
      if (!acc[dose.date]) {
        acc[dose.date] = []
      }
      acc[dose.date].push(dose)
      return acc
    },
    {} as Record<string, typeof doses>,
  )

  // Ordena as datas em ordem decrescente (mais recente primeiro)
  const sortedDates = Object.keys(dosesByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  // Função para exportar o histórico como CSV
  const exportHistory = () => {
    // Cabeçalho do CSV
    let csv = "Data,Hora,Medicamento,Dosagem,Status\n"

    // Adiciona cada dose ao CSV
    filteredDoses.forEach((dose) => {
      const status = dose.status === "taken" ? "Tomado" : dose.status === "missed" ? "Não tomado" : "Pendente"
      csv += `${dose.date},${dose.time},"${dose.medicationName}","${dose.dosage}",${status}\n`
    })

    // Cria um blob e um link para download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "historico-medicamentos.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return <HistorySkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Doses</h1>
          <p className="text-gray-600">Acompanhe o histórico de medicamentos tomados</p>
        </div>
        <Button
          variant="outline"
          className="mt-4 md:mt-0 flex items-center"
          onClick={exportHistory}
          disabled={filteredDoses.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar Histórico
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input type="date" className="pl-9" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>
        <div className="flex-1">
          <Select value={selectedMedication} onValueChange={setSelectedMedication}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os medicamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os medicamentos</SelectItem>
              {medications.map((med) => (
                <SelectItem key={med.id} value={med.id}>
                  {med.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="taken">Tomados</SelectItem>
              <SelectItem value="missed">Não tomados</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Histórico de Medicamentos</CardTitle>
          <CardDescription>Visualize o histórico completo dos seus medicamentos</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedDates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="mb-2">Nenhum histórico encontrado.</p>
              <p className="text-sm">Tente ajustar os filtros para visualizar seu histórico.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((date) => {
                // Formata a data para exibição (DD/MM/YYYY)
                const formattedDate = new Date(date).toLocaleDateString("pt-BR")

                return (
                  <div key={date} className="space-y-4">
                    <h3 className="font-medium text-gray-900">{formattedDate}</h3>

                    <div className="space-y-3">
                      {dosesByDate[date]
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((dose) => (
                          <div
                            key={dose.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-white"
                          >
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                              <div
                                className={`${
                                  dose.status === "taken"
                                    ? "bg-green-100"
                                    : dose.status === "missed"
                                      ? "bg-red-100"
                                      : "bg-blue-100"
                                } p-2 rounded-full`}
                              >
                                {dose.status === "taken" ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : dose.status === "missed" ? (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                ) : (
                                  <Clock className="h-5 w-5 text-blue-600" />
                                )}
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

                              <Badge
                                variant="outline"
                                className={`${
                                  dose.status === "taken"
                                    ? "bg-green-100 text-green-600 border-green-200"
                                    : dose.status === "missed"
                                      ? "bg-red-100 text-red-600 border-red-200"
                                      : "bg-blue-100 text-blue-600 border-blue-200"
                                }`}
                              >
                                {dose.status === "taken"
                                  ? "Tomado"
                                  : dose.status === "missed"
                                    ? "Não tomado"
                                    : "Pendente"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function HistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40 mt-4 md:mt-0" />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="p-6 space-y-6">
          {Array.from({ length: 2 }).map((_, dateIndex) => (
            <div key={dateIndex} className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, doseIndex) => (
                  <div key={doseIndex} className="border rounded-lg p-4">
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
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
