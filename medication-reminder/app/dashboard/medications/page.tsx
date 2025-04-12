"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Plus, Clock, MoreHorizontal, Search, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMedication } from "@/contexts/medication-context"
import { Skeleton } from "@/components/ui/skeleton"
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

export default function Medications() {
  const { medications, isLoading, toggleMedicationStatus, deleteMedication, markDoseAsTaken } = useMedication()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null)

  // Filtra medicamentos com base na busca e filtro ativo
  const filteredMedications = medications
    .filter(
      (med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterActive === null || med.active === filterActive),
    )
    .sort((a, b) => {
      // Ordena por status (ativos primeiro) e depois por nome
      if (a.active !== b.active) return a.active ? -1 : 1
      return a.name.localeCompare(b.name)
    })

  // Calcula a próxima dose para cada medicamento
  const today = new Date().toISOString().split("T")[0]

  if (isLoading) {
    return <MedicationsSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Medicamentos</h1>
          <p className="text-gray-600">Gerencie seus medicamentos e lembretes</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/medications/new" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Novo Medicamento
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar medicamentos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterActive === null ? "default" : "outline"}
            className="flex-1 md:flex-none"
            onClick={() => setFilterActive(null)}
          >
            Todos
          </Button>
          <Button
            variant={filterActive === true ? "default" : "outline"}
            className="flex-1 md:flex-none"
            onClick={() => setFilterActive(true)}
          >
            Ativos
          </Button>
          <Button
            variant={filterActive === false ? "default" : "outline"}
            className="flex-1 md:flex-none"
            onClick={() => setFilterActive(false)}
          >
            Inativos
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Lista de Medicamentos</CardTitle>
          <CardDescription>Total de {medications.filter((m) => m.active).length} medicamentos ativos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMedications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="mb-2">Nenhum medicamento encontrado.</p>
                <p className="text-sm">
                  {searchTerm
                    ? "Tente ajustar sua busca ou filtros."
                    : "Adicione seu primeiro medicamento para começar."}
                </p>
                {!searchTerm && (
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/medications/new">Adicionar Medicamento</Link>
                  </Button>
                )}
              </div>
            )}

            {filteredMedications.map((med) => {
              // Encontra a próxima dose para este medicamento
              const nextDose = med.active ? med.times[0] || null : null

              return (
                <div
                  key={med.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg ${med.active ? "bg-white" : "bg-gray-50"}`}
                >
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className={`${med.active ? "bg-blue-100" : "bg-gray-200"} p-2 rounded-full`}>
                      <Bell className={`h-5 w-5 ${med.active ? "text-blue-600" : "text-gray-500"}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{med.name}</h3>
                      <p className="text-sm text-gray-600">
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {nextDose && (
                      <Badge variant="outline" className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Próxima: {nextDose}
                      </Badge>
                    )}

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/medications/${med.id}`}>Editar</Link>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => markDoseAsTaken(med.id)}>
                            Marcar como tomado
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/history?medication=${med.id}`}>Ver histórico</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleMedicationStatus(med.id)}
                            className={med.active ? "text-red-600" : "text-green-600"}
                          >
                            {med.active ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setMedicationToDelete(med.id)} className="text-red-600">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de confirmação para excluir medicamento */}
      <AlertDialog open={!!medicationToDelete} onOpenChange={() => setMedicationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir medicamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este medicamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (medicationToDelete) {
                  deleteMedication(medicationToDelete)
                  setMedicationToDelete(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function MedicationsSkeleton() {
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
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
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
