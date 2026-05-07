import { router, useLocalSearchParams } from 'expo-router'
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { useCategories } from '../../../hooks/useCategories'
import { useCategoryForm } from '../../../hooks/useCategoryForm'

export default function CategoryFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const isEditing = id !== 'new'
  const { categories, createCategory, updateCategory } = useCategories()

  const category = isEditing ? categories.find(c => c.id === id) : undefined

  const { name, setName, errors, submitting, handleSubmit } = useCategoryForm({
    defaultValues: category ? { name: category.name } : undefined,
    onSubmit: async (data) => {
      if (isEditing) {
        await updateCategory(id, data)
      } else {
        await createCategory(data)
      }
      router.back()
    },
  })

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          </Text>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="Ej: Alimentación, Sueldo..."
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
          {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

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
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
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
  button: {
    backgroundColor: '#410455',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    color: '#999',
    fontSize: 16,
  },
})