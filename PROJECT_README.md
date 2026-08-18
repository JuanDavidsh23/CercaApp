# Cerca Mobile Application

## Descripción del proyecto

*Cerca* es una aplicación móvil desarrollada con **React Native** y **Expo** que permite a los usuarios buscar y reservar servicios locales de manera eficiente. El proyecto sigue una arquitectura **Clean Architecture** con capas bien definidas (Domain, Application, Infrastructure, Presentation) y utiliza **TanStack Query** para la gestión del estado del servidor.

## Tecnologías clave

- **React Native + Expo**: Desarrollo multiplataforma (iOS y Android).
- **TypeScript**: Tipado estricto, sin uso de `any` (se emplea `unknown` y Zod para validaciones).
- **Zod**: Validación de respuestas del backend en los adapters de infraestructura.
- **TanStack Query**: Manejo de datos remotos, caché y sincronización.
- **FlatList**: Renderizado eficiente de listas extensas (>5,000 items).
- **ESLint + Prettier**: Calidad de código y formato consistente.
- **pnpm** workspace**: Gestión de paquetes monorepo.

## Principios de arquitectura

1. **Limpia (Clean Architecture)** – Dependencias direccionales hacia adentro.
2. **Dominio libre de React** – La capa `src/domain/` no importa `react` ni `expo`.
3. **Validación en el borde** – Todas las respuestas del servidor pasan por esquemas Zod antes de entrar a la aplicación.
4. **Seguridad** – No se almacenan secretos en el cliente; se usan variables de entorno y `expo-secure-store`.
5. **Moneda** – Se usa el tipo `Money` con `amountMinor` y `currency`; nunca se emplean números flotantes.

## Cómo ejecutar el proyecto

```bash
# Instalar dependencias (pnpm workspace)
pnpm install

# Configurar variables de entorno (copiar .env.example a .env)
cp .env.example .env

# Iniciar el servidor de desarrollo
pnpm dev   # o expo start
```

## Verificación

Ejecutar el script de verificación antes de cualquier commit:

```bash
./scripts/verify.sh
```

Este script corre **type‑check**, **lint**, **format check** y **tests**.

---

## Equipo y distribución de temas

| Miembro | Tema(s) asignado(s) |
|---------|----------------------|
| Santiago Román | - Arquitectura Clean (capas Domain, Application, Infrastructure, Presentation)\n- Uso de TanStack Query para gestión de estado del servidor |
| Camilo | - Gestión de dependencias con `pnpm` y monorepositorios\n- Configuración de variables de entorno y seguridad con `expo-secure-store` |
| Juan José | - Implementación de Zod en el borde (validación de respuestas del backend)\n- Estrategia de manejo de moneda con el tipo `Money` |
| Juanda | - Optimización de listas con `FlatList` (rendimiento para 5k+ ítems)\n- Buenas prácticas de linting, formateado y verificación con `./scripts/verify.sh` |

---

*Este README está pensado para ser usado como material de presentación del proyecto y como guía rápida para nuevos colaboradores.*
