---
name: session-close-handoff
description: "Reescribe PROJECT_handoff.md con el estado macro completo del proyecto y el estado táctico exacto de la sesión."
# ENCAPSULAMIENTO (Privacidad según Doc oficial)
disable-model-invocation: true 
user-invocable: false

# SUBAGENTE (Estructura de Fork Aislado)
context: fork
agent: Explore
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Skill: /session-close-handoff — Registro del Punto de Guardado

Tu objetivo es reescribir `PROJECT_handoff.md` en la raíz del proyecto con el estado completo del proyecto al cierre de sesión. Este archivo es el **único punto de verdad de estado**: la próxima sesión solo necesita leerlo para arrancar con contexto completo.

> Reglas de comportamiento y protocolos: ver **CLAUDE.md**.

---

## Paso 1 — Leer el estado actual

Lee `PROJECT_handoff.md` existente (si existe). Extrae y preserva **íntegramente**:
- La sección **§5 Notas y Decisiones Registradas** — es append-only, jamás se sobrescribe ni se trunca.

Si el archivo no existe (primera sesión), inicializa las secciones basándote en la información de gobernanza disponible en `CLAUDE.md`.

---

## Paso 2 — Reconstruir el estado de la sesión

Analiza la conversación completa para extraer:
- **Fase y Etapa activa**: Verifica en el plan maestro.
- **Archivos tocados**: Lista de archivos creados o modificados en la sesión.
- **Contexto inmediato**: Lógica, función o problema trabajado últimamente.
- **Bloqueador / Último Error**: Clasifica en (Error activo / Decisión pendiente / Ninguno).
- **Próxima acción**: La tarea atómica más pequeña y concreta para iniciar la próxima sesión.
- **Notas nuevas**: Decisiones de arquitectura relevantes ocurridas en esta sesión. Formato: `- **YYYY-MM-DD** — [hecho concreto]`.

---

## Paso 3 — Escritura de PROJECT_handoff.md

Escribe el archivo siguiendo estrictamente la estructura formal:
- **§1. Coordenadas Actuales**: Fase, Etapa, Capa Medallón, Progreso Global (dinámico) y rutas SDD.
- **§2. Hitos del Proyecto**: Estado visual [✅/⬜] de cada etapa de cada fase.
- **§3. Mapa de Arquitectura**: Tabla de componentes y rutas.
- **§4. Índice SDD**: Estado de documentos de la etapa activa.
- **§5. Notas y Decisiones Registradas**: Append de las nuevas notas al final del historial preservado.
- **§6. Estado de Sesión**: Punto de guardado detallado (Working Set, Contexto, Bloqueador, Próxima Acción).

---

## Paso 4 — Reporte de Cierre

Muestra el resumen final:
```
Cerrando sesión — Handoff:
- Fase/Etapa: [fase y etapa]
- Archivos activos: [cantidad]
- Notas nuevas: [cantidad]
- Próxima acción: [tarea concreta para el arranque]
```

Informar: "`PROJECT_handoff.md` actualizado en la raíz del repositorio."

---

## Reglas innegociables

1. **Inviolabilidad de §5**: Nunca pierdas ni trunques el historial de notas; añade siempre al final.
2. **Próxima Acción (Next Step)**: Debe ser tan específica que un agente la entienda al leerla por primera vez.
3. **Cálculo Dinámico**: El progreso debe derivarse del conteo de ejecutivos/tareas según el plan maestro en `CLAUDE.md`.
4. **Estado Limpio**: Si no hay bloqueadores, indícalo explícitamente como "Ninguno — la sesión cerró en estado limpio."
