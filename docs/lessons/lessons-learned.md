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
