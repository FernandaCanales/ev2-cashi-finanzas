import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { CreateTransactionInput } from '../schemas'
import { apiRequest, uploadReceipt } from '../services/apiService'
import type { Transaction } from '../types'

export const useTransactions = () => {
  const { token } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [balance, setBalance] = useState(0)

  // Carga las transacciones del usuario autenticado desde la API
  const loadTransactions = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const data = await apiRequest('/transactions', { token })
      // La API devuelve id como number — lo convertimos a string para mantener compatibilidad
      const normalized = data.map((t: any) => ({ ...t, id: String(t.id) }))
      setTransactions(normalized)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  // Carga el balance desde el servidor — no lo calculamos en el cliente
  const loadBalance = useCallback(async () => {
    if (!token) return
    try {
      const data = await apiRequest('/transactions/balance', { token })
      setTotalIncome(data.totalIncome)
      setTotalExpense(data.totalExpense)
      setBalance(data.balance)
    } catch {
      // Si falla el balance no bloqueamos la app
    }
  }, [token])

  useEffect(() => {
    loadTransactions()
    loadBalance()
  }, [loadTransactions, loadBalance])

  const createTransaction = async (input: CreateTransactionInput) => {
    if (!token) return
    // Si hay foto la subimos primero a R2 y usamos la URL pública
    let receiptUrl: string | undefined
    if (input.photoUri) {
      const uploaded = await uploadReceipt(input.photoUri, token)
      receiptUrl = uploaded.receiptUrl
    }

    await apiRequest('/transactions', {
      method: 'POST',
      token,
      body: {
        amount: input.amount,
        type: input.type,
        description: input.description,
        date: new Date().toISOString(),
        // La API espera categoryId como number
        categoryId: Number(input.categoryId),
        receiptUrl,
        latitude: input.location?.latitude,
        longitude: input.location?.longitude,
      },
    })
    await loadTransactions()
    await loadBalance()
  }

  const updateTransaction = async (id: string, input: CreateTransactionInput) => {
    if (!token) return
    let receiptUrl: string | undefined
    if (input.photoUri?.startsWith('file://') || input.photoUri?.startsWith('ph://')) {
      const uploaded = await uploadReceipt(input.photoUri, token)
      receiptUrl = uploaded.receiptUrl
    } else {
      receiptUrl = input.photoUri
    }

    await apiRequest(`/transactions/${id}`, {
      method: 'PATCH',
      token,
      body: {
        amount: input.amount,
        type: input.type,
        description: input.description,
        categoryId: Number(input.categoryId),
        receiptUrl,
        latitude: input.location?.latitude,
        longitude: input.location?.longitude,
      },
    })
    await loadTransactions()
    await loadBalance()
  }

  const deleteTransaction = async (id: string) => {
    if (!token) return
    await apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
      token,
    })
    await loadTransactions()
    await loadBalance()
  }

return {
    transactions,
    loading,
    error,
    totalIncome,
    totalExpense,
    balance,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    reload: loadTransactions,
    reloadBalance: loadBalance,
  }
}