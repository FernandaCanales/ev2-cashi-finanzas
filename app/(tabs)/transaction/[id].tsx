import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useCategories } from '../../../hooks/useCategories'
import { useTransactionForm } from '../../../hooks/useTransactionForm'
import { useTransactions } from '../../../hooks/useTransactions'

export default function TransactionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const isEditing = id !== 'new'
  const { transactions, createTransaction, updateTransaction, reload: reloadTransactions } = useTransactions()
  const { categories, reload: reloadCategories } = useCategories()

  useFocusEffect(
    useCallback(() => {
      reloadTransactions()
      reloadCategories()
    }, [reloadTransactions, reloadCategories])
  )

  const transaction = isEditing ? transactions.find(t => t.id === id) : undefined

  const {
    amount, setAmount,
    type, setType,
    description, setDescription,
    categoryId, setCategoryId,
    errors, submitting, handleSubmit,
  } = useTransactionForm({
    defaultValues: transaction ? {
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      categoryId: transaction.categoryId,
    } : undefined,
    onSubmit: async (data) => {
      if (isEditing) {
        await updateTransaction(id, data)
      } else {
        await createTransaction(data)
      }
      router.back()
    },
  })

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: isEditing ? 'Editar Transacción' : 'Nueva Transacción' }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          <View style={styles.card}>
            <Text style={styles.title}>
              {isEditing ? 'Editar Transacción' : 'Nueva Transacción'}
            </Text>

            <Text style={styles.label}>Tipo</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeButton, type === 'income' && styles.typeActive]}
                onPress={() => setType('income')}
              >
                <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
                  Ingreso
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === 'expense' && styles.typeActiveExpense]}
                onPress={() => setType('expense')}
              >
                <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
                  Gasto
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={[styles.input, errors.amount ? styles.inputError : null]}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
            {errors.amount ? <Text style={styles.error}>{errors.amount}</Text> : null}

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, errors.description ? styles.inputError : null]}
              placeholder="Ej: Compra supermercado..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
            />
            {errors.description ? <Text style={styles.error}>{errors.description}</Text> : null}

            <Text style={styles.label}>Categoría</Text>
            {categories.length === 0 ? (
              <Text style={styles.warning}>
                Primero crea una categoría en la pestaña Categorías
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, categoryId === cat.id && styles.categoryChipActive]}
                    onPress={() => setCategoryId(cat.id)}
                  >
                    <Text style={[styles.categoryChipText, categoryId === cat.id && styles.categoryChipTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            {errors.categoryId ? <Text style={styles.error}>{errors.categoryId}</Text> : null}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.buttonText}>
                {submitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#410455',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  typeActive: {
    backgroundColor: '#e6ffe6',
    borderColor: '#2ecc71',
  },
  typeActiveExpense: {
    backgroundColor: '#ffe6e6',
    borderColor: '#e74c3c',
  },
  typeText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  typeTextActive: {
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  error: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 16,
  },
  warning: {
    color: '#e67e22',
    fontSize: 14,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff8e6',
    borderRadius: 8,
  },
  categoriesScroll: {
    marginBottom: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 16,
  },
  categoryChipActive: {
    backgroundColor: '#410455',
    borderColor: '#410455',
  },
  categoryChipText: {
    color: '#555',
    fontSize: 14,
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#410455',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    padding: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#999',
    fontSize: 16,
  },
})