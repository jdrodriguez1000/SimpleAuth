# PROJECT_handoff.md — SimpleAuth

> Punto de guardado de sesión. Leer antes de cualquier acción técnica.
> **Regla**: Este archivo es la única fuente de verdad del estado del proyecto entre sesiones.

---

## §1. Coordenadas Actuales

| Campo | Valor |
|---|---|
| **Fase Activa** | Fase 1 — Prototipado y QA Plan |
| **Etapa Activa** | 1.1 — Mockups Visuales y UX |
| **Capa Medallón** | Frontend (UI/UX) |
| **Rama Git** | `feat/f1_1.1_setup` |
| **Progreso Global** | 0 / 8 etapas cerradas (0%) — ningún ejecutivo emitido aún |
| **SDD activo** | `docs/f1_1.1/` (PRD + SPEC v1.3.0 + PLAN + TASK) |

> **Cálculo dinámico**: E_total = 8 etapas (F1:1 + F2:2 + F3:3 + F4:2). C = 0 ejecutivos en `docs/executives/`. Progreso = 0/8 = 0%.

---

## §2. Hitos del Proyecto

```
Fase 1 — Prototipado y QA Plan
  [🔄] E1.1 — Mockups Visuales y UX          ← ACTIVA (Bloque 1 completo, Bloque 2 pendiente)

Fase 2 — Backend Core & Unit Testing
  [⬜] E2.1 — Infraestructura, DB y Observabilidad
  [⬜] E2.2 — Registro y Verificación (Double Opt-in)

Fase 3 — Motor de Autenticación, Perfil y Seguridad
  [⬜] E3.1 — Login y Gestión de JWT (RTR)
  [⬜] E3.2 — Gestión de Perfil y Reactivación
  [⬜] E3.3 — Seguridad y Robustecimiento

Fase 4 — Integración UI, Operaciones e Higiene
  [⬜] E4.1 — Integración Frontend y E2E
  [⬜] E4.2 — Orquestación GDPR e Higiene Automática
```

---

## §3. Mapa de Arquitectura — Estado Actual

### Frontend (`/frontend/`) — Next.js 15, TypeScript, Tailwind v4, Shadcn UI

| Componente / Archivo | Ruta | Estado |
|---|---|---|
| Design System Tokens | `src/app/globals.css` | ✅ Completo |
| Root Layout + ThemeProvider | `src/app/layout.tsx` | ✅ Completo |
| GlassCard | `src/components/ui/GlassCard.tsx` | ✅ Completo |
| StatusCard + ResendButton + ConfirmDeleteButton | `src/components/ui/StatusCard.tsx` | ✅ Completo |
| ThemeToggle | `src/components/ui/ThemeToggle.tsx` | ✅ Completo |
| AuthLayout | `src/components/layouts/AuthLayout.tsx` | ✅ Completo |
| AppLayout | `src/components/layouts/AppLayout.tsx` | ✅ Completo |
| SidebarNav | `src/components/layouts/SidebarNav.tsx` | ✅ Completo |
| UserNav | `src/components/ui/UserNav.tsx` | ✅ Completo |
| MockAuthContext | `src/context/MockAuthContext.tsx` | ✅ Completo |
| Logo SVG | `public/logo.svg` | ✅ Completo (G-11) |
| Favicon SVG | `public/favicon.svg` | ✅ Completo (G-11) |
| Vista /auth/login | `src/app/auth/login/page.tsx` | ⬜ Pendiente (TSK-F-05.1) |
| Vista /auth/register | `src/app/auth/register/page.tsx` | ⬜ Pendiente (TSK-F-05.2) |
| Vista /auth/verify-sent | `src/app/auth/verify-sent/page.tsx` | ⬜ Pendiente (TSK-F-05.3) |
| Vista /auth/recovery | `src/app/auth/recovery/page.tsx` | ⬜ Pendiente (TSK-F-06.1) |
| Vista /auth/reset-password | `src/app/auth/reset-password/page.tsx` | ⬜ Pendiente (TSK-F-06.2) |
| Vista /auth/verify-result | `src/app/auth/verify-result/page.tsx` | ⬜ Pendiente (TSK-F-07) |
| Vista /auth/logout | `src/app/auth/logout/page.tsx` | ⬜ Pendiente (TSK-F-08.1) |
| Toast | `src/components/ui/Toast.tsx` | ⬜ Pendiente (TSK-F-08.2) |
| Vista /profile | `src/app/profile/page.tsx` | ⬜ Pendiente (TSK-F-09) |
| Vista /profile/security | `src/app/profile/security/page.tsx` | ⬜ Pendiente (TSK-F-10.1) |
| Vista /profile/delete | `src/app/profile/delete/page.tsx` | ⬜ Pendiente (TSK-F-10.2) |
| Vista /auth/blocked | `src/app/auth/blocked/page.tsx` | ⬜ Pendiente (TSK-F-11) |

### Backend — Sin iniciar (Fase 2+)
### Infraestructura Docker — Sin iniciar (Fase 2+)

---

## §4. Índice SDD — Etapa 1.1

| Documento | Ruta | Estado |
|---|---|---|
| PRD v1.3.0 | `docs/f1_1.1/f1_1.1_prd.md` | ✅ Autorizado |
| SPEC v1.3.0 | `docs/f1_1.1/f1_1.1_spec.md` | ✅ Autorizado |
| PLAN | `docs/f1_1.1/f1_1.1_plan.md` | ✅ Autorizado |
| TASK | `docs/f1_1.1/f1_1.1_task.md` | 🔄 En progreso — Bloque 1 completo |
| Auditoría TSK-F-R1 | `docs/f1_1.1/audits/TSK-F-R1_audit.md` | ✅ UI_CONSISTENTE_OK |

### Estado del TASK (f1_1.1_task.md)

**Bloque 1 — Foundation** (7/7 completo ✅):
- [x] TSK-F-01 — globals.css tokens HSL
- [x] TSK-F-02.1 — GlassCard
- [x] TSK-F-02.2 — StatusCard + ResendButton
- [x] TSK-F-03.1 — AuthLayout
- [x] TSK-F-03.2 — AppLayout
- [x] TSK-F-04 — Assets Logo/Favicon (G-11)
- [x] TSK-F-R1 — Auditoría UI/UX Base (UI_CONSISTENTE_OK)

**Bloque 2 — Auth & Recovery Views** (0/8 pendiente ⬜):
TSK-F-05.1, TSK-F-05.2, TSK-F-05.3, TSK-F-06.1, TSK-F-06.2, TSK-F-07, TSK-F-08.1, TSK-F-08.2, TSK-F-R2

**Bloque 3 — Profile & Control Views** (0/5 pendiente ⬜):
TSK-F-09, TSK-F-10.1, TSK-F-10.2, TSK-F-11, TSK-F-R3

**Bloque 4 — Validation & UX Polish** (0/4 pendiente ⬜):
TSK-F-12.1, TSK-F-13, TSK-F-14, TSK-F-R4

**Bloque 5 — QA & Final Polish** (0/3 pendiente ⬜):
TSK-F-15, TSK-F-16, TSK-F-R5

**Cierre de Etapa** (0/4 pendiente ⬜):
TSK-F-19, TSK-F-20, TSK-F-21, TSK-F-22

---

## §5. Notas y Decisiones Registradas

- **2026-04-03** — Proyecto Next.js 15 creado en `/frontend/` con Tailwind v4. Tailwind v4 elimina `tailwind.config.ts`; toda la extensión de tokens se define en `globals.css` vía `@theme inline`. No es una improvisación — es la arquitectura correcta de Tailwind v4.
- **2026-04-03** — G-11 activado en TSK-F-04: generación de assets con IA no disponible en el entorno de ejecución. Se implementó fallback SVG artesanal: escudo geométrico + checkmark + gradiente primario `#005eb6 → #5f9efb`. Archivos: `public/logo.svg` (40×40) y `public/favicon.svg` (32×32).
- **2026-04-03** — BLQ-H-01 detectado por `ui-consistency-manager` en TSK-F-R1: `ThemeProvider` de `next-themes` ausente en RootLayout. Corregido por el orquestador directamente en `src/app/layout.tsx`. Patrón correcto: `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` dentro del `<body>`.
- **2026-04-03** — `StatusCard` implementado con 3 exports nombrados: `StatusCard`, `ResendButton`, `ConfirmDeleteButton`. El mapeo G-05 ("Expirado" vs "Inválido") se resuelve via props `title`/`message` del consumidor — no hay lógica de string hardcoded en el componente.
- **2026-04-03** — `MockAuthContext` creado en `src/context/MockAuthContext.tsx` con `isMockAuthenticated: true`. Preparado para ser reemplazado en Fase 4 sin modificar consumidores.

---

## §6. Estado de Sesión — Punto de Guardado

### Working Set (archivos activos de la sesión)
```
frontend/src/app/globals.css                        ← modificado
frontend/src/app/layout.tsx                         ← modificado (BLQ-H-01 fix)
frontend/src/components/ui/GlassCard.tsx            ← creado
frontend/src/components/ui/StatusCard.tsx           ← creado
frontend/src/components/ui/ThemeToggle.tsx          ← creado
frontend/src/components/ui/UserNav.tsx              ← creado
frontend/src/components/layouts/AuthLayout.tsx      ← creado
frontend/src/components/layouts/AppLayout.tsx       ← creado
frontend/src/components/layouts/SidebarNav.tsx      ← creado
frontend/src/context/MockAuthContext.tsx            ← creado
frontend/public/logo.svg                            ← creado
frontend/public/favicon.svg                         ← creado
docs/f1_1.1/f1_1.1_task.md                         ← actualizado (Bloque 1 marcado [x])
docs/f1_1.1/audits/TSK-F-R1_audit.md               ← creado
.agents/tokens/pipeline/frontend_coder_token.md     ← actualizado (TERMINADA)
.agents/tokens/consulting/ui_consistency_token.md   ← actualizado (UI_CONSISTENTE_OK)
```

### Contexto Inmediato
El Bloque 1 (Foundation & Shared UI Components) de la etapa f1_1.1 está **completamente cerrado y certificado**. Los 7 entregables (globals.css, GlassCard, StatusCard, AuthLayout, AppLayout, Assets, Auditoría) pasaron el gate de calidad del `ui-consistency-manager` con veredicto `UI_CONSISTENTE_OK`. El proyecto Next.js compila sin errores (`npm run build` ✅).

### Bloqueador / Último Error
**Ninguno** — la sesión cerró en estado limpio. BLQ-H-01 fue detectado y resuelto dentro de la misma sesión.

### Próxima Acción Concreta
**Iniciar TSK-F-05.1** — Maquetación de la vista `/auth/login`.

```
Agente:    frontend-coder
Archivo:   src/app/auth/login/page.tsx
Layout:    AuthLayout (ya existe en src/components/layouts/AuthLayout.tsx)
GlassCard: usar con blur="md", shadow="elevated"
Campos:    email (input), password (input + show/hide toggle)
Estados:   loading/submitting (opacidad 70% en botón, cursor wait)
DoD SPEC:  formulario con estados de carga; navegación a /auth/register y /auth/recovery
Referencia: SPEC v1.3.0 §3.1 (ruta /auth/login → AuthLayout) + §6 (loading states)
```
