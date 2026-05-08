import { useEffect, useState } from 'react'
import type { CreateTransactionInput } from '../schemas'
import { createTransactionSchema } from '../schemas'

interface UseTransactionFormProps {
  defaultValues?: CreateTransactionInput
  onSubmit: (data: CreateTransactionInput) => Promise<void>
}

export const useTransactionForm = ({ defaultValues, onSubmit }: UseTransactionFormProps) => {
  const [amount, setAmount] = useState(defaultValues?.amount?.toString() ?? '')
  const [type, setType] = useState<'income' | 'expense'>(defaultValues?.type ?? 'income')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [categoryId, setCategoryId] = useState(defaultValues?.categoryId ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (defaultValues) {
      setAmount(defaultValues.amount?.toString() ?? '')
      setType(defaultValues.type ?? 'income')
      setDescription(defaultValues.description ?? '')
      setCategoryId(defaultValues.categoryId ?? '')
    }
  }, [
    defaultValues?.amount,
    defaultValues?.type,
    defaultValues?.description,
    defaultValues?.categoryId,
  ])

  const handleSubmit = async () => {
    const result = createTransactionSchema.safeParse({
      amount: parseFloat(amount),
      type,
      description,
      categoryId,
    })

    if (!result.success) {
      const flat = result.error.flatten()
      setErrors({
        amount: flat.fieldErrors.amount?.[0] ?? '',
        type: flat.fieldErrors.type?.[0] ?? '',
        description: flat.fieldErrors.description?.[0] ?? '',
        categoryId: flat.fieldErrors.categoryId?.[0] ?? '',
      })
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      await onSubmit(result.data)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    amount, setAmount,
    type, setType,
    description, setDescription,
    categoryId, setCategoryId,
    errors, submitting, handleSubmit,
  }
}