# React Native – Temas para la presentación

Este documento lista los principales temas de **React Native** que pueden ser útiles durante la defensa del proyecto.  Cada tema está clasificado en **Fácil** (probablemente ya dominado por la mayoría) y **Difícil** (requiere mayor profundidad o preparación).

---

## Temas fáciles

| Tema | Breve descripción |
|------|--------------------|
| **Configuración del entorno** | Instalación de Node, `expo-cli`, y creación de un proyecto con `expo init`. |
| **Navegación con React Navigation** | Uso de `StackNavigator`, `TabNavigator` y paso de parámetros entre pantallas. |
| **Estilos con StyleSheet** | Creación de estilos reutilizables, uso de `Dimensions` y `Platform` para adaptar a iOS/Android. |
| **Gestión de estado local** | Uso de `useState`, `useReducer` y contexto (`React.Context`). |
| **Uso de componentes básicos** | `View`, `Text`, `Image`, `ScrollView`, `FlatList` (para listas pequeñas). |
| **Acceso a sensores y dispositivos** | Uso de APIs Expo (`Location`, `Camera`, `Permissions`). |
| **Publicar la app** | Generar builds con `expo build` o EAS, configuraciones de `app.json`. |

---

## Temas difíciles

| Tema | Por qué es desafiante |
|------|----------------------|
| **Rendimiento y optimización** | Uso de `FlatList` avanzado, `React.memo`, `useCallback`, `getItemLayout`, y profiling con Flipper. |
| **Módulos nativos y bridging** | Creación de código nativo (Java/Kotlin, Objective‑C/Swift) y exposición a JavaScript mediante `NativeModules`. |
| **Gestión de estado remoto** | Integración con TanStack Query, caché, invalidación y sincronización con el backend. |
| **Configuración de tipos y validación** | Uso de TypeScript estricto, `unknown` + Zod para validar respuestas del servidor sin `any`. |
| **Manejo de moneda y formatos** | Implementar el tipo `Money`, convertir unidades menores, formatear con `Intl.NumberFormat` según la moneda. |
| **Seguridad en el cliente** | Uso de `expo-secure-store`, gestión de variables de entorno, evitar hard‑coding de secretos. |
| **Testing y CI** | Configuración de pruebas unitarias (`jest`), pruebas de integración con `react-native-testing-library`, y ejecución del script `./scripts/verify.sh`. |
| **Deploy y OTA updates** | Configuración de EAS Update para actualizaciones over‑the‑air sin pasar por stores.

---

> **Tip**: Durante la presentación, si surge alguna pregunta, pueden referirse a este listado para indicar rápidamente el nivel de complejidad del tema y ofrecer una respuesta más técnica o resumida según corresponda.
