import { router, useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useCategories } from '../../hooks/useCategories'
import { useTransactions } from '../../hooks/useTransactions'

export default function TransactionsScreen() {
  const { transactions, loading, deleteTransaction, reload } = useTransactions()
  const { categories } = useCategories()

  useFocusEffect(
    useCallback(() => {
      reload()
    }, [reload])
  )

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : 'Sin categoría'
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/transaction/new')}
        >
          <Text style={styles.addButtonText}>+ Nueva Transacción</Text>
        </TouchableOpacity>

        {loading ? (
          <Text style={styles.message}>Cargando...</Text>
        ) : transactions.length === 0 ? (
          <Text style={styles.message}>No hay transacciones todavía</Text>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardLeft}>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={[
                    styles.amount,
                    item.type === 'income' ? styles.income : styles.expense
                  ]}>
                    {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                  </Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => router.push(`/(tabs)/transaction/${item.id}`)}
                    >
                      <Text style={styles.editText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteTransaction(item.id)}
                    >
                      <Text style={styles.deleteText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
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
    padding: 16,
  },
  addButton: {
    backgroundColor: '#410455',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  category: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  income: {
    color: '#2ecc71',
  },
  expense: {
    color: '#e74c3c',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#f0e6ff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editText: {
    color: '#410455',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ffe6e6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteText: {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: 14,
  },
})