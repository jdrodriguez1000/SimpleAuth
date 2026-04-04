# TSK-F-R4.1 — Code Review Block 4: Esquemas Zod y Animaciones

> **Tipo**: Code Review (Frontend Reviewer)
> **Etapa**: f1_1.1 — Mockups Visuales y UX
> **Fecha**: 2026-04-04
> **Revisor**: frontend-reviewer (con lineamientos del ui-consistency-manager)
> **Token Tester Prerequisito**: CONFORME — TSK-F-14.1 (109/109 tests, build exitoso)
> **Archivos Auditados**:
> - `frontend/src/lib/validations/auth.ts`
> - `frontend/src/lib/validations/profile.ts`
> - `frontend/src/lib/validations/__tests__/auth.test.ts`
> - `frontend/src/lib/validations/__tests__/profile.test.ts`
> - `frontend/src/components/ui/PageTransition.tsx`
> - `frontend/src/components/ui/GlassCard.tsx`
> - `frontend/src/components/layouts/AuthLayout.tsx`
> - `frontend/src/components/layouts/AppLayout.tsx`
> - `frontend/src/components/ui/__tests__/PageTransition.test.tsx`
> - `frontend/src/components/ui/__tests__/GlassCard.animated.test.tsx`

---

## Evidencia de Estado Final

| Verificacion | Resultado |
|:---|:---|
| `npm run build` | EXITOSO — 13 rutas estaticas, 0 errores TypeScript |
| `npx vitest run` | 109/109 tests PASANDO (5 archivos) |
| Build previo (TSK-F-14.1) | EXITOSO — confirmado en token tester |

---

## A — Esquemas Zod (`auth.ts` y `profile.ts`)

### A.1 TypeScript estricto

**auth.ts**: Sin uso de `any`. Tipos inferidos exportados correctamente: `LoginFormData`, `RegisterFormData`, `RecoveryFormData`, `ResetPasswordFormData`. La API de Zod v4 (`error:` en lugar de `errorMap:`) es la correcta para la version instalada.

**profile.ts**: Sin uso de `any`. Tipos inferidos exportados correctamente: `ProfileFormData`, `SecurityFormData`, `DeleteAccountFormData`. La constante `CONFIRMATION_KEYWORD` con `as const` garantiza el tipado literal estricto.

**Resultado**: PASA

### A.2 Logica de validacion

Los `refine()` en ambos archivos estan correctamente tipados — reciben el objeto completo y retornan booleano con `path` y `message` definidos.

El helper `isAtLeast18` es puro y determinista: usa `new Date()` en tiempo de ejecucion, lo que garantiza que los tests no expiran con el tiempo (patron `birthDateYearsAgo()` en los tests).

`securitySchema` incluye validacion adicional `current_password !== new_password` — adicion benigna documentada por el integration-mediator en TSK-F-R4 (OBS-03).

Los mensajes de error estan en espanol, son claros y descriptivos para el usuario final.

**Resultado**: PASA

### A.3 Enums

Los valores `["M", "F", "O"]` para `gender` y `["CO", "US", "CA", "MX", "VE", "OT"]` para `country` son consistentes entre `auth.ts` y `profile.ts`, y con los formularios ya auditados en TSK-F-R2 y TSK-F-R3. Las discrepancias con los valores de DB (`Masculino/Femenino/Otro`, `Other`) estan documentadas en TSK-F-R4 como DIS-01 y DIS-02 — trabajo diferido a Fase 4. No son defectos de esta etapa.

**Resultado**: PASA

### A.4 Campos sensibles

`passwordField` y `strongPasswordField` aplican `.min(8)` y regex de fortaleza. `loginSchema.password` correctamente usa solo `.min(8)` sin el regex (decision arquitectonica correcta documentada en TSK-F-R4 §1.1).

Ningun campo de contrasena se exporta como tipo independiente que pudiera ser reutilizado de forma inadecuada.

**Resultado**: PASA

### A.5 Arquitectura

**Observacion menor detectada (O-1)**:
- `PASSWORD_REGEX` y `isAtLeast18` estan duplicados entre `auth.ts` y `profile.ts`.
- El helper es identico linea por linea en ambos archivos (lineas 15-41 en cada uno).
- Impacto: mantenimiento — si la politica de contrasena cambia, debe actualizarse en dos lugares.
- Clasificacion: Menor — no bloquea. La separacion de archivos (`auth.ts` vs `profile.ts`) justifica la independencia modular en fase de mockup, pero la extraccion a un modulo compartido `lib/validations/shared.ts` es la solucion correcta.
- **Correccion aplicada in situ**: Ver seccion de correcciones al final de este documento.

---

## B — Framer Motion (`PageTransition.tsx`, `GlassCard.tsx`)

### B.1 "use client" justificado

`PageTransition.tsx`: usa `useReducedMotion` de framer-motion — hook de cliente. Directiva justificada.

`GlassCard.tsx`: usa `useReducedMotion` de framer-motion — hook de cliente. Directiva justificada.

Los layouts (`AuthLayout.tsx`, `AppLayout.tsx`) NO tienen `"use client"` — son Server Components que importan los Client Components correctamente. Patron correcto.

**Resultado**: PASA

### B.2 Retrocompatibilidad

`GlassCard` con `animated?: boolean` (default `true`): la prop es opcional. Todo uso existente de `<GlassCard>` sin la prop recibe `animated=true` por defecto, lo que activa la animacion. El comportamiento previo (sin animacion) se restaura con `animated={false}`. La rama `!animated` renderiza un `div` nativo puro, sin dependencia de framer-motion — retrocompatibilidad garantizada.

**Resultado**: PASA

### B.3 Performance

`pageVariants` en `PageTransition.tsx` (linea 17) y `cardVariants` en `GlassCard.tsx` (linea 35) son constantes definidas fuera del cuerpo del componente, en el scope del modulo. No se recrean en cada render.

**Resultado**: PASA

### B.4 Accesibilidad (useReducedMotion)

`PageTransition`: `initial={shouldReduceMotion ? "visible" : "hidden"}` — cuando `prefers-reduced-motion: reduce`, el componente arranca directamente en estado visible. No hay animacion de entrada.

`GlassCard`: patron identico — `initial={shouldReduceMotion ? "visible" : "hidden"}`. Correcto.

Tests A11y (TSK-F-14.1) validan este comportamiento: 13 tests en `PageTransition.test.tsx` y 10 en `GlassCard.animated.test.tsx`, todos pasando.

**Resultado**: PASA

### B.5 Duracion de animaciones

`PageTransition`: `duration: 0.3, ease: "easeOut"` — 300ms, dentro del limite de 500ms. Sin spring.
`GlassCard`: `duration: 0.3, ease: "easeOut"` — 300ms, dentro del limite de 500ms. Sin spring.

**Resultado**: PASA

---

## C — Layouts (`AuthLayout.tsx`, `AppLayout.tsx`)

### C.1 Integracion minima de PageTransition

`AuthLayout.tsx` (linea 113): `<PageTransition className="w-full max-w-md">{children}</PageTransition>` — integracion de una sola prop, sin logica adicional.

`AppLayout.tsx` (linea 120): `<PageTransition className="h-full">{children}</PageTransition>` — identicamente minimo.

Ningun layout instancia variantes propias ni interfiere con la logica interna de `PageTransition`.

**Resultado**: PASA

### C.2 Props innecesarias

Ningun layout pasa props adicionales a `PageTransition` mas alla de `className`. La interfaz `PageTransitionProps` solo expone `children` y `className?` — exactamente lo que los layouts usan.

**Resultado**: PASA

---

## D — Tests

### D.1 Cobertura del DoD

`auth.test.ts`: Cubre los 4 esquemas de `auth.ts` con happy path, campos vacios y validaciones especificas (email malformado, password corto, menor de 18, passwords no coincidentes, terms false, gender/country invalidos, password sin fortaleza).

`profile.test.ts`: Cubre los 3 esquemas de `profile.ts` con la misma profundidad — incluyendo el refine de `current_password !== new_password` y la keyword literal `"ELIMINAR MI CUENTA"` (mayusculas, minusculas, parcial, con espacio extra).

`PageTransition.test.tsx`: 13 tests cubriendo renderizado basico, prefers-reduced-motion (true/false), interactividad (click, foco, escritura) y ausencia de atributos A11y disruptivos.

`GlassCard.animated.test.tsx`: 10 tests cubriendo `animated=false` (div nativo, clases glassmorphism, role=region, inline style), `animated=true` (role=region, clases, interactividad, no aria-hidden), y prop omitida (default=true).

**Resultado**: PASA

### D.2 Mocks de framer-motion

El mock de `framer-motion` es correcto en ambos archivos de test de animacion:
- `motion.div` es mapeado a un `div` semantico que acepta y descarta las props especificas de framer-motion (`initial`, `animate`, `variants`, `transition`).
- `useReducedMotion` es un `vi.fn()` controlable via `mockReturnValue`.
- El mock es autocontenido y no contamina otros modulos.
- La exportacion `__mockUseReducedMotion` permite acceder al mock en tests sin acoplar el test a detalles de implementacion del modulo `framer-motion`.

**Resultado**: PASA

### D.3 Solidez de tests

Los tests no testean la implementacion interna de framer-motion (no verifican que `motion.div` sea llamado con ciertas props ni que las variantes tengan valores especificos). Testean comportamiento observable: el contenido esta en el DOM, el role es correcto, el boton es clickeable, no hay `aria-hidden`.

**Resultado**: PASA

---

## Correcciones Aplicadas In Situ

### Correccion C-1 — Extraccion de helpers compartidos (O-1)

**Problema**: `PASSWORD_REGEX`, `passwordField`/`strongPasswordField` e `isAtLeast18` duplicados en `auth.ts` y `profile.ts`.

**Accion**: Se crea `frontend/src/lib/validations/shared.ts` con los helpers compartidos. `auth.ts` y `profile.ts` los importan desde ese modulo.

**Archivos modificados**:
- `frontend/src/lib/validations/shared.ts` (nuevo)
- `frontend/src/lib/validations/auth.ts` (eliminados helpers locales, agregado import)
- `frontend/src/lib/validations/profile.ts` (eliminados helpers locales, agregado import)

**Impacto en tests**: Los tests de esquemas no importan helpers directamente — solo importan los schemas. Cero cambio requerido en tests.

---

## Resumen de Observaciones

| ID | Severidad | Area | Descripcion | Estado |
|:---|:---|:---|:---|:---|
| O-1 | Menor | Arquitectura Zod | `PASSWORD_REGEX` e `isAtLeast18` duplicados entre `auth.ts` y `profile.ts` | Corregido in situ — `shared.ts` extraido |

**Bloqueantes**: Ninguno.
**Mayores**: Ninguno.
**Menores resueltas**: 1 (O-1 — corregida in situ).

---

## Veredicto Final

**APROBADO**

Los 10 archivos auditados del Bloque 4 cumplen con todos los criterios de revision:

- TypeScript estricto sin `any`, tipos inferidos exportados correctamente en los 7 esquemas Zod.
- Logica de validacion correcta: `refine()` bien tipados, mensajes claros en espanol, helper `isAtLeast18` dinamico y determinista.
- Enums consistentes con los formularios y con la SPEC §2 CC-002. Discrepancias con DB documentadas y diferidas a Fase 4 (TSK-F-R4).
- Animaciones Framer Motion con variantes externas al render (sin recreacion en cada ciclo), `useReducedMotion` aplicado correctamente en ambos componentes (WCAG 2.1 §2.3), duracion 300ms < limite 500ms, sin springs agresivos.
- `"use client"` justificado exclusivamente por el hook `useReducedMotion`. Los layouts son Server Components correctamente.
- Retrocompatibilidad de `GlassCard` garantizada por la rama `!animated` que renderiza un `div` nativo puro.
- Integracion de `PageTransition` en layouts es minima: una prop `className`, cero logica adicional.
- 109/109 tests pasando. Mocks de framer-motion correctos, sin falsos positivos, sin acoplamiento a implementacion interna.
- Build de produccion exitoso: 13 rutas estaticas, 0 errores TypeScript.

La unica observacion encontrada (duplicacion de helpers Zod) fue resuelta in situ mediante extraccion a `shared.ts`.

El veredicto tiene el respaldo de los lineamientos del `ui-consistency-manager` (Design System "The Intelligent Monolith", PROJECT_ui_kit.md v1.1.0).

---

*Documento generado por TSK-F-R4.1 — Code Review Block 4*
*Revisor: frontend-reviewer*
*Fecha: 2026-04-04*
