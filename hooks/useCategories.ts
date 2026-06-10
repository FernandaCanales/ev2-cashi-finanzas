import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { CreateCategoryInput } from '../schemas'
import { apiRequest } from '../services/apiService'
import type { Category } from '../types'

export const useCategories = () => {
  const { token } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carga las categorías desde la API
  const loadCategories = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const data = await apiRequest('/categories', { token })
      // La API devuelve id como number — lo convertimos a string para mantener compatibilidad
      const normalized = data.map((c: any) => ({ ...c, id: String(c.id) }))
      setCategories(normalized)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const createCategory = async (input: CreateCategoryInput) => {
    if (!token) return
    await apiRequest('/categories', {
      method: 'POST',
      token,
      body: { name: input.name },
    })
    await loadCategories()
  }

  const updateCategory = async (id: string, input: CreateCategoryInput) => {
    if (!token) return
    await apiRequest(`/categories/${id}`, {
      method: 'PATCH',
      token,
      body: { name: input.name },
    })
    await loadCategories()
  }

  const deleteCategory = async (id: string) => {
    if (!token) return
    await apiRequest(`/categories/${id}`, {
      method: 'DELETE',
      token,
    })
    await loadCategories()
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