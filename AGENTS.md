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