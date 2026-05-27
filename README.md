# Cashi — App Mobile de Finanzas Personales

Aplicación móvil de finanzas personales desarrollada con React Native + Expo para la Evaluación 2 y 3 del ramo Desarrollo de Aplicaciones Móviles.

---

## Video demostrativo Evaluación 2
https://youtu.be/dZagfx6zjVA

## Video demostrativo Evaluación 3
https://youtube.com/...

---

## Que hace la app

- Login con credenciales hardcodeadas
- Gestión de categorías (crear, listar, editar, eliminar)
- Gestión de transacciones (crear, listar, editar, eliminar)
- Pantalla de balance con total ingresos, egresos y balance
- Datos persistidos en el dispositivo con AsyncStorage
- Adjuntar foto del comprobante a cada transacción (cámara o galería)
- Registrar ubicación GPS al crear una transacción

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

4. Instalar AsyncStorage:
   npx expo install @react-native-async-storage/async-storage

5. Instalar Zod:
   yarn add zod

6. Instalar expo-image-picker:
   npx expo install expo-image-picker

7. Instalar expo-location:
   npx expo install expo-location

8. Correr la app:
   yarn start

9. Escanear el QR con Expo Go

### Credenciales de acceso
- Email: fernanda@correo.cl
- Contraseña: blabla123

---

## Arquitectura

La app sigue el patrón de separación entre lógica y presentación:

- **Hooks** — contienen toda la lógica y el acceso a AsyncStorage
- **Pantallas** — solo renderizan, no tienen lógica de negocio

### Hooks creados
- `useCategories` — CRUD de categorías
- `useTransactions` — CRUD de transacciones + cálculo del balance
- `useCategoryForm` — validación del formulario de categorías con Zod
- `useTransactionForm` — validación del formulario de transacciones con Zod
- `useImagePicker` — acceso a cámara y galería + manejo de permisos
- `useLocation` — acceso a GPS + manejo de permisos

---

## Uso de IA

Se utilizó Claude (Anthropic) como asistente durante el desarrollo.

**Para qué se usó:**
- Generación de la estructura base de hooks y pantallas
- Corrección de errores de compatibilidad con Zod v4
- Configuración de rutas dinámicas con Expo Router
- Generación de hooks useImagePicker y useLocation

**Qué aprendimos:**
- La importancia de separar la lógica en custom hooks
- Cómo funciona el patrón read-modify-write de AsyncStorage
- Por qué el balance debe calcularse en el hook y no en el componente
- Cómo usar useFocusEffect para actualizar datos al volver a una pantalla
- Cómo manejar permisos de hardware en el hook y no en el componente
- Que los permisos de cámara, galería y GPS solo se piden la primera vez

---

## Tecnologías usadas

- React Native + Expo SDK 54
- TypeScript
- Expo Router v6
- AsyncStorage v2
- Zod v4
- expo-image-picker v17
- expo-location v19