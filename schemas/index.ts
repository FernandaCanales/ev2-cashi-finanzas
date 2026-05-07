import * as z from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'El nombre no puede estar vacío'),
})

export const createTransactionSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a 0'),
  type: z.enum(['income', 'expense']),
  description: z.string().min(1, 'La descripción no puede estar vacía'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>