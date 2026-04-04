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
  [🔄] E1.1 — Mockups Visuales y UX          ← ACTIVA (Bloques 1-4 completos, Bloque 5 pendiente)

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
| GlassCard | `src/components/ui/GlassCard.tsx` | ✅ Completo (prop `animated`, Framer Motion) |
| StatusCard + ResendButton + ConfirmDeleteButton | `src/components/ui/StatusCard.tsx` | ✅ Completo |
| ThemeToggle | `src/components/ui/ThemeToggle.tsx` | ✅ Completo |
| Toast | `src/components/ui/Toast.tsx` | ✅ Completo (TSK-F-08.2) |
| PageTransition | `src/components/ui/PageTransition.tsx` | ✅ Completo (TSK-F-14, useReducedMotion) |
| AuthLayout | `src/components/layouts/AuthLayout.tsx` | ✅ Completo (PageTransition integrado) |
| AppLayout | `src/components/layouts/AppLayout.tsx` | ✅ Completo (PageTransition integrado) |
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
| Zod auth schemas | `src/lib/validations/auth.ts` | ✅ Completo (TSK-F-12.1) |
| Zod profile schemas | `src/lib/validations/profile.ts` | ✅ Completo (TSK-F-12.1) |
| Zod shared helpers | `src/lib/validations/shared.ts` | ✅ Completo (O-1 TSK-F-R4.1) |
| Tests schemas auth | `src/lib/validations/__tests__/auth.test.ts` | ✅ Completo (TSK-F-13, 30 tests) |
| Tests schemas profile | `src/lib/validations/__tests__/profile.test.ts` | ✅ Completo (TSK-F-13, 30 tests) |
| Tests GlassCard animated | `src/components/ui/__tests__/GlassCard.animated.test.tsx` | ✅ Completo (TSK-F-14.1, 10 tests) |
| Tests PageTransition | `src/components/ui/__tests__/PageTransition.test.tsx` | ✅ Completo (TSK-F-14.1, 13 tests) |
| Vitest config | `vitest.config.ts` + `src/test/setup.ts` | ✅ Completo (TSK-F-13) |

### Backend — Sin iniciar (Fase 2+)
### Infraestructura Docker — Sin iniciar (Fase 2+)

---

## §4. Índice SDD — Etapa 1.1

| Documento | Ruta | Estado |
|---|---|---|
| PRD v1.3.0 | `docs/f1_1.1/f1_1.1_prd.md` | ✅ Autorizado |
| SPEC v1.3.0 | `docs/f1_1.1/f1_1.1_spec.md` | ✅ Autorizado |
| PLAN | `docs/f1_1.1/f1_1.1_plan.md` | ✅ Autorizado |
| TASK | `docs/f1_1.1/f1_1.1_task.md` | 🔄 En progreso — Bloques 1–4 completos |
| Auditoría TSK-F-R1 | `docs/f1_1.1/audits/TSK-F-R1_audit.md` | ✅ UI_CONSISTENTE_OK |
| Auditoría TSK-F-R4 | `docs/f1_1.1/audits/TSK-F-R4_audit.md` | ✅ CONTRATO_SINCRONIZADO |
| Review TSK-F-R4.1 | `docs/f1_1.1/audits/TSK-F-R4.1_review.md` | ✅ APROBADO |

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
- [x] TSK-F-11.1 — Smoke Test Bloque 3 (APROBADO — 0 bloqueantes)
- [x] TSK-F-R3 — Auditoría Lógica de Perfil (APROBADO — FR-1.1.9 y FR-1.1.7 cumplen, O-4 diferida)

**Bloque 4 — Validation & UX Polish** (6/6 completo ✅):
- [x] TSK-F-12.1 — Esquemas Zod (auth.ts + profile.ts + shared.ts, 7 schemas)
- [x] TSK-F-13 — Tests Vitest (109 tests en 5 archivos — schemas + GlassCard)
- [x] TSK-F-14 — Framer Motion (PageTransition + GlassCard animated + layouts)
- [x] TSK-F-14.1 — A11y check animaciones (109 tests, WCAG 2.1 SC2.3, sin bloqueantes)
- [x] TSK-F-R4 — Auditoría contratos Zod vs SPEC (CERTIFICADO — DIS-01/DIS-02/GAP-R4-01 documentados)
- [x] TSK-F-R4.1 — Code Review Block 4 (APROBADO — O-1 shared.ts aplicado in situ)

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
- **2026-04-04** — Bloque 4 completado y certificado. 7 esquemas Zod en `src/lib/validations/` (auth.ts + profile.ts + shared.ts). Zod v4 API: usar `error:` en el segundo argumento de `z.enum()` y `z.literal()`, NO `errorMap`. Enums usan valores UI abreviados (M/F/O, CO/US/CA/MX/VE/OT) según CC-002 — no los valores textuales del CLAUDE.md que son labels de UI.
- **2026-04-04** — DIS-01/DIS-02 documentados en TSK-F-R4: mapeo de enums UI→DB pendiente para Fase 4 (gender: M/F/O → Masculino/Femenino/Otro; country: OT → Other). Campos frontend-only identificados: `terms`, `confirm_password`, `confirm_new_password`, `confirmation` — NO enviar a la API en ningún request body.
- **2026-04-04** — GAP-R4-01: transporte del token en `PATCH /auth/reset-password` (query param vs body) no especificado en Architecture v1.5.0. Pendiente de definición antes de Fase 4 (integration-mediator debe abrir CC si aplica).
- **2026-04-04** — Helpers Zod compartidos extraídos a `src/lib/validations/shared.ts` (O-1 TSK-F-R4.1): `PASSWORD_REGEX`, `passwordField`, `isAtLeast18`. Este módulo es el punto único para validaciones reutilizables; cualquier nueva validación cross-schema debe ir aquí.
- **2026-04-04** — Framer Motion integrado como capa de polish (TSK-F-14): `PageTransition` (opacity 0→1 + y 8→0, 300ms easeOut), `GlassCard` (scale 0.98→1, prop `animated?: boolean` default true). Variantes definidas como constantes externas al componente (no se recrean en cada render). `useReducedMotion` aplicado en ambos componentes — WCAG 2.1 SC2.3 cumplido. `framer-motion` añadido a `frontend/package.json`.
- **2026-04-04** — Vitest configurado (TSK-F-13): `vitest.config.ts` con `environment: 'jsdom'` y alias `@`. Setup en `src/test/setup.ts` con `@testing-library/jest-dom`. Suite total: 109 tests en 5 archivos (todos pasando). Estructura: `src/lib/validations/__tests__/` para schemas, `src/components/ui/__tests__/` para componentes UI.

---

## §6. Estado de Sesión — Punto de Guardado

### Working Set (archivos activos de la sesión)
```
frontend/src/lib/validations/auth.ts                              ← creado (TSK-F-12.1)
frontend/src/lib/validations/profile.ts                           ← creado (TSK-F-12.1)
frontend/src/lib/validations/shared.ts                            ← creado (O-1 TSK-F-R4.1)
frontend/src/lib/validations/__tests__/auth.test.ts               ← creado (TSK-F-13, 30 tests)
frontend/src/lib/validations/__tests__/profile.test.ts            ← creado (TSK-F-13, 30 tests)
frontend/src/components/ui/PageTransition.tsx                     ← creado (TSK-F-14)
frontend/src/components/ui/__tests__/GlassCard.animated.test.tsx  ← creado (TSK-F-14.1, 10 tests)
frontend/src/components/ui/__tests__/PageTransition.test.tsx      ← creado (TSK-F-14.1, 13 tests)
frontend/vitest.config.ts                                         ← creado (TSK-F-13)
frontend/src/test/setup.ts                                        ← creado (TSK-F-13)
frontend/src/components/ui/GlassCard.tsx                          ← modificado (prop animated)
frontend/src/components/layouts/AuthLayout.tsx                    ← modificado (PageTransition)
frontend/src/components/layouts/AppLayout.tsx                     ← modificado (PageTransition)
docs/f1_1.1/audits/TSK-F-R4_audit.md                             ← creado (integration-mediator)
docs/f1_1.1/audits/TSK-F-R4.1_review.md                          ← creado (frontend-reviewer)
docs/f1_1.1/f1_1.1_task.md                                       ← actualizado (Bloque 4 completo)
```

### Contexto Inmediato
El **Bloque 4 (Validation & UX Polish)** de la etapa f1_1.1 está **completamente cerrado y certificado**. Pipeline completo ejecutado: `frontend-coder` (schemas + Framer Motion) → `frontend-tester` (109 tests + A11y) → `integration-mediator` (contratos) → `frontend-reviewer` (code review + refactor shared.ts). Build: ✅ 15 rutas estáticas. El proyecto está en estado limpio y listo para iniciar el Bloque 5.

### Bloqueador / Último Error
**Ninguno** — la sesión cerró en estado limpio.

### Próxima Acción Concreta
**Iniciar TSK-F-15** — Extraer `PasswordStrengthChecklist` como componente reutilizable (deuda técnica O-4 de TSK-F-R3).

```
Agente:     frontend-coder
Tarea:      TSK-F-15 — Implementar PasswordStrengthChecklist (UI/Refine)
Archivo:    src/components/ui/PasswordStrengthChecklist.tsx  (nuevo componente)
Consumidores actuales (inline, a reemplazar):
  - src/app/auth/register/page.tsx
  - src/app/auth/reset-password/page.tsx
  - src/app/profile/security/page.tsx
Reglas:
  - Props: password: string
  - Checks: min 8 chars, 1 mayúscula, 1 número, 1 carácter especial
  - UI: íconos check/x, verde/rojo por regla, update en tiempo real
  - Sin colores hardcodeados, sin Framer Motion adicional
  - Tras crear el componente: reemplazar las 3 implementaciones inline
  - Build: ✅ debe seguir pasando sin errores
```
