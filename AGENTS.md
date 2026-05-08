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

## Qué aprendimos del proceso

- Siempre verificar la versión de las librerías antes de usar la sintaxis que sugiere la IA
- La IA puede generar código correcto en concepto pero con detalles de versión incorrectos
- Es importante probar cada pantalla en el dispositivo real para detectar errores visuales