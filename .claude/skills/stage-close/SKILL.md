---
name: stage-close
description: Protocolo técnico de cierre de etapa, traducción de resultados a lenguaje de negocio y generación del Resumen Ejecutivo (Gate obligatorio).
user-invocable: false
agent: stage-closer
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Protocolo de Cierre Ejecutivo y Entrega de Etapa
Este skill define el procedimiento para formalizar el fin de una etapa y permitir el avance a la siguiente. Su objetivo es proporcionar transparencia a los stakeholders sobre el progreso, los riesgos y el valor acumulado del proyecto.


## Paso 0 — Verificar Autorización de Auditoría

**Esta es la primera acción del skill. No se puede omitir.**

Leer el archivo `.agents/tokens/close/audit_token.md`.

**Escenario A — El archivo no existe:**

```
⛔ CIERRE BLOQUEADO — Auditoría Pendiente

No se encontró un token de auditoría válido para esta etapa en .agents/tokens/close/audit_token.md.
El cierre formal requiere que el Auditor de Etapa haya certificado el trabajo completado.

Acción requerida:
→ Ejecuta /stage-audit para auditar la etapa antes de cerrarla.
→ Si la auditoría concluye con ✅ CONFORME, vuelve a invocar /stage-close.
```

Detener. No ejecutar ningún paso adicional.

**Escenario B — El archivo existe pero contiene `BLOQUEADO`:**

```
⛔ CIERRE BLOQUEADO — Auditoría con Hallazgos Críticos

El Auditor de Etapa emitió un veredicto BLOQUEADO en .agents/tokens/close/audit_token.md.

Acción requerida:
→ Consulta el informe de auditoría generado por stage-auditor.
→ Resuelve los hallazgos indicados e intenta obtener un nuevo token CONFORME.
```

Detener. No ejecutar ningún paso adicional.

**Escenario C — El archivo existe y contiene `CONFORME` para la etapa correcta:**

Verificar que el token corresponde a la etapa que se va a cerrar (identificador `f[F]_[E]`).

Si coincide:

```
✅ Token de auditoría validado: CONFORME
Procediendo con la redacción del Resumen Ejecutivo de la etapa f[F]_[E]...
```

Continuar con el Paso 1.


## Paso 1 — Identificar la etapa a cerrar

Infiere del contexto qué etapa se está cerrando (ej. Fase 1, Etapa 1 → f01_01).


## Paso 2 — Recopilar contexto

Lee los siguientes archivos en orden:
1. `docs/tasks/f[F]_[E]_task.md` — Analizar tareas completadas `[x]` y pendientes `[ ]`.
2. `docs/reqs/f[F]_[E]_prd.md` — Objetivos y métricas de éxito.

**Cálculo Dinámico de Progreso:**
Lee la sección **"Fases y Etapas del Proyecto"** de `CLAUDE.md`. No uses valores hardcoded.

```
E_total = Total de etapas definidas para todas las fases en CLAUDE.md (conteo real de la tabla).
C_total = Número de archivos en docs/executives/ (incluyendo el actual).
Progreso Total = (C_total / E_total) * 100
```

Si el progreso es menor al ejecutivo previo debido a expansión de alcance, incluir nota explicativa.


## Paso 3 — Proponer resumen al usuario

Antes de escribir, presenta un esquema:

```
📋 Esquema de Resumen Ejecutivo — Etapa [F].[E]:

✅ Logros principales: [3-5 bullets de negocio]
⚠️ Problemas encontrados: [lista simple]
📌 Temas Pendientes: [con implicación de negocio]
➡️ Próximos pasos: [Transición a la etapa f[F]_[E+1]]

¿Confirmas o ajustas algo antes de generar el documento final?
```

Espera confirmación.


## Paso 4 — Escribir el documento

**Archivo:** `docs/executives/f[F]_[E]_executive.md`

Generar el contenido utilizando la estructura formal:
- Resumen ejecutivo en lenguaje simple.
- Tabla de Logros Alcanzados e Impacto.
- Tabla de Problemas y Soluciones.
- Tabla de Temas Pendientes e Implicaciones.
- Sección "¿Qué viene ahora?".
- Matriz de Indicadores de la Etapa.
- Tabla de Progreso del Proyecto (Fase, Etapas, Peso, Aporte).

Informar éxito:
```
✅ Resumen Ejecutivo creado con éxito: docs/executives/f[F]_[E]_executive.md
```


## Paso 5 — Limpieza del Token y Veredicto Final

Elimina el archivo `.agents/tokens/close/audit_token.md` tras crear exitosamente el ejecutivo.


## Reglas Innegociables

1. **Sin Jerga Técnica**: Términos como DB, API, Middleware deben ser explicados o evitados.
2. **Puerta de Auditoría**: El token CONFORME es el único disparador de la acción.
3. **Cálculo Dinámico**: El progreso debe derivarse siempre de lo definido en `CLAUDE.md`.
4. **Una Sola Tarea**: El skill NO debe intentar actualizar PROJECT_handoff.md ni otros archivos de seguimiento; su única salida es el ejecutivo.
5. **Confirmación Previa**: No escribir el archivo si el usuario no valida el esquema en el Paso 3.
