export interface Category {
  id: string
  name: string
}

export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  description: string
  date: string
  categoryId: string
}

export type CreateCategoryInput = Pick<Category, 'name'>

export type CreateTransactionInput = Omit<Transaction, 'id' | 'date'>

export type UpdateCategoryInput = Partial<CreateCategoryInput>

export type UpdateTransactionInput = Partial<CreateTransactionInput>