---
name: contract-arbitration
description: Protocolo técnico de mediación de contratos API, validación de esquemas OpenAPI y sincronización entre modelos Pydantic e interfaces TypeScript.
user-invocable: false
agent: integration-mediator
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Protocolo de Arbitraje de Contratos (Contract-First)
Este skill define el procedimiento para garantizar que la API es la Única Fuente de Verdad (SSOT). Su objetivo es asegurar que lo que el Backend emite es exactamente lo que el Frontend espera, eliminando errores de integración en tiempo de ejecución. Se rige por el estándar Contract First de CLAUDE.md.


## Paso 1 — Análisis del Esquema Pydantic vs. Consumo Real

Revisa las definiciones de datos:
1.  **Backend (Schemas)**: ¿Qué campos devuelve el Pydantic model (`app/schemas/`)? ¿Son obligatorios o opcionales?
2.  **Frontend (Types)**: ¿Qué interfaces Typescript se están usando para mapear el JSON de la API? ¿Existe discrepancia en nombres de campos (ej. `user_id` vs `userId`)?
3.  **OpenAPI**: Genera o revisa el archivo `/openapi.json` para verificar la documentación oficial del servidor.


## Paso 2 — Resolución de Conflictos de Tipo

Identifica y resuelve discrepancias:
1.  **Tipado de Datos**: ¿El Backend envía un `string` pero el Frontend espera un `Date`?
2.  **Formatos de Respuesta**: ¿Los códigos de error (400, 401, 403, 404) están especificados uniformemente?
3.  **Encabezados**: ¿Se están enviando los headers de autenticación (Bearer Token) correctamente?


## Paso 3 — Inyección de Recomendaciones de Integración

Si detectas un descalce técnico:
1.  No corrijas el código técnico de ninguna de las dos partes.
2.  Redacta la **Recomendación de Contrato [CON-F-XX]** adjunta a la tarea.
3.  Informa a los Reviewers: "Existe una discrepancia de tipos en la ruta `/auth/login` que romperá el despliegue."


## Paso 4 — Notificación y Emisión de Token de Mediación

**Opción A — Contrato Fallido Detectado:**
1.  Reporte detallado de la inconsistencia.
2.  Genera el token `.agents/tokens/consulting/api_contract_token.md` con estado `🚫 CONTRATO_R_FALLIDO`.

**Opción B — Contrato Sincronizado OK:**
1.  Si el API y la Web siguen el mismo esquema de datos.
2.  Genera el archivo `.agents/tokens/consulting/api_contract_token.md` con el siguiente contenido:

```markdown
# TOKEN: CONTRATO_SINCRONIZADO_OK
- **Etapa**: [F].[E]
- **Rutas Auditadas**: [lista de rutas]
- **Schema Validation**: ✅ 100% SINC (OpenAPI / Swagger)
- **Veredicto**: INTEGRACIÓN ARMONIZADA
- **Fecha**: [YYYY-MM-DD]
```


## Reglas Innegociables

1.  **Fuente de Verdad Única**: Siempre priorizar lo definido en la SPEC técnica sobre la implementación que el Coder haya realizado.
2.  **No modificar código**: Como mediador, propones el cambio en la SPEC o en los esquemas, pero el Coder debe ejecutarlo.
3.  **Case-Consistency**: Asegurar que se siga el estándar de nomenclatura definido (ej. CamelCase en Frontend vs snake_case en Backend).
4.  **Trazabilidad**: Relacionar cada reporte con un `[REQ-F-XX]` de integración.
5.  **Cero campos mágicos**: Todo campo devuelto por la API debe tener una descripción clara en Swagger.
6.  **Validación de Nulabilidad**: Verificar que los campos opcionales estén marcados como tales en ambos lados para evitar errores de renderizado.
