# Lessons Learned — SimpleAuth

> Acumulador histórico de aprendizaje del proyecto. **Solo crecimiento**: jamás eliminar ni sobrescribir entradas anteriores.
> Organizado por Fase y Etapa según el Plan Maestro (PROJECT_plan.md v1.6.0).

---

## Fase 1 — Prototipado y QA Plan

### Etapa 1.1 — Mockups Visuales y UX

#### Sesión: 2026-04-03

**✅ Lo que funcionó bien:**
- Delegar tareas atómicas al `frontend-coder` con contexto completo (tokens exactos, props requeridas, ejemplos de uso) produjo código de primera iteración sin necesidad de correcciones por parte del orquestador.
- El pipeline de auditoría `frontend-coder → ui-consistency-manager` detectó el bloqueante BLQ-H-01 (`ThemeProvider` ausente) dentro de la misma sesión — exactamente para lo que está diseñado el gate de revisión.
- Construir el Bloque 1 en orden de dependencias (tokens → componentes base → layouts → assets) eliminó trabajo de refactorización posterior.
- La clase `.glass-card` definida en `globals.css` como utilidad CSS + la prop `opacity` dinámica en `GlassCard` vía `style` inline fue la solución correcta para separar valores estáticos (CSS) de valores dinámicos (React).

**⚠️ Lo que no funcionó / fricción encontrada:**
- **BLQ-H-01**: El `ThemeProvider` de `next-themes` no fue incluido en el RootLayout durante TSK-F-03.1, a pesar de que `ThemeToggle` ya usaba `useTheme`. El hook de cliente no puede funcionar sin su Provider. Lección: al instalar una librería de contexto (`next-themes`, `react-query`, etc.), el Provider en el RootLayout debe configurarse en la misma tarea donde se instala la librería, no en una tarea posterior.
- **Tailwind v4 rompe supuestos**: El `frontend-coder` tuvo que adaptar la estrategia de configuración porque Tailwind v4 elimina `tailwind.config.ts`. El agente lo manejó correctamente, pero la SPEC no menciona la versión de Tailwind — en etapas futuras conviene especificar versiones de dependencias clave en el briefing.

**💡 Decisiones clave tomadas:**
- **G-11 activado**: La generación de assets con IA no es viable en el entorno de ejecución del agente. El fallback es un SVG artesanal con gradiente primario del Design System. Esta decisión es **definitiva** para f1_1.1 — no bloquea el hito de aceptación del Plan.
- **Tailwind v4 + `@theme inline`**: Toda la extensión de tokens del Design System vive en `globals.css` mediante la directiva `@theme inline`. No existe `tailwind.config.ts`. Esta arquitectura es correcta y no debe revertirse.
- **`StatusCard` como contenedor de acciones condicionales**: El mapeo G-05 ("Expirado" vs "Inválido") se resuelve via props `title`/`message` del consumidor — el componente no tiene lógica de string hardcoded. Esta separación de responsabilidades es la correcta para un prototipo desacoplado del backend.
- **`MockAuthContext`** con `isMockAuthenticated: true` como flag global del prototipo: preparado para ser reemplazado en Fase 4 sin tocar los consumidores. Patrón correcto para mocking de contexto de autenticación.
- **`GlassCard` no hardcodeado en layouts**: Cada vista instancia su propio `GlassCard` con props configurables. Los layouts (`AuthLayout`, `AppLayout`) solo proveen posicionamiento. Esta separación es obligatoria para mantener la flexibilidad del prototipo.

#### Sesión: 2026-04-03 (Bloque 2 — Auth & Recovery Views Flow)

**✅ Lo que funcionó bien:**
- El pipeline `frontend-coder → frontend-tester → frontend-reviewer` funcionó correctamente como gate de calidad: el tester detectó 3 observaciones no bloqueantes que el reviewer elevó a correcciones obligatorias y aplicó in situ, sin requerir iteraciones al coder. El sistema de tres capas cumplió su propósito.
- Proveer al `frontend-coder` el patrón exacto de referencia (tokens CSS, clases Tailwind, props de componentes) en cada briefing eliminó inconsistencias visuales entre vistas. Los 8 archivos del bloque son visualmente coherentes sin correcciones de estilo.
- El `StatusCard` existente absorbió el caso de uso de `verify-result` sin modificaciones — el diseño de props `onResend`/`isResending` fue correcto desde el Bloque 1.
- Definir el contrato Toast via query param (`?toast=logout_success`) antes de implementar `Toast.tsx` evitó acoplamiento entre el componente y la lógica de logout.

**⚠️ Lo que no funcionó / fricción encontrada:**
- **Token CSS sin definir**: `.text-body-sm` fue referenciado en código de register y reset-password pero no existía en `globals.css`. El build de Next.js no falla por clases CSS desconocidas en Tailwind — el error pasó silencioso. Lección: al definir un token nuevo en código, añadirlo simultáneamente a `globals.css`. El reviewer lo detectó en TSK-F-R2 y lo corrigió.
- **`aria-live` vs `role="alert"`**: El tester y el reviewer debatieron si `role="alert"` implica `aria-live="assertive"`. Técnicamente sí (ARIA spec), pero la SPEC v1.3.0 §6 los especifica explícitamente juntos. Lección: cuando la SPEC escribe dos atributos juntos, incluirlos juntos aunque uno sea redundante — la consistencia con la SPEC escrita vale más que la elegancia técnica.
- **`frontend-reviewer` bloqueado por token ausente**: El reviewer rechazó ejecutarse porque `frontend_tester_token.md` no existía. El flujo correcto es `coder → tester → reviewer`, pero el orquestador intentó invocar al reviewer directamente. Lección: respetar el pipeline de tokens; siempre ejecutar el tester antes del reviewer.

**💡 Decisiones clave tomadas:**
- **Patrón `Suspense + inner component`** es el estándar obligatorio para cualquier uso de `useSearchParams` en Next.js 15 App Router. Sin este patrón el build falla en SSR. Aplica a todos los componentes futuros que lean query params.
- **`router.replace` en logout** (no `push`): decisión deliberada para evitar que el usuario retroceda a `/auth/logout` con el botón atrás del navegador, lo cual reejecutaría la limpieza de storage.
- **`PasswordStrengthChecklist` duplicado diferido**: extracción a componente compartido postergada a TSK-F-15 (Bloque 4). No bloquea el pipeline; la duplicación es aceptable hasta la tarea de UX Polish.
- **Toast centralizado**: el mapa `TOAST_MESSAGES` en `Toast.tsx` es el único punto de registro de notificaciones por URL param. Cualquier nueva notificación (ej. email_verified, password_changed) debe añadirse ahí en fases futuras.

#### Sesión: 2026-04-04 (Bloque 3 — Profile & Control Views)

**✅ Lo que funcionó bien:**
- El pipeline `frontend-coder → frontend-tester → frontend-reviewer` del Bloque 3 fue ejecutado sin fricción: 4 vistas implementadas, smoke test aprobado (0 bloqueantes), auditoría formal aprobada (0 bloqueantes). El sistema de gates funciona de forma estable y predecible cuando los briefings incluyen contexto completo.
- El patrón de briefing "lee estos archivos de referencia antes de implementar" produjo consistencia visual automática entre las 4 vistas del bloque — todas usan `AppLayout`/`AuthLayout` + `GlassCard` de forma idéntica sin correcciones posteriores.
- El `frontend-tester` ejecutó verificación estática eficiente (lectura de código fuente + build) sin necesidad de Playwright para el smoke test. Para vistas estáticas sin backend, este enfoque es suficiente y más rápido.
- El `frontend-reviewer` cerró la O-M-01 del tester (PasswordStrengthChecklist condicional) confirmándola como comportamiento intencional consistente con TSK-F-R2. El sistema de observaciones numeradas permite trazabilidad entre agentes.

**⚠️ Lo que no funcionó / fricción encontrada:**
- Sin incidentes técnicos en esta sesión. El Bloque 3 cerró limpio en primera iteración para las 4 vistas.

**💡 Decisiones clave tomadas:**
- **Patrón gatekeeper de seguridad** en `/profile/delete`: constante `CONFIRMATION_KEYWORD = "ELIMINAR MI CUENTA"` como única fuente de verdad. El estado `isGatekeeperSatisfied` es derivado (sin `useEffect`). Indicador visual verde en el campo de confirmación cuando el texto coincide exactamente. Este patrón debe replicarse si se requieren confirmaciones de texto literal en otras vistas.
- **`/auth/blocked` como Server Component** (sin `"use client"`): la vista de bloqueo por rate limit no requiere interactividad. Patrón correcto para vistas informativas estáticas — reduce el bundle de JS enviado al cliente.
- **Deuda técnica O-4 registrada formalmente**: `PasswordStrengthChecklist` triplicado (register, reset-password, profile/security). La extracción a componente compartido está diferida a TSK-F-15. Esta decisión es **intencional** y no debe interpretarse como omisión.
- **FR-1.1.9 implementado en dos puntos**: el aviso de 30 días aparece en el bloque de advertencia inicial Y en el estado de éxito post-borrado. Esto garantiza que el usuario lo lee en el momento más crítico (confirmación) además del momento informativo.

#### Sesión: 2026-04-04 (Bloque 4 — Validation & UX Polish)

**✅ Lo que funcionó bien:**
- El pipeline completo de 4 agentes (`frontend-coder` → `frontend-tester` → `integration-mediator` → `frontend-reviewer`) ejecutó el Bloque 4 en una sola sesión sin iteraciones de corrección mayor. Los gates de calidad funcionan de forma predecible cuando cada agente recibe contexto completo.
- El `integration-mediator` detectó proactivamente los campos "frontend-only" (`terms`, `confirm_password`, `confirmation`) que no deben enviarse al backend — documentación que de otro modo habría generado bugs de integración en Fase 4.
- El `frontend-reviewer` aplicó el refactor O-1 (`shared.ts`) in situ sin rebotar al coder, lo que mantuvo el pipeline fluido. Los revisores con permiso de corrección directa aceleran el cierre sin sacrificar calidad.
- Vitest configurado correctamente desde el primer intento (jsdom + alias `@` + setup file). La suite de 109 tests pasó sin ajustes adicionales.

**⚠️ Lo que no funcionó / fricción encontrada:**
- **Zod v4 API break silencioso**: `errorMap` fue removido en Zod v4 y reemplazado por `error:` como propiedad directa. El `frontend-coder` tuvo que adaptar la API en tiempo de ejecución. Lección: al briefar al coder sobre Zod, especificar explícitamente la versión instalada y las diferencias de API si es v4+.
- **Enums UI vs DB no documentados en la SPEC**: la SPEC v1.3.0 no especificaba si los valores de `gender` y `country` en los esquemas Zod deben ser los valores de base de datos (`Masculino`, `CO`) o los valores abreviados de UI (`M`, `CO`). El `integration-mediator` tuvo que resolver la ambigüedad consultando los formularios existentes. Lección: la SPEC debe incluir una tabla explícita de mapeo UI→DB para todos los enums.
- **GAP-R4-01 sin resolver**: el transporte del token de reset-password (query param vs body en `PATCH /auth/reset-password`) no está definido en la Architecture v1.5.0. Es una brecha de diseño que deberá ser resuelta antes de Fase 4 mediante un CC formal.

**💡 Decisiones clave tomadas:**
- **Zod v4 API**: usar `error: "mensaje"` como segundo argumento en `z.enum()` y `z.literal()`. No usar `errorMap`. Esta decisión es definitiva para toda la etapa — no revertir.
- **Enums Zod siguen CC-002** (valores abreviados de UI: `M/F/O`, `CO/US/CA/MX/VE/OT`): el mapeo a valores de DB (`Masculino/Femenino/Otro`, `Other`) es responsabilidad de una capa de transformación en Fase 4, no del schema de validación frontend.
- **`src/lib/validations/shared.ts`** como módulo canónico de helpers Zod compartidos (`PASSWORD_REGEX`, `passwordField`, `isAtLeast18`). Cualquier nueva validación reutilizable entre schemas debe añadirse aquí — no duplicar en `auth.ts`/`profile.ts`.
- **Framer Motion como capa de polish no intrusiva**: variantes definidas como constantes externas al componente (sin recreación en cada render), `useReducedMotion` obligatorio, duración máxima 300ms. `PageTransition` es el punto único de animación de entrada de página — no añadir animaciones individuales en los `page.tsx`.
- **Mocks de Framer Motion en Vitest**: `motion.div` se mapea a `div` descartando props de animación; `useReducedMotion` se mockea con `vi.fn()` para controlar el comportamiento en tests. Este patrón es el estándar para cualquier test futuro que implique componentes animados.

#### Sesión: 2026-04-05 (Bloque 5 + Cierre de Etapa — f1_1.1)

**Lo que funcionó bien:**
- La extracción de `PasswordStrengthChecklist` como componente reutilizable (TSK-F-15) fue trivial una vez identificada la deuda. La diferencia entre diferirla y resolverla fue aproximadamente 15 minutos de trabajo del agente. Resolver deuda técnica antes del cierre de etapa siempre vale la pena — el costo es mínimo y el resultado es una suite de tests coherente.
- El flujo de cierre formal (TSK-F-19 suite completa → TSK-F-20 auditoría forense → TSK-F-21 ejecutivo) funcionó sin fricciones cuando todos los tokens previos estaban en orden. La cadena de tokens como mecanismo de gobernanza demostró su valor: al llegar a TSK-F-20, los 32 requisitos tuvieron trazabilidad completa sin correcciones adicionales.
- Playwright se integró en una sola tarea (TSK-F-16): instalación + `playwright.config.ts` + `e2e/navigation.spec.ts` con 11 rutas. 11/11 PASS en primera ejecución. La infraestructura E2E queda lista para la Fase 4 sin deuda de configuración.
- La auditoría WCAG 2.1 AA (TSK-F-R5) alcanzó 96/100 con correcciones todas aplicables in situ (TSK-F-R5.1), sin requerir rediseño estructural. El puntaje demuestra que construir con tokens semánticos desde el inicio produce accesibilidad nativa.

**Lo que no funcionó / fricción encontrada:**
- **Tokens CSS incompletos en el Design System inicial**: el token `--success` no fue definido en TSK-F-01 al inicio de la etapa. El color verde `text-green-500` fue utilizado en 4 archivos de forma hardcodeada y no fue detectado hasta la auditoría WCAG final (TSK-F-R5). Requirió corrección en `globals.css`, `StatusCard.tsx`, `Toast.tsx` y `PasswordStrengthChecklist.tsx`. El costo fue bajo en esta etapa, pero escala linealmente con el numero de archivos del proyecto.
- **TSK-F-22 no ejecutado**: el commit atómico y push de la etapa completa quedó pendiente al cierre de sesión. No es un error técnico, pero implica que la rama `feat/f1_1.1_setup` tiene trabajo sin sincronizar con el remoto. Debe ser la primera acción de la siguiente sesión.

**Decisiones clave tomadas:**
- **Checklist de tokens en TSK-F-01**: para etapas futuras, el briefing de la tarea de Design System debe incluir explícitamente todos los tokens semánticos requeridos (`--success`, `--warning`, `--error`, `--info`). Ningún componente debe usar clases de color utilitarias de Tailwind directamente si existe un token equivalente.
- **`PasswordStrengthChecklist` como componente de referencia de extracción**: la deuda fue documentada en O-4 (TSK-F-R3), diferida formalmente a TSK-F-15, y resuelta con 39 tests RTL. Este ciclo (detectar → diferir con token → resolver en bloque de polish) es el patrón correcto para gestionar deuda técnica sin bloquear el pipeline principal.
- **Suite dual Vitest + Playwright como cierre de etapa frontend**: 149 tests unitarios/componentes (Vitest) + 11 tests de navegación (Playwright) + build sin errores es el estándar de cierre para cualquier etapa de la capa Frontend. No se puede emitir el ejecutivo sin estos tres checks en verde.

---

### Resumen de Etapa 1.1 — Mockups Visuales y UX

**Lecciones mas valiosas para el futuro:**
1. Definir el Design System completo (todos los tokens semánticos) en TSK-F-01 antes de implementar cualquier componente. Los tokens `--success` y `--warning` son tan fundamentales como `--primary` y `--error`.
2. El pipeline de 4 agentes (`frontend-coder → frontend-tester → integration-mediator → frontend-reviewer`) es estable y predecible. Su eficiencia depende directamente de la calidad del briefing inicial: contexto completo en el briefing = cero iteraciones de corrección mayor.
3. La deuda técnica diferida con token formal (O-4, TSK-F-15) es preferible a resolver de inmediato si bloquearía el pipeline. Lo crítico es registrarla formalmente y asignarle una tarea concreta.
4. Playwright debe instalarse al inicio de la etapa de QA (Bloque 5), no al final — evita dependencias de configuración de última hora.

**Decisiones criticas que no deben revertirse:**
- `PasswordStrengthChecklist` en `src/components/ui/` es el componente canónico. No duplicar lógica de validación de contraseña en ninguna vista.
- El mapeo `TOAST_MESSAGES` en `Toast.tsx` es el único punto de registro de notificaciones por URL param.
- Los enums Zod siguen CC-002 (valores abreviados de UI). El mapeo UI→DB es responsabilidad de la capa de integración en Fase 4.
- GAP-R4-01 (transporte del token de reset-password) debe resolverse mediante CC formal antes de iniciar E4.1.
