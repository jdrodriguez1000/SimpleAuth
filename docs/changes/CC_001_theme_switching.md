# Control de Cambio: CC-001 (Theme Switching Support)

> [!IMPORTANT]
> **Estado**: `Draft` (Pendiente de Aprobación por el Usuario)
> **Fecha de Solicitud**: 2026-04-01T13:25:00Z
> **Prioridad**: Media-Baja (Mejora de UX)

## 1. Contexto y Necesidad
El usuario solicita que el sistema de autenticación SimpleAuth (específicamente el dashboard/perfil) incluya soporte nativo para **Modo Día** y **Modo Oscuro** (Theme Switching). Originalmente, el sistema se planteó como una interfaz moderna sin especificar el cambio dinámico de temas.

## 2. Documentación Afectada
| Documento | Sección | Impacto |
| :--- | :--- | :--- |
| `docs/governance/PROJECT_scope.md` | 3.2 Management & Maintenance | Adición de F7: Theme Switching. |
| `docs/governance/PROJECT_architecture.md` | 1. Visión Arquitectónica | Adición de `next-themes` como estándar de UI en Next.js. |
| `docs/f1_1.1/f1_1.1_prd.md` | 4. Functional Requirements | Requerimiento de mockups duales (Light/Dark). |

## 3. Propuesta Técnica y Dependencias
- **Tecnología**: Uso de la librería `next-themes` integrada con Tailwind CSS (`class` strategy).
- **Persistencia**: La preferencia del tema se almacenará en `LocalStorage` (cliente) para evitar modificaciones en la estructura de la base de datos `PostgreSQL`.
- **UI**: Adición de un componente `ThemeToggle` en el encabezado del dashboard y perfil.
- **Mockups**: Se generarán versiones Light y Dark para cada vista crítica definida en la etapa 1.1.

## 4. Análisis de Impacto (Devil's Advocate)
- **Técnico (+)**: Mejora sustancial de la accesibilidad y ergonomía visual.
- **Técnico (-)**: Requiere manejar la hidratación (Hydration Mismatch) típica de Next.js al cargar temas antes del renderizado.
- **Tiempo**: Incidencia mínima (+0.5 días en diseño y +0.5 días en frontend).
- **Presupuesto**: Sin impacto (Uso de librerías open source).

## 5. Decisión Final
- **Estatus**: `Aprobado` ✅
- **Aprobado por**: USUARIO (Confirmación Interactiva)
- **Fecha de Ejecución**: 2026-04-01T13:25:00Z
