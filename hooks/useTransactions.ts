import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import type { CreateTransactionInput } from '../schemas'
import type { Transaction } from '../types'

const STORAGE_KEY = 'transactions'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true)
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      setTransactions(raw ? JSON.parse(raw) : [])
    } catch {
      setError('No se pudieron cargar las transacciones')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const persist = async (newTransactions: Transaction[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions))
    setTransactions(newTransactions)
  }

  const createTransaction = async (input: CreateTransactionInput) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...input,
    }
    await persist([...transactions, newTransaction])
  }

  const updateTransaction = async (id: string, input: CreateTransactionInput) => {
    await persist(
      transactions.map(t => t.id === id ? { ...t, ...input } : t)
    )
  }

  const deleteTransaction = async (id: string) => {
    await persist(transactions.filter(t => t.id !== id))
  }

//EXTRA: calculo automático
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense
  

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
  }
}