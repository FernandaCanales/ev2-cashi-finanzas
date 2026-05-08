import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import type { CreateCategoryInput } from '../schemas'
import type { Category } from '../types'

//CARGA LOS DATOS
const STORAGE_KEY = 'categories'

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true)
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      setCategories(raw ? JSON.parse(raw) : [])
    } catch {
      setError('No se pudieron cargar las categorías')
    } finally {
      setLoading(false)
    }
  }, [])


  useEffect(() => {
    loadCategories()
  }, [loadCategories])

// GUARDA DATOS EN ASYNC STORAGE Y ACTUALIZA EL ESTADO
  const persist = async (newCategories: Category[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories))
    setCategories(newCategories)
  }

  const createCategory = async (input: CreateCategoryInput) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: input.name,
    }
    await persist([...categories, newCategory])
  }
  

  const updateCategory = async (id: string, input: CreateCategoryInput) => {
    await persist(
      categories.map(c => c.id === id ? { ...c, ...input } : c)
    )
  }

  const deleteCategory = async (id: string) => {
    await persist(categories.filter(c => c.id !== id))
  }

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    reload: loadCategories,
  }
}