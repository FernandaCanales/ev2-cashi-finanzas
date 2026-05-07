import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useTransactions } from '../../hooks/useTransactions'

export default function BalanceScreen() {
  const { totalIncome, totalExpense, balance, reload } = useTransactions()

  useFocusEffect(
    useCallback(() => {
      reload()
    }, [reload])
  )

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Ingresos</Text>
          <Text style={[styles.cardAmount, styles.income]}>
            ${totalIncome.toFixed(2)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Egresos</Text>
          <Text style={[styles.cardAmount, styles.expense]}>
            ${totalExpense.toFixed(2)}
          </Text>
        </View>

        <View style={[styles.card, styles.balanceCard]}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={[
            styles.balanceAmount,
            balance >= 0 ? styles.income : styles.expense
          ]}>
            ${balance.toFixed(2)}
          </Text>
        </View>

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
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  income: {
    color: '#2ecc71',
  },
  expense: {
    color: '#e74c3c',
  },
  balanceCard: {
    backgroundColor: '#410455',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#d4b8e0',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
})