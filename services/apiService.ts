// apiService.ts centraliza TODAS las llamadas HTTP a la API
// Ningún componente ni hook importa fetch directamente — todo pasa por aquí

const BASE_URL = 'https://ev2-cashi-api-back.onrender.com'

// Función principal que hace todos los requests
// Recibe la ruta, el método, el body opcional y el token opcional
export const apiRequest = async (
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    body?: object
    token?: string | null
  } = {}
) => {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Si hay token lo agregamos al header de autorización
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()

    // Si el servidor responde con error, lanzamos el mensaje que devuelve
    if (!response.ok) {
      throw new Error(data?.error || 'Error del servidor')
    }

    return data
  } catch (error) {
    // Si es un error de red (sin conexión) mostramos mensaje genérico
    if (error instanceof TypeError) {
      throw new Error('Error de conexión')
    }
    throw error
  }
}

// Función especial para subir imágenes — usa multipart/form-data en vez de JSON
export const uploadReceipt = async (uri: string, token: string) => {
  const formData = new FormData()

  // En React Native los archivos se envían con este formato especial
  formData.append('receipt', {
    uri,
    name: 'receipt.jpg',
    type: 'image/jpeg',
  } as any)

  try {
    const response = await fetch(`${BASE_URL}/transactions/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // No ponemos Content-Type aquí — fetch lo genera automáticamente con el boundary correcto
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error || 'Error al subir el comprobante')
    }

    return data
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Error de conexión')
    }
    throw error
  }
}