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

export default function CategoriesScreen() {
  const { categories, loading, deleteCategory, reload } = useCategories()

  useFocusEffect(
    useCallback(() => {
      reload()
    }, [reload])
  )

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/category/new')}
        >
          <Text style={styles.addButtonText}>+ Nueva Categoría</Text>
        </TouchableOpacity>

        {loading ? (
          <Text style={styles.message}>Cargando...</Text>
        ) : categories.length === 0 ? (
          <Text style={styles.message}>No hay categorías todavía</Text>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push(`/(tabs)/category/${item.id}`)}
                  >
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteCategory(item.id)}
                  >
                    <Text style={styles.deleteText}>Eliminar</Text>
                  </TouchableOpacity>
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
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
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