"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

export type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  startDate: string
  endDate?: string
  notes?: string
  active: boolean
  createdAt: string
}

export type MedicationDose = {
  id: string
  medicationId: string
  medicationName: string
  dosage: string
  date: string
  time: string
  status: "pending" | "taken" | "missed"
}

type MedicationContextType = {
  medications: Medication[]
  doses: MedicationDose[]
  isLoading: boolean
  addMedication: (medication: Omit<Medication, "id" | "createdAt" | "active">) => Promise<void>
  updateMedication: (id: string, medication: Partial<Medication>) => Promise<void>
  deleteMedication: (id: string) => Promise<void>
  toggleMedicationStatus: (id: string) => Promise<void>
  markDoseAsTaken: (id: string) => Promise<void>
  markDoseAsMissed: (id: string) => Promise<void>
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined)

export function MedicationProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [doses, setDoses] = useState<MedicationDose[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Carrega dados do localStorage ao iniciar
  useEffect(() => {
    const storedMedications = localStorage.getItem("medication-reminder-medications")
    const storedDoses = localStorage.getItem("medication-reminder-doses")

    if (storedMedications) {
      setMedications(JSON.parse(storedMedications))
    } else {
      // Dados iniciais de exemplo
      const initialMedications: Medication[] = [
        {
          id: "1",
          name: "Paracetamol",
          dosage: "1 comprimido",
          frequency: "3x ao dia",
          times: ["08:00", "14:00", "20:00"],
          startDate: "2025-04-01",
          notes: "Tomar após as refeições",
          active: true,
          createdAt: "2025-04-01T10:00:00Z",
        },
        {
          id: "2",
          name: "Vitamina C",
          dosage: "1 comprimido",
          frequency: "1x ao dia",
          times: ["12:30"],
          startDate: "2025-04-01",
          active: true,
          createdAt: "2025-04-01T10:00:00Z",
        },
        {
          id: "3",
          name: "Omeprazol",
          dosage: "1 cápsula",
          frequency: "1x ao dia",
          times: ["19:00"],
          startDate: "2025-04-01",
          active: true,
          createdAt: "2025-04-01T10:00:00Z",
        },
      ]
      setMedications(initialMedications)
      localStorage.setItem("medication-reminder-medications", JSON.stringify(initialMedications))
    }

    if (storedDoses) {
      setDoses(JSON.parse(storedDoses))
    } else {
      // Dados iniciais de exemplo
      const today = new Date().toISOString().split("T")[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

      const initialDoses: MedicationDose[] = [
        {
          id: "1",
          medicationId: "1",
          medicationName: "Paracetamol",
          dosage: "1 comprimido",
          date: today,
          time: "08:00",
          status: "taken",
        },
        {
          id: "2",
          medicationId: "1",
          medicationName: "Paracetamol",
          dosage: "1 comprimido",
          date: today,
          time: "14:00",
          status: "pending",
        },
        {
          id: "3",
          medicationId: "1",
          medicationName: "Paracetamol",
          dosage: "1 comprimido",
          date: today,
          time: "20:00",
          status: "pending",
        },
        {
          id: "4",
          medicationId: "2",
          medicationName: "Vitamina C",
          dosage: "1 comprimido",
          date: today,
          time: "12:30",
          status: "pending",
        },
        {
          id: "5",
          medicationId: "3",
          medicationName: "Omeprazol",
          dosage: "1 cápsula",
          date: today,
          time: "19:00",
          status: "pending",
        },
        {
          id: "6",
          medicationId: "1",
          medicationName: "Paracetamol",
          dosage: "1 comprimido",
          date: yesterday,
          time: "08:00",
          status: "taken",
        },
        {
          id: "7",
          medicationId: "1",
          medicationName: "Paracetamol",
          dosage: "1 comprimido",
          date: yesterday,
          time: "14:00",
          status: "taken",
        },
        {
          id: "8",
          medicationId: "1",
          medicationName: "Paracetamol",
          dosage: "1 comprimido",
          date: yesterday,
          time: "20:00",
          status: "taken",
        },
      ]
      setDoses(initialDoses)
      localStorage.setItem("medication-reminder-doses", JSON.stringify(initialDoses))
    }

    setIsLoading(false)
  }, [])

  // Salva medicamentos no localStorage quando mudam
  useEffect(() => {
    if (medications.length > 0) {
      localStorage.setItem("medication-reminder-medications", JSON.stringify(medications))
    }
  }, [medications])

  // Salva doses no localStorage quando mudam
  useEffect(() => {
    if (doses.length > 0) {
      localStorage.setItem("medication-reminder-doses", JSON.stringify(doses))
    }
  }, [doses])

  // Adiciona um novo medicamento
  const addMedication = async (medication: Omit<Medication, "id" | "createdAt" | "active">) => {
    setIsLoading(true)
    try {
      // Simulação de chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newMedication: Medication = {
        ...medication,
        id: Date.now().toString(),
        active: true,
        createdAt: new Date().toISOString(),
      }

      // Adiciona o medicamento à lista
      setMedications((prev) => [...prev, newMedication])

      // Gera doses para o medicamento
      const today = new Date().toISOString().split("T")[0]
      const newDoses: MedicationDose[] = newMedication.times.map((time, index) => ({
        id: `${newMedication.id}-${index}`,
        medicationId: newMedication.id,
        medicationName: newMedication.name,
        dosage: newMedication.dosage,
        date: today,
        time,
        status: "pending",
      }))

      setDoses((prev) => [...prev, ...newDoses])

      toast({
        title: "Medicamento adicionado",
        description: `${newMedication.name} foi adicionado com sucesso!`,
      })
    } catch (error) {
      toast({
        title: "Erro ao adicionar medicamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Atualiza um medicamento existente
  const updateMedication = async (id: string, medicationUpdate: Partial<Medication>) => {
    setIsLoading(true)
    try {
      // Simulação de chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, ...medicationUpdate } : med)))

      // Atualiza as doses relacionadas se o nome ou dosagem mudou
      if (medicationUpdate.name || medicationUpdate.dosage) {
        const updatedMedication = medications.find((m) => m.id === id)
        if (updatedMedication) {
          setDoses((prev) =>
            prev.map((dose) => {
              if (dose.medicationId === id) {
                return {
                  ...dose,
                  medicationName: medicationUpdate.name || updatedMedication.name,
                  dosage: medicationUpdate.dosage || updatedMedication.dosage,
                }
              }
              return dose
            }),
          )
        }
      }

      toast({
        title: "Medicamento atualizado",
        description: "As alterações foram salvas com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar medicamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Remove um medicamento
  const deleteMedication = async (id: string) => {
    setIsLoading(true)
    try {
      // Simulação de chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove o medicamento
      setMedications((prev) => prev.filter((med) => med.id !== id))

      // Remove as doses relacionadas
      setDoses((prev) => prev.filter((dose) => dose.medicationId !== id))

      toast({
        title: "Medicamento removido",
        description: "O medicamento foi removido com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover medicamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Ativa/desativa um medicamento
  const toggleMedicationStatus = async (id: string) => {
    setIsLoading(true)
    try {
      // Simulação de chamada de API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setMedications((prev) =>
        prev.map((med) => {
          if (med.id === id) {
            const newStatus = !med.active
            toast({
              title: newStatus ? "Medicamento ativado" : "Medicamento desativado",
              description: `${med.name} foi ${newStatus ? "ativado" : "desativado"} com sucesso!`,
            })
            return { ...med, active: newStatus }
          }
          return med
        }),
      )
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Marca uma dose como tomada
  const markDoseAsTaken = async (id: string) => {
    try {
      // Simulação de chamada de API
      await new Promise((resolve) => setTimeout(resolve, 300))

      setDoses((prev) =>
        prev.map((dose) => {
          if (dose.id === id) {
            toast({
              title: "Dose registrada",
              description: `${dose.medicationName} marcado como tomado!`,
            })
            return { ...dose, status: "taken" }
          }
          return dose
        }),
      )
    } catch (error) {
      toast({
        title: "Erro ao registrar dose",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    }
  }

  // Marca uma dose como perdida
  const markDoseAsMissed = async (id: string) => {
    try {
      // Simulação de chamada de API
      await new Promise((resolve) => setTimeout(resolve, 300))

      setDoses((prev) =>
        prev.map((dose) => {
          if (dose.id === id) {
            toast({
              title: "Dose não tomada",
              description: `${dose.medicationName} marcado como não tomado.`,
              variant: "destructive",
            })
            return { ...dose, status: "missed" }
          }
          return dose
        }),
      )
    } catch (error) {
      toast({
        title: "Erro ao registrar dose",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    }
  }

  return (
    <MedicationContext.Provider
      value={{
        medications,
        doses,
        isLoading,
        addMedication,
        updateMedication,
        deleteMedication,
        toggleMedicationStatus,
        markDoseAsTaken,
        markDoseAsMissed,
      }}
    >
      {children}
    </MedicationContext.Provider>
  )
}

export function useMedication() {
  const context = useContext(MedicationContext)
  if (context === undefined) {
    throw new Error("useMedication deve ser usado dentro de um MedicationProvider")
  }
  return context
}
