---
name: stage-audit
description: Protocolo técnico de auditoría documental y de código. Verifica la trazabilidad entre requisitos, tareas y evidencia física (tokens/tests).
user-invocable: false
agent: stage-auditor
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Protocolo de Auditoría Técnica y Documental (Stage-Gate)
Este skill define el procedimiento para certificar el cierre de una etapa del proyecto. Su objetivo es garantizar que no exista "Código Fantasma" (código sin tarea asociada) ni "Tareas Fantasma" (tareas marcadas como listas sin archivos que las respalden).


## Paso 0 — Identificar la Etapa a Auditar

Infiere del contexto qué etapa se está auditando. Si no es claro, pregunta:

```
¿Qué etapa vamos a auditar? (ej. Fase 1, Etapa 2 → f01_02)
```

Una vez identificada, construye los identificadores canónicos:
- `[F]` = número de fase con dos dígitos (ej. `01`)
- `[E]` = número de etapa con dos dígitos (ej. `02`)
- Prefijo SDD: `f[F]_[E]` (ej. `f01_02`)


## Paso 0.5 — Detección del Modo de Auditoría

Lee la sección **"Fases y Etapas del Proyecto"** de `CLAUDE.md` y aplica la siguiente lógica de clasificación:

| Fase                                        | Etapas        | Modo de Auditoría |
| ------------------------------------------- | ------------- | ----------------- |
| Fase 1 — Gobernanza y Cimientos             | 1.1, 1.2, 1.3 | `DOCUMENTACIÓN`   |
| Fase 2 — Prototipado y Validación de Diseño | 2.1           | `PROTOTIPADO`     |
| Fase 3 — Ingeniería de Datos                | 3.1 a 3.6     | `CÓDIGO`          |
| Fase 4 — Operación y Mejora Continua        | 4.1 a 4.3     | `CÓDIGO`          |

Informa al inicio:

```
🔍 Modo de Auditoría detectado: [DOCUMENTACIÓN / PROTOTIPADO / CÓDIGO]
📌 Etapa: f[F]_[E] — [Descripción de la etapa según CLAUDE.md]
```


## Paso 1 — Sincronización de Contexto

Lee los siguientes documentos en orden para construir el mapa de la etapa:

1. `CLAUDE.md` — Estándares de Código, estructura de carpetas, DoD global.
2. `docs/reqs/f[F]_[E]_prd.md` — Requerimientos base `[REQ-XX]` y objetivos `[OBJ-XX]`.
3. `docs/tasks/f[F]_[E]_task.md` — Lista de tareas `[TSK-F-XX]` y su estado `[x]` / `[ ]`.

Construye mentalmente dos listas:
- **Tareas completadas**: todas las marcadas con `[x]`.
- **Tareas pendientes**: todas las marcadas con `[ ]`.

Si alguno de los documentos no existe, detener y reportar:

```
🚫 BLOQUEADO — PRERREQUISITO FALTANTE
No existe: [ruta del documento faltante]
La auditoría no puede iniciarse sin los documentos SDD de la etapa.
```


## Paso 2 — Verificación de Evidencia (Cross-Check)

### Modo DOCUMENTACIÓN (Etapas 1.x)
- Para cada tarea completada `[x]`, verificar la existencia física de los documentos entregables esperados en `docs/`.
- Verificar que `CLAUDE.md` esté actualizado con los estándares correspondientes de la etapa.
- Verificar trazabilidad: cada `[TSK]` completada debe tener una contraparte `[REQ]` en el PRD.

### Modo PROTOTIPADO (Etapa 2.1)
- **Verificación de Mock-Data**: Comprobar existencia de `mock_data.json` y que los componentes de `web/` lo utilicen.
- **Detección de API Reales**: Hallazgo crítico si se encuentran llamadas a `fetch`, `axios` o bases de datos reales.
- **Modularidad**: Verificar que `web/components/` no sea un archivo monolítico.

### Modo CÓDIGO (Etapas 3.x y 4.x)
- **Cross-Check de Archivos**: Localizar el archivo físico para cada tarea `[x]`.
- **Validación de Tests**: Comprobar archivos en `pipeline/tests/` o `web/tests/`. Los tests no deben estar vacíos.
- **Trazabilidad de Tags**: Los archivos de código deben contener comentarios con el tag `[TSK-F-XX]`.


## Paso 3 — Detección de "Código Fantasma" (Solo Prototipado y Código)

1. **Escaneo de archivos nuevos**: Listar archivos creados en el periodo de la etapa.
2. **Cruce con Task List**: Comparar la lista de archivos con los mencionados en `docs/tasks/f[F]_[E]_task.md`.
3. **Cruce con CC**: Verificar si existe un Control de Cambio aprobado en `docs/changes/` que justifique archivos adicionales.
4. Si un archivo no aparece en tareas ni en CC: **Hallazgo de Código Fantasma**.


## Paso 4 — Evaluación del Definition of Done (DoD)

| Criterio DoD       | Verificación                                    | Modo Relevante |
| ------------------ | ----------------------------------------------- | -------------- |
| Cero Hardcoding    | Grep de IPs/Tokens literales                    | CÓDIGO         |
| Pipeline Approved  | Verificar `.claude/tokens/reviewer_approved.md` | CÓDIGO         |
| Mock-Only          | Cero llamadas a APIs reales                     | PROTOTIPADO    |
| Coherencia de Tags | Tags [REQ] coinciden en PRD y TASK              | TODOS          |


## Paso 5 — Generación del Dictamen de Auditoría

Presentar informe final con:
1. **Matriz de Conformidad**: Tarea vs. Evidencia.
2. **Reporte de Código Fantasma**.
3. **Análisis de Gaps** (Requerimientos del PRD sin tareas).

**Veredicto Final:**
- ✅ **CONFORME**: Escribe `.agents/tokens/close/audit_token.md` con estado CONFORME.
- 🚫 **BLOQUEADO**: Escribe `.agents/tokens/close/audit_token.md` con estado BLOQUEADO y lista acciones correctivas.


## Reglas Innegociables

1. **Evidencia Física Obligatoria**: Sin archivo/doc/test, el veredicto es BLOQUEADO.
2. **Token como Gate Único**: Solo `.agents/tokens/close/audit_token.md` autoriza el cierre.
3. **Neutralidad Forense**: Reportar, no corregir código.
