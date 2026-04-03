---
name: session-close-lessons
description: Protocolo técnico de extracción de conocimiento, registro de fricciones y actualización del histórico docs/lessons/lessons-learned.md.
user-invocable: false
agent: session-closer
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Protocolo de Capitalización de Aprendizaje (Lessons Learned)
Este skill define el procedimiento para transformar la experiencia de la sesión en activos de conocimiento. Su objetivo es identificar patrones de éxito y fallas técnicas para optimizar los protocolos de los agentes en etapas futuras.


## Paso 1 — Leer o inicializar el archivo

Lee `docs/lessons/lessons-learned.md`. Si no existe, créalo con la estructura formal:
- Resumen histórico del aprendizaje.
- Organización por Fases y Etapas.


## Paso 2 — Localizar la sección activa

Del contexto de la sesión, identifica la **Fase** y **Etapa** activa (ej. Fase 1, Etapa 1.1).

Busca la sección correspondiente (`## Fase [N]` / `### Etapa [N.N]`). Si la etapa es nueva, crea la sección al final de la fase respetando la jerarquía de títulos.


## Paso 3 — Registrar la Sesión

Al final de la sección de la Etapa activa, añade una entrada honesta y concreta:

```markdown
### Sesión: [fecha actual YYYY-MM-DD]

**✅ Lo que funcionó bien:**
- [Decisiones o enfoques que vale la pena repetir]

**⚠️ Lo que no funcionó / fricción encontrada:**
- [Errores cometidos o decisiones que se revirtieron]

**💡 Decisiones clave tomadas:**
- [Decisiones arquitectónicas o de gobernanza tomadas en esta sesión]
```

Si la sesión no tuvo incidentes, indica: `- Sin incidentes.` — lo importante es la consistencia del registro histórico.


## Paso 4 — Resumen de Etapa (Condicional)

Comprueba el estado de la etapa en `docs/tasks/f[F]_[E]_task.md`.

**Si y solo si** todas las tareas están completadas `[x]`, genera un bloque de resumen al final de la etapa:
- Lecciones más valiosas para el futuro.
- Decisiones críticas que no deben revertirse.

No generes este resumen si la etapa aún tiene tareas pendientes o abiertas.


## Paso 5 — Confirmación

Informa: `` `docs/lessons/lessons-learned.md` actualizado — Sesión [fecha] registrada en Etapa [N.N]. ``


## Reglas innegociables

1. **Solo Crecimiento**: Jamás elimines ni sobrescribas entradas anteriores; el archivo es un acumulado histórico.
2. **Honestidad Forense**: Los errores y fricciones deben registrarse con detalle para evitar repetirlos.
3. **Puntualidad en Resumen**: El Resumen de Etapa es un hito de cierre; no se puede generar por anticipado.
4. **Respeto a la Fase**: Asegúrate de que las secciones de Fase/Etapa coincidan con el Plan Maestro en `CLAUDE.md`.
