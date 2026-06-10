# AGENTS.md — Registro de trabajo con IA

Este archivo documenta el proceso de desarrollo asistido por IA (Claude - Anthropic),
los errores encontrados y las soluciones aplicadas.

---

## Herramienta utilizada
- **Claude** (Anthropic) — asistente principal durante todo el desarrollo

---

## Errores encontrados y soluciones

### Error 1 — Zod v4 `errorMap`
**Qué pasó:** Claude generó código usando `errorMap` dentro de `z.enum()` que no era compatible con Zod v4.
**Error:** "Ninguna sobrecarga coincide con esta llamada"
**Solución:** Eliminar `errorMap` y dejar `z.enum(['income', 'expense'])` simple.

---

### Error 2 — Rutas dinámicas aparecían en la barra de tabs
**Qué pasó:** Claude no incluyó desde el inicio la configuración para ocultar las rutas dinámicas de la barra de tabs.
**Error:** `category/[id]` y `transaction/[id]` aparecían como tabs en la barra inferior.
**Solución:** Agregar `options={{ href: null }}` en el `_layout.tsx` para cada ruta dinámica.

---

### Error 3 — Título de pantalla mostraba la ruta
**Qué pasó:** El header mostraba `transaction/[id]` en vez del título correcto.
**Error:** Expo Router usa el nombre del archivo como título por defecto.
**Solución:** Importar `Stack` y agregar `<Stack.Screen options={{ title: '...' }} />` dentro del componente.

---

### Error 4 — Categorías no se actualizaban en el formulario de transacción
**Qué pasó:** Al agregar una nueva categoría y volver al formulario de transacción, solo aparecía la primera categoría creada.
**Por qué:** El hook useCategories dentro del formulario de transacción no recargaba los datos al entrar a la pantalla.
**Solución:** Agregar useFocusEffect con reloadCategories dentro del formulario de transacción para que recargue las categorías cada vez que se abre la pantalla.

### Error 5 — Formulario de transacción no precargaba datos al editar
**Qué pasó:** Al editar una transacción, el formulario aparecía vacío o con datos incorrectos. Solo funcionaba la primera vez.
**Por qué:** useTransactionForm inicializaba los valores solo una vez. Cuando useFocusEffect recargaba las transacciones, los defaultValues ya no se aplicaban porque el formulario ya estaba creado.
**Solución:** Agregar useEffect dentro de useTransactionForm para actualizar los campos cuando cambian los defaultValues.

---

### Error 6 — Formulario de categoría no precargaba datos al editar
**Qué pasó:** Al editar una categoría, el nombre no aparecía precargado. Solo permitía editar la primera categoría correctamente.
**Por qué:** Mismo problema que el Error 5 pero en useCategoryForm. Además faltaba useFocusEffect para recargar las categorías al entrar al formulario.
**Solución:** Agregar useEffect en useCategoryForm y useFocusEffect con reloadCategories en el formulario de categoría.

### Error 7 — useEffect con dependencias incompletas
**Qué pasó:** VS Code marcó una advertencia amarilla en useTransactionForm porque el useEffect tenía las propiedades individuales de defaultValues en la lista de dependencias en vez del objeto completo.
**Error:** "React Hook useEffect has a missing dependency: defaultValues"
**Solución:** Reemplazar la lista de dependencias individuales por [defaultValues] simplificando el código y eliminando la advertencia.

## Qué aprendimos del proceso

- Siempre verificar la versión de las librerías antes de usar la sintaxis que sugiere la IA
- La IA puede generar código correcto en concepto pero con detalles de versión incorrectos
- Es importante probar cada pantalla en el dispositivo real para detectar errores visuales
- Los hooks se inicializan una sola vez — si los datos cambian después, hay que usar useEffect para sincronizar los valores
- useFocusEffect es clave en React Native para recargar datos cada vez que el usuario vuelve a una pantalla
- El patrón read-modify-write de AsyncStorage debe aplicarse en el hook, nunca en el componente
- Probar el flujo completo de la app (crear, editar, eliminar) es fundamental para detectar errores que no aparecen probando cada pantalla por separado
- La IA genera una base funcional, pero los errores de comportamiento real solo se detectan usando la app en el dispositivo

---

### Error 8 — photoUri y location no eran reconocidos por TypeScript
**Qué pasó:** Al agregar photoUri y location al formulario de transacción, TypeScript marcó error diciendo que esas propiedades no existían en el tipo.
**Por qué:** El schema de Zod definía CreateTransactionInput sin esos campos, y ese tipo sobreescribía el de types/index.ts.
**Solución:** Agregar photoUri y location como campos opcionales en createTransactionSchema en schemas/index.ts.

---

## Qué aprendimos en la Evaluación 3

- Los permisos de hardware siempre deben pedirse en el hook, nunca en el componente
- El sistema operativo solo muestra la ventana de permiso la primera vez — después recuerda la decisión del usuario
- Si el permiso está denegado, la app debe mostrar un mensaje de error en pantalla sin usar Alert
- Los campos opcionales en TypeScript se marcan con ? y permiten extender el modelo de datos sin romper lo que ya funcionaba
- expo-image-picker y expo-location deben instalarse con npx expo install para garantizar compatibilidad con el SDK

---

## Errores del Examen Final — Integración con Backend

### Error 9 — El logout no redirigía al login
**Qué pasó:** Al presionar "Cerrar sesión" el token se borraba correctamente pero la app se quedaba en la pantalla de transacciones.
**Por qué:** Expo Router no puede navegar fuera de un grupo de tabs usando router.replace desde dentro de ese grupo. El stack ya estaba montado y no se desmontaba aunque el token cambiara.
**Solución:** Usar renderizado condicional en _layout.tsx con la propiedad redirect de Stack.Screen. Cuando token es null, la ruta (tabs) recibe redirect={!token} y Expo Router redirige automáticamente al login.
**Lección:** En Expo Router la forma correcta de manejar autenticación no es con router.replace sino con renderizado condicional o la propiedad redirect en Stack.Screen.

---

### Error 10 — Doble redirección al cerrar sesión
**Qué pasó:** Se intentó agregar router.replace dentro del AuthContext y también en el profile.tsx, lo que causaba un conflicto de navegación.
**Por qué:** Había dos llamadas a router.replace al mismo tiempo — una desde el contexto y otra desde la pantalla. Expo Router no maneja bien las navegaciones simultáneas.
**Solución:** Dejar la redirección en un solo lugar — el _layout.tsx — usando la propiedad redirect. El contexto solo borra el token y actualiza el estado, sin tocar la navegación.
**Lección:** La navegación post-logout debe manejarse en un solo lugar. El contexto maneja el estado, el layout maneja la navegación.

---

### Error 11 — Copilot de VS Code no fue eficiente para resolver el problema de navegación
**Qué pasó:** Se intentó usar el asistente Copilot de VS Code para resolver el problema del logout. Copilot identificó correctamente el diagnóstico (doble redirección) pero sus soluciones propuestas modificaban múltiples archivos a la vez sin una estrategia clara, generando más errores de los que resolvía.
**Por qué:** Copilot trabaja bien para autocompletar código o generar fragmentos pequeños, pero para problemas de arquitectura de navegación en Expo Router su enfoque fue disperso y generó conflictos entre archivos.
**Solución:** Se descartó la intervención de Copilot y se resolvió el problema con Claude paso a paso, entendiendo primero el comportamiento de Expo Router y luego aplicando la solución correcta con redirect.
**Lección:** Para problemas de arquitectura o navegación, es mejor trabajar con un asistente de forma conversacional y paso a paso que dejar que una herramienta modifique múltiples archivos de forma automática. Entender el problema antes de aplicar la solución siempre da mejores resultados.

---

### Error 12 — El balance no se actualizaba al navegar a la pestaña
**Qué pasó:** Al crear una transacción nueva y navegar a la pantalla de balance, los números no se actualizaban hasta cerrar sesión y volver a entrar.
**Por qué:** El useFocusEffect en balance.tsx llamaba a reload() que recargaba las transacciones pero no el balance. El balance se cargaba por separado con loadBalance y no estaba expuesto en el return del hook.
**Solución:** Agregar reloadBalance al return de useTransactions y llamarlo junto a reload() en el useFocusEffect de balance.tsx.
**Lección:** Cuando un hook tiene múltiples fuentes de datos (transacciones y balance), cada una necesita su propia función de recarga expuesta en el return.

---

### Error 13 — Error feo al eliminar categoría con transacciones asociadas
**Qué pasó:** Al intentar eliminar una categoría que tenía transacciones asociadas, aparecía un error feo en pantalla del tipo "Uncaught (in promise) Error: Error interno del servidor".
**Por qué:** La API devuelve un error 422 cuando se intenta borrar una categoría con transacciones. El hook lanzaba el error pero la pantalla no lo capturaba, dejando que Expo lo mostrara como un error no manejado.
**Solución:** Envolver la llamada a deleteCategory en un try/catch en la pantalla y mostrar un Alert con un mensaje amigable explicando que hay que eliminar primero las transacciones.
**Lección:** Todos los errores que vienen de la API deben capturarse en la pantalla y mostrarse de forma amigable al usuario. Un error no manejado rompe la experiencia visual de la app.

---

## Qué aprendimos en el Examen Final

- El token no se pasa como prop entre pantallas — vive en el AuthContext y los hooks lo consumen con useAuth()
- expo-secure-store guarda el token de forma encriptada en el dispositivo — es más seguro que AsyncStorage para datos sensibles
- apiService centraliza todos los fetch — si la URL base cambia, solo se cambia en un lugar
- Ningún componente ni pantalla importa fetch directamente — toda la comunicación HTTP pasa por apiService
- El balance se pide al servidor con GET /transactions/balance — no se calcula en el cliente
- Cuando la API devuelve un id como number (Prisma Int), hay que convertirlo a string para mantener compatibilidad con el código existente
- Para subir una imagen desde React Native hay que usar FormData con un objeto especial que incluye uri, name y type
- El Content-Type no debe setearse manualmente en un request multipart — fetch lo genera automáticamente con el boundary correcto
- En Expo Router la autenticación se maneja con renderizado condicional o la propiedad redirect, no con router.replace desde dentro de un grupo de tabs
- Para problemas de arquitectura es mejor trabajar paso a paso con un asistente conversacional que dejar que una herramienta modifique múltiples archivos automáticamente