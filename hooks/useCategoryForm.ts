import { useState } from 'react'
import type { CreateCategoryInput } from '../schemas'
import { createCategorySchema } from '../schemas'

interface UseCategoryFormProps {
  defaultValues?: CreateCategoryInput
  onSubmit: (data: CreateCategoryInput) => Promise<void>
}

export const useCategoryForm = ({ defaultValues, onSubmit }: UseCategoryFormProps) => {
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    const result = createCategorySchema.safeParse({ name })

    if (!result.success) {
      const flat = result.error.flatten()
      setErrors({
        name: flat.fieldErrors.name?.[0] ?? '',
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
    name,
    setName,
    errors,
    submitting,
    handleSubmit,
  }
}