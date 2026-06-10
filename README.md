# Cashi — App Mobile de Finanzas Personales

Aplicación móvil de finanzas personales desarrollada con React Native + Expo para la Evaluación 2, 3 y Examen Final del ramo Desarrollo de Aplicaciones Móviles.

---

## Video demostrativo Evaluación 2
https://youtu.be/dZagfx6zjVA

## Video demostrativo Evaluación 3
https://youtu.be/I9D8Ird7T5c

## Video demostrativo Examen Final
(pendiente — agregar al subir video)

---

## Que hace la app

- Login y registro de usuarios con autenticación real via API
- Logout desde pantalla de perfil
- Gestión de categorías (crear, listar, editar, eliminar)
- Gestión de transacciones (crear, listar, editar, eliminar)
- Pantalla de balance con total ingresos, egresos y balance (calculado en el servidor)
- Adjuntar foto del comprobante a cada transacción (cámara o galería) — subida a Cloudflare R2
- Registrar ubicación GPS al crear una transacción
- Token guardado en expo-secure-store para persistir la sesión entre reinicios

---

## Qué cambió en la Evaluación 3

Se extendió el modelo de datos de Transaction con dos campos opcionales:
- photoUri: URI local de la foto del comprobante
- location: coordenadas GPS (latitude y longitude)

Ambos campos son opcionales. Las transacciones sin foto ni ubicación siguen funcionando igual.

Se agregaron dos hooks nuevos:
- useImagePicker — maneja cámara, galería y permisos
- useLocation — maneja GPS y permisos

---

## Qué cambió en el Examen Final

| | Evaluación 3 | Examen Final |
|---|---|---|
| Fuente de datos | AsyncStorage | API REST con JWT |
| Autenticación | Credenciales hardcodeadas | Login/registro real con token |
| Token | No aplica | expo-secure-store |
| id de transacción | string (Date.now) | number (Prisma Int) |
| Foto del comprobante | URI local en AsyncStorage | URI local subida a la API |
| Coordenadas | Guardadas en AsyncStorage | Enviadas al servidor en el body |
| Balance | Calculado en el cliente | Calculado en el servidor |
| Firma de los hooks | igual | igual |
| Componentes y pantallas | igual | igual |

Se agregaron:
- contexts/AuthContext.tsx — provee el token a toda la app via contexto
- services/apiService.ts — centraliza todas las llamadas HTTP
- app/register.tsx — pantalla de registro
- app/(tabs)/profile.tsx — pantalla de perfil con logout

---

## API consumida

URL: https://ev2-cashi-api-back.onrender.com

Esta es la API construida en el ramo Desarrollo de Aplicaciones Web II.

---

## Cómo instalar y correr la app

### Requisitos previos
- Node.js v24
- Yarn
- Expo Go instalado en tu teléfono

### Pasos

1. Clonar el repositorio:
   git clone https://github.com/FernandaCanales/ev2-cashi-finanzas.git

2. Entrar a la carpeta:
   cd ev2-cashi-finanzas

3. Instalar dependencias:
   yarn install

4. Instalar librerías nativas:
   npx expo install @react-native-async-storage/async-storage
   npx expo install expo-image-picker
   npx expo install expo-location
   npx expo install expo-secure-store

5. Instalar Zod:
   yarn add zod

6. Correr la app:
   yarn start

7. Escanear el QR con Expo Go

### Credenciales de acceso para pruebas
- Email: final@cashi.com
- Contraseña: 12345678

O puedes crear una cuenta nueva desde la pantalla de registro.

---

## Arquitectura

La app sigue el patrón de separación entre lógica y presentación:

- **Contexts** — proveen estado global (token de autenticación) a toda la app
- **Services** — centralizan las llamadas HTTP a la API
- **Hooks** — contienen toda la lógica y consumen el contexto y los servicios
- **Pantallas** — solo renderizan, no tienen lógica de negocio

### Hooks
- `useCategories` — CRUD de categorías via API
- `useTransactions` — CRUD de transacciones via API + balance desde el servidor
- `useCategoryForm` — validación del formulario de categorías con Zod
- `useTransactionForm` — validación del formulario de transacciones con Zod
- `useImagePicker` — acceso a cámara y galería + manejo de permisos
- `useLocation` — acceso a GPS + manejo de permisos

### Contextos
- `AuthContext` — provee token, login, register y logout a toda la app

### Servicios
- `apiService` — centraliza fetch, headers de autorización y manejo de errores

---

## Uso de IA

Se utilizó Claude (Anthropic) como asistente durante el desarrollo.

**Para qué se usó:**
- Generación de la estructura base de hooks y pantallas
- Corrección de errores de compatibilidad con Zod v4
- Configuración de rutas dinámicas con Expo Router
- Generación de hooks useImagePicker y useLocation
- Implementación de AuthContext con expo-secure-store
- Implementación de apiService con manejo de errores
- Reemplazo de AsyncStorage por llamadas a la API real
- Resolución del problema de navegación post-logout en Expo Router

**Qué aprendimos:**
- La importancia de separar la lógica en custom hooks
- Cómo funciona el patrón read-modify-write de AsyncStorage
- Por qué el balance debe pedirse al servidor y no calcularse en el cliente
- Cómo usar useFocusEffect para actualizar datos al volver a una pantalla
- Cómo manejar permisos de hardware en el hook y no en el componente
- Que los permisos de cámara, galería y GPS solo se piden la primera vez
- Por qué el token no se pasa como prop entre pantallas sino desde el contexto
- Cómo AuthContext provee el token a hooks y servicios sin que los componentes lo manejen
- Por qué useTransactions no sabe nada de autenticación — solo consume el token desde useAuth

---

## Tecnologías usadas

- React Native + Expo SDK 54
- TypeScript
- Expo Router v6
- AsyncStorage v2
- Zod v4
- expo-image-picker v17
- expo-location v19
- expo-secure-store
- fetch nativo (sin axios)