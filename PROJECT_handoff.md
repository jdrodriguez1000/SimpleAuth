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
  [🔄] E1.1 — Mockups Visuales y UX          ← ACTIVA (Bloques 1, 2 y 3 completos, Bloque 4 pendiente)

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
| Design System Tokens | `src/app/globals.css` | ✅ Completo (token `.text-body-sm` añadido) |
| Root Layout + ThemeProvider | `src/app/layout.tsx` | ✅ Completo |
| GlassCard | `src/components/ui/GlassCard.tsx` | ✅ Completo |
| StatusCard + ResendButton + ConfirmDeleteButton | `src/components/ui/StatusCard.tsx` | ✅ Completo |
| ThemeToggle | `src/components/ui/ThemeToggle.tsx` | ✅ Completo |
| Toast | `src/components/ui/Toast.tsx` | ✅ Completo (TSK-F-08.2) |
| AuthLayout | `src/components/layouts/AuthLayout.tsx` | ✅ Completo |
| AppLayout | `src/components/layouts/AppLayout.tsx` | ✅ Completo |
| SidebarNav | `src/components/layouts/SidebarNav.tsx` | ✅ Completo |
| UserNav | `src/components/ui/UserNav.tsx` | ✅ Completo |
| MockAuthContext | `src/context/MockAuthContext.tsx` | ✅ Completo |
| Logo SVG | `public/logo.svg` | ✅ Completo (G-11) |
| Favicon SVG | `public/favicon.svg` | ✅ Completo (G-11) |
| Vista /auth/login | `src/app/auth/login/page.tsx` | ✅ Completo (TSK-F-05.1) |
| Vista /auth/register | `src/app/auth/register/page.tsx` | ✅ Completo (TSK-F-05.2) |
| Vista /auth/verify-sent | `src/app/auth/verify-sent/page.tsx` | ✅ Completo (TSK-F-05.3) |
| Vista /auth/recovery | `src/app/auth/recovery/page.tsx` | ✅ Completo (TSK-F-06.1) |
| Vista /auth/reset-password | `src/app/auth/reset-password/page.tsx` | ✅ Completo (TSK-F-06.2) |
| Vista /auth/verify-result | `src/app/auth/verify-result/page.tsx` | ✅ Completo (TSK-F-07) |
| Vista /auth/logout | `src/app/auth/logout/page.tsx` | ✅ Completo (TSK-F-08.1) |
| Vista /profile | `src/app/profile/page.tsx` | ✅ Completo (TSK-F-09) |
| Vista /profile/security | `src/app/profile/security/page.tsx` | ✅ Completo (TSK-F-10.1) |
| Vista /profile/delete | `src/app/profile/delete/page.tsx` | ✅ Completo (TSK-F-10.2) |
| Vista /auth/blocked | `src/app/auth/blocked/page.tsx` | ✅ Completo (TSK-F-11) |

### Backend — Sin iniciar (Fase 2+)
### Infraestructura Docker — Sin iniciar (Fase 2+)

---

## §4. Índice SDD — Etapa 1.1

| Documento | Ruta | Estado |
|---|---|---|
| PRD v1.3.0 | `docs/f1_1.1/f1_1.1_prd.md` | ✅ Autorizado |
| SPEC v1.3.0 | `docs/f1_1.1/f1_1.1_spec.md` | ✅ Autorizado |
| PLAN | `docs/f1_1.1/f1_1.1_plan.md` | ✅ Autorizado |
| TASK | `docs/f1_1.1/f1_1.1_task.md` | 🔄 En progreso — Bloques 1, 2 y 3 completos |
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

**Bloque 2 — Auth & Recovery Views** (9/9 completo ✅):
- [x] TSK-F-05.1 — Vista /auth/login
- [x] TSK-F-05.2 — Vista /auth/register (9 campos, PasswordStrengthChecklist, selects CC-002)
- [x] TSK-F-05.3 — Vista /auth/verify-sent (Server Component, bloque Spam FR-1.1.8-A)
- [x] TSK-F-06.1 — Vista /auth/recovery (formulario + estado éxito dual)
- [x] TSK-F-06.2 — Vista /auth/reset-password (Suspense+useSearchParams, dos estados)
- [x] TSK-F-07 — Vista /auth/verify-result (mapeo diferencial expired/invalid G-05, StatusCard)
- [x] TSK-F-08.1 — Vista /auth/logout (router.replace + localStorage.clear + contrato toast)
- [x] TSK-F-08.2 — Componente Toast (useSearchParams, auto-dismiss 4s, limpieza query param)
- [x] TSK-F-R2 — Code Review Auth Views (APROBADO con 3 correcciones in situ)

**Bloque 3 — Profile & Control Views** (6/6 completo ✅):
- [x] TSK-F-09 — Vista /profile (Editor — 6 campos, enums CC-002, email read-only)
- [x] TSK-F-10.1 — Vista /profile/security (3 campos password, PasswordStrengthChecklist, coincidencia)
- [x] TSK-F-10.2 — Vista /profile/delete (GDPR 30 días, gatekeeper dual, botón var(--error))
- [x] TSK-F-11 — Vista /auth/blocked (AuthLayout, "15 minutos" ×3, candado SVG, FR-1.1.7)
- [x] TSK-F-11.1 — Smoke Test Bloque 3 (APROBADO — 0 bloqueantes, O-M-01 no bloquea)
- [x] TSK-F-R3 — Auditoría Lógica de Perfil (APROBADO — FR-1.1.9 y FR-1.1.7 cumplen, O-4 diferida)

**Bloque 4 — Validation & UX Polish** (0/6 pendiente ⬜):
TSK-F-12.1, TSK-F-13, TSK-F-14, TSK-F-14.1, TSK-F-R4, TSK-F-R4.1

**Bloque 5 — QA & Final Polish** (0/5 pendiente ⬜):
TSK-F-15, TSK-F-15.1, TSK-F-16, TSK-F-R5, TSK-F-R5.1

**Cierre de Etapa** (0/4 pendiente ⬜):
TSK-F-19, TSK-F-20, TSK-F-21, TSK-F-22

---

## §5. Notas y Decisiones Registradas

- **2026-04-03** — Proyecto Next.js 15 creado en `/frontend/` con Tailwind v4. Tailwind v4 elimina `tailwind.config.ts`; toda la extensión de tokens se define en `globals.css` vía `@theme inline`. No es una improvisación — es la arquitectura correcta de Tailwind v4.
- **2026-04-03** — G-11 activado en TSK-F-04: generación de assets con IA no disponible en el entorno de ejecución. Se implementó fallback SVG artesanal: escudo geométrico + checkmark + gradiente primario `#005eb6 → #5f9efb`. Archivos: `public/logo.svg` (40×40) y `public/favicon.svg` (32×32).
- **2026-04-03** — BLQ-H-01 detectado por `ui-consistency-manager` en TSK-F-R1: `ThemeProvider` de `next-themes` ausente en RootLayout. Corregido por el orquestador directamente en `src/app/layout.tsx`. Patrón correcto: `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` dentro del `<body>`.
- **2026-04-03** — `StatusCard` implementado con 3 exports nombrados: `StatusCard`, `ResendButton`, `ConfirmDeleteButton`. El mapeo G-05 ("Expirado" vs "Inválido") se resuelve via props `title`/`message` del consumidor — no hay lógica de string hardcoded en el componente.
- **2026-04-03** — `MockAuthContext` creado en `src/context/MockAuthContext.tsx` con `isMockAuthenticated: true`. Preparado para ser reemplazado en Fase 4 sin modificar consumidores.
- **2026-04-03** — Token `.text-body-sm` (0.75rem, weight 400) añadido a `globals.css`. Estaba referenciado en código pero no definido; ahora es parte oficial del Design System de la etapa.
- **2026-04-03** — Patrón `Suspense + inner component` establecido como estándar para cualquier componente que use `useSearchParams` en Next.js 15 App Router. Aplica a: `reset-password/page.tsx`, `Toast.tsx`. Sin este patrón el build falla en SSR.
- **2026-04-03** — Contrato de Toast establecido: logout → `/auth/login?toast=logout_success`. El componente `Toast` en `src/components/ui/Toast.tsx` es el punto centralizado de notificaciones por URL param. Futuras notificaciones deben añadirse al mapa `TOAST_MESSAGES` en dicho archivo.
- **2026-04-03** — `PasswordStrengthChecklist` duplicado en `register/page.tsx` y `reset-password/page.tsx`. Extracción diferida intencionalmente a TSK-F-15 (Bloque 5 — QA Polish) para no bloquear el pipeline de vistas.
- **2026-04-03** — `/auth/logout` usa `router.replace` (no `router.push`) de forma deliberada. Evita que el usuario retroceda a la ruta `/auth/logout` con el botón atrás del navegador, lo cual reejecutaría la lógica de limpieza innecesariamente.
- **2026-04-04** — Bloque 3 completado y certificado (pipeline coder → tester → reviewer). 4 vistas implementadas con AppLayout/AuthLayout + GlassCard: `/profile` (6 campos), `/profile/security` (passwordChangeSchema), `/profile/delete` (gatekeeper GDPR), `/auth/blocked` (FR-1.1.7). Build: ✅ 13 rutas estáticas.
- **2026-04-04** — Patrón gatekeeper establecido en `/profile/delete`: constante `CONFIRMATION_KEYWORD = "ELIMINAR MI CUENTA"` como única fuente de verdad. Botón destructivo deshabilitado con `isGatekeeperSatisfied` derivado (sin efectos secundarios). Indicador visual verde en el campo de confirmación cuando el texto coincide exactamente.
- **2026-04-04** — O-4 registrada por `frontend-reviewer` en TSK-F-R3: `PasswordStrengthChecklist` triplicado en register, reset-password y profile/security. Extracción a componente reutilizable diferida explícitamente a TSK-F-15 (Bloque 5). No bloquea ninguna tarea del Bloque 4.
- **2026-04-04** — FR-1.1.9 (GDPR 30 días) verificado en TSK-F-R3: aviso de 30 días presente en dos puntos de `/profile/delete` (bloque de advertencia + estado de éxito). Reactivación comunicada explícitamente: "puedes reactivar tu cuenta en cualquier momento iniciando sesión".

---

## §6. Estado de Sesión — Punto de Guardado

### Working Set (archivos activos de la sesión)
```
frontend/src/app/profile/page.tsx                        ← creado (TSK-F-09)
frontend/src/app/profile/security/page.tsx               ← creado (TSK-F-10.1)
frontend/src/app/profile/delete/page.tsx                 ← creado (TSK-F-10.2)
frontend/src/app/auth/blocked/page.tsx                   ← creado (TSK-F-11)
docs/f1_1.1/f1_1.1_task.md                              ← actualizado (TSK-F-09 a TSK-F-R3 marcados [x])
.agents/tokens/pipeline/frontend_coder_token.md          ← actualizado (TSK-F-11_DONE)
.agents/tokens/pipeline/frontend_tester_token.md         ← actualizado (TSK-F-11.1_APROBADO)
.agents/tokens/pipeline/frontend_reviewer_token.md       ← actualizado (TSK-F-R3_APROBADO)
```

### Contexto Inmediato
El Bloque 3 (Profile & Control Views) de la etapa f1_1.1 está **completamente cerrado y certificado**. Pipeline completo ejecutado: `frontend-coder` (×4 vistas) → `frontend-tester` (TSK-F-11.1) → `frontend-reviewer` (TSK-F-R3). 13 rutas estáticas generadas por el build. Los 11 mockups requeridos por el PRD están implementados (7 de Auth + 4 de Perfil/Control). El proyecto está limpio y listo para iniciar el Bloque 4.

### Bloqueador / Último Error
**Ninguno** — la sesión cerró en estado limpio.

### Próxima Acción Concreta
**Iniciar TSK-F-12.1** — Definir esquemas Zod (Auth & Profile) en `lib/validations/`.

```
Agente:    frontend-coder
Archivo:   src/lib/validations/ (directorio a crear con múltiples archivos o uno consolidado)
Esquemas:  7 esquemas según SPEC v1.3.0 §5:
           registerSchema, loginSchema, profileSchema, passwordChangeSchema,
           recoveryRequestSchema, resetPasswordSchema, deleteAccountSchema
Referencia: SPEC v1.3.0 §5 (Validation Schemas) + CLAUDE.md §Esquema de Base de Datos (enums)
Nota:      Los enums ya están validados en las vistas: gender M/F/O, country CO/US/CA/MX/VE/OT
           birth_date: validación de edad mínima 18 años
           deleteAccountSchema: confirmation = literal "ELIMINAR MI CUENTA" + password
```
