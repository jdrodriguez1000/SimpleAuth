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
| **Progreso Global** | 1 / 8 etapas cerradas (12.5%) — ejecutivo emitido: `docs/executives/f1_1.1_executive.md` |
| **SDD activo** | `docs/f1_1.1/` (PRD + SPEC v1.3.0 + PLAN + TASK) |

> **Cálculo dinámico**: E_total = 8 etapas (F1:1 + F2:2 + F3:3 + F4:2). C = 1 ejecutivo en `docs/executives/`. Progreso = 1/8 = 12.5%.

---

## §2. Hitos del Proyecto

```
Fase 1 — Prototipado y QA Plan
  [✅] E1.1 — Mockups Visuales y UX          ← CERRADA (ejecutivo emitido, TSK-F-22 pendiente git push)

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
| Design System Tokens | `src/app/globals.css` | ✅ Completo (token `--success` añadido en TSK-F-R5.1) |
| Root Layout + ThemeProvider | `src/app/layout.tsx` | ✅ Completo |
| GlassCard | `src/components/ui/GlassCard.tsx` | ✅ Completo (prop `animated`, Framer Motion) |
| StatusCard + ResendButton + ConfirmDeleteButton | `src/components/ui/StatusCard.tsx` | ✅ Completo (token --success en TSK-F-R5.1) |
| ThemeToggle | `src/components/ui/ThemeToggle.tsx` | ✅ Completo |
| Toast | `src/components/ui/Toast.tsx` | ✅ Completo (token --success en TSK-F-R5.1) |
| PageTransition | `src/components/ui/PageTransition.tsx` | ✅ Completo (TSK-F-14, useReducedMotion) |
| PasswordStrengthChecklist | `src/components/ui/PasswordStrengthChecklist.tsx` | ✅ Completo (TSK-F-15, extraído de 3 archivos) |
| AuthLayout | `src/components/layouts/AuthLayout.tsx` | ✅ Completo (PageTransition integrado) |
| AppLayout | `src/components/layouts/AppLayout.tsx` | ✅ Completo (PageTransition integrado) |
| SidebarNav | `src/components/layouts/SidebarNav.tsx` | ✅ Completo |
| UserNav | `src/components/ui/UserNav.tsx` | ✅ Completo |
| MockAuthContext | `src/context/MockAuthContext.tsx` | ✅ Completo |
| Logo SVG | `public/logo.svg` | ✅ Completo (G-11) |
| Favicon SVG | `public/favicon.svg` | ✅ Completo (G-11) |
| Vista /auth/login | `src/app/auth/login/page.tsx` | ✅ Completo (TSK-F-05.1) |
| Vista /auth/register | `src/app/auth/register/page.tsx` | ✅ Completo (import PasswordStrengthChecklist TSK-F-15) |
| Vista /auth/verify-sent | `src/app/auth/verify-sent/page.tsx` | ✅ Completo (TSK-F-05.3) |
| Vista /auth/recovery | `src/app/auth/recovery/page.tsx` | ✅ Completo (TSK-F-06.1) |
| Vista /auth/reset-password | `src/app/auth/reset-password/page.tsx` | ✅ Completo (import PasswordStrengthChecklist TSK-F-15) |
| Vista /auth/verify-result | `src/app/auth/verify-result/page.tsx` | ✅ Completo (TSK-F-07) |
| Vista /auth/logout | `src/app/auth/logout/page.tsx` | ✅ Completo (TSK-F-08.1) |
| Vista /profile | `src/app/profile/page.tsx` | ✅ Completo (TSK-F-09) |
| Vista /profile/security | `src/app/profile/security/page.tsx` | ✅ Completo (import PasswordStrengthChecklist TSK-F-15) |
| Vista /profile/delete | `src/app/profile/delete/page.tsx` | ✅ Completo (aria-describedby TSK-F-R5.1) |
| Vista /auth/blocked | `src/app/auth/blocked/page.tsx` | ✅ Completo (TSK-F-11) |
| Zod auth schemas | `src/lib/validations/auth.ts` | ✅ Completo (TSK-F-12.1) |
| Zod profile schemas | `src/lib/validations/profile.ts` | ✅ Completo (TSK-F-12.1) |
| Zod shared helpers | `src/lib/validations/shared.ts` | ✅ Completo (O-1 TSK-F-R4.1) |
| Tests schemas auth | `src/lib/validations/__tests__/auth.test.ts` | ✅ Completo (TSK-F-13, 30 tests) |
| Tests schemas profile | `src/lib/validations/__tests__/profile.test.ts` | ✅ Completo (TSK-F-13, 30 tests) |
| Tests GlassCard animated | `src/components/ui/__tests__/GlassCard.animated.test.tsx` | ✅ Completo (TSK-F-14.1, 10 tests) |
| Tests PageTransition | `src/components/ui/__tests__/PageTransition.test.tsx` | ✅ Completo (TSK-F-14.1, 13 tests) |
| Tests PasswordStrengthChecklist | `src/components/ui/__tests__/PasswordStrengthChecklist.test.tsx` | ✅ Completo (TSK-F-15.1, 39 tests) |
| Vitest config | `vitest.config.ts` + `src/test/setup.ts` | ✅ Completo (TSK-F-13) |
| Playwright config | `playwright.config.ts` | ✅ Completo (TSK-F-16) |
| E2E navigation spec | `e2e/navigation.spec.ts` | ✅ Completo (TSK-F-16, 11/11 rutas PASS) |

### Backend — Sin iniciar (Fase 2+)
### Infraestructura Docker — Sin iniciar (Fase 2+)

---

## §4. Índice SDD — Etapa 1.1

| Documento | Ruta | Estado |
|---|---|---|
| PRD v1.3.0 | `docs/f1_1.1/f1_1.1_prd.md` | ✅ Autorizado |
| SPEC v1.3.0 | `docs/f1_1.1/f1_1.1_spec.md` | ✅ Autorizado |
| PLAN | `docs/f1_1.1/f1_1.1_plan.md` | ✅ Autorizado |
| TASK | `docs/f1_1.1/f1_1.1_task.md` | ✅ Completo — todos los bloques cerrados |
| Auditoría TSK-F-R1 | `docs/f1_1.1/audits/TSK-F-R1_audit.md` | ✅ UI_CONSISTENTE_OK |
| Auditoría TSK-F-R4 | `docs/f1_1.1/audits/TSK-F-R4_audit.md` | ✅ CONTRATO_SINCRONIZADO |
| Review TSK-F-R4.1 | `docs/f1_1.1/audits/TSK-F-R4.1_review.md` | ✅ APROBADO |
| Auditoría TSK-F-R5 | `docs/f1_1.1/audits/TSK-F-R5_audit.md` | ✅ UI_ACCESIBLE (96/100) |
| Auditoría TSK-F-R5.1 | `docs/f1_1.1/audits/TSK-F-R5.1_audit.md` | ✅ TSK-F-R5.1_APROBADO |
| Auditoría TSK-F-20 | `docs/f1_1.1/audits/TSK-F-20_audit.md` | ✅ ETAPA_CERTIFICADA (32/32 trazabilidad) |
| Resumen Ejecutivo | `docs/executives/f1_1.1_executive.md` | ✅ Emitido (cierre oficial de etapa) |

### Estado del TASK (f1_1.1_task.md) — COMPLETO

**Bloque 1 — Foundation** (7/7 ✅)
**Bloque 2 — Auth & Recovery Views** (9/9 ✅)
**Bloque 3 — Profile & Control Views** (6/6 ✅)
**Bloque 4 — Validation & UX Polish** (6/6 ✅)

**Bloque 5 — QA & Final Polish** (5/5 ✅):
- [x] TSK-F-15 — PasswordStrengthChecklist extraído (~70 líneas deuda eliminada en 3 archivos)
- [x] TSK-F-15.1 — 39 tests RTL para PasswordStrengthChecklist. Suite total: 149/149 PASS
- [x] TSK-F-16 — Playwright instalado, 11/11 rutas E2E PASS
- [x] TSK-F-R5 — Auditoría WCAG 2.1 AA — 96/100, token UI_ACCESIBLE emitido
- [x] TSK-F-R5.1 — Correcciones in situ: token --success, text-green-500 → 4 archivos, aria-describedby

**Cierre de Etapa** (4/4 ✅):
- [x] TSK-F-19 — Suite completa: 149 Vitest + 11 Playwright + build 13 rutas
- [x] TSK-F-20 — Auditoría forense: 32/32 trazabilidad, cero código fantasma
- [x] TSK-F-21 — Resumen ejecutivo emitido en `docs/executives/f1_1.1_executive.md`
- [ ] TSK-F-22 — Sincronización Git & Push (pendiente — primera acción de la próxima sesión)

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
- **2026-04-05** — Bloque 5 + Cierre de Etapa 1.1 completados. `PasswordStrengthChecklist` extraído como componente reutilizable (`src/components/ui/PasswordStrengthChecklist.tsx`), eliminando ~70 líneas duplicadas de 3 archivos. Suite Vitest: 149/149 PASS (39 tests nuevos RTL). Playwright: 11/11 rutas E2E PASS. Auditoría WCAG 2.1 AA: 96/100 (token `UI_ACCESIBLE`). Correcciones in situ: token `--success` añadido a `globals.css`, `text-green-500` reemplazado en 4 archivos, `aria-describedby` en `/profile/delete`.
- **2026-04-05** — Los tokens CSS del design system deben definirse exhaustivamente desde el inicio (incluyendo `--success`, `--warning`). El color verde hardcodeado `text-green-500` no fue detectado hasta la auditoría WCAG final. Prevención: checklist de tokens en TSK-F-01 de futuras etapas.
- **2026-04-05** — Auditoría forense TSK-F-20: 32/32 trazabilidad completa, cero código fantasma. Token `ETAPA_CERTIFICADA` emitido. Resumen ejecutivo generado en `docs/executives/f1_1.1_executive.md`. Progreso global actualizado a 1/8 etapas = 12.5%.
- **2026-04-05** — TSK-F-22 (commit atómico + push de toda la etapa f1_1.1) no ejecutado en esta sesión. Queda como primera acción pendiente. El agente responsable es `devops-integrator`. La rama es `feat/f1_1.1_setup`.

---

## §6. Estado de Sesión — Punto de Guardado

### Working Set (archivos activos de la sesión)
```
frontend/src/components/ui/PasswordStrengthChecklist.tsx              ← creado (TSK-F-15)
frontend/src/components/ui/__tests__/PasswordStrengthChecklist.test.tsx ← creado (TSK-F-15.1, 39 tests)
frontend/playwright.config.ts                                         ← creado (TSK-F-16)
frontend/e2e/navigation.spec.ts                                       ← creado (TSK-F-16, 11 rutas)
frontend/src/app/globals.css                                          ← modificado (token --success, TSK-F-R5.1)
frontend/src/components/ui/StatusCard.tsx                             ← modificado (token --success, TSK-F-R5.1)
frontend/src/components/ui/Toast.tsx                                  ← modificado (token --success, TSK-F-R5.1)
frontend/src/app/profile/delete/page.tsx                              ← modificado (aria-describedby, TSK-F-R5.1)
frontend/src/app/auth/register/page.tsx                               ← modificado (import PasswordStrengthChecklist)
frontend/src/app/auth/reset-password/page.tsx                         ← modificado (import PasswordStrengthChecklist)
frontend/src/app/profile/security/page.tsx                            ← modificado (import PasswordStrengthChecklist)
docs/f1_1.1/f1_1.1_task.md                                           ← modificado (todos los bloques cerrados)
docs/executives/f1_1.1_executive.md                                   ← creado (TSK-F-21)
docs/f1_1.1/audits/TSK-F-R5_audit.md                                 ← creado
docs/f1_1.1/audits/TSK-F-R5.1_audit.md                               ← creado
docs/f1_1.1/audits/TSK-F-20_audit.md                                 ← creado
```

### Contexto Inmediato
La **Etapa 1.1 (Mockups Visuales y UX)** esta **oficialmente cerrada**. Todos los bloques (1 al 5) y las tareas de cierre (TSK-F-19 a TSK-F-21) estan completados. El resumen ejecutivo en `docs/executives/f1_1.1_executive.md` es la prueba formal de cierre. Suite de tests: 149 Vitest PASS + 11 Playwright PASS. Build: 13 rutas estáticas sin errores.

La unica tarea pendiente antes de iniciar el ciclo SDD de E2.1 es la sincronización Git.

### Bloqueador / Último Error
Ninguno — la sesión cerró en estado limpio.

### Próxima Acción Concreta
**Ejecutar TSK-F-22** — Commit atómico de toda la etapa f1_1.1 y push a origin.

```
Agente:     devops-integrator
Tarea:      TSK-F-22 — Sincronización Git & Push
Rama:       feat/f1_1.1_setup
Acción:     git add <archivos de la etapa>; git commit -m "feat: completar etapa f1_1.1 mockups y qa plan"; git push origin feat/f1_1.1_setup
Archivos a incluir: todos los listados en el Working Set anterior + archivos de sesiones previas no commiteados

Tras TSK-F-22 completado:
  → Iniciar ciclo SDD de Etapa 2.1 (E2.1 — Infraestructura, DB y Observabilidad)
  → Secuencia obligatoria: PRD → SPEC → PLAN → TASK (tokens en .agents/tokens/sdd/)
  → Rama nueva: feat/f2_2.1_infra (o equivalente según convención)
```
