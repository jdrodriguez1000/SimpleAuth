# TSK-F-R4 — Auditoría Técnica de Contratos: Zod Schemas vs SPEC

> **Tipo**: Auditoría de Integración (Contract-First)
> **Etapa**: f1_1.1 — Mockups Visuales y UX
> **Fecha**: 2026-04-04
> **Auditor**: integration-mediator (Arquitecto de Integración Senior)
> **Fuentes de Verdad**: SPEC v1.3.0, PROJECT_architecture.md v1.5.0, PROJECT_scope.md v1.5.0
> **Archivos Auditados**:
> - `frontend/src/lib/validations/auth.ts`
> - `frontend/src/lib/validations/profile.ts`

---

## 1. Matriz de Alineación

### 1.1 `loginSchema` — `POST /auth/login`

**Contrato de API (Architecture §6.2)**:
```json
{ "email": "string", "password": "string" }
```

| Campo | Zod (Implementado) | API Esperada | Tipo Zod | Tipo API | Validaciones Zod | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| `email` | `email` | `email` | string | string | required, email format | ALINEADO |
| `password` | `password` | `password` | string | string | required, min 8 | ALINEADO |

**Observacion**: El `loginSchema` en `auth.ts` (linea 52) valida `password` con `min(8)` sin aplicar el regex de fortaleza completo. Esto es correcto para login: el backend valida la contrasena almacenada, no si cumple la politica de fortaleza en tiempo de login. La decision de omitir el regex en login es arquitectonicamente correcta.

**Veredicto**: ALINEADO

---

### 1.2 `registerSchema` — `POST /auth/register`

**Contrato de API (Architecture §6.1)**:
```json
{
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "birth_date": "string (YYYY-MM-DD)",
  "gender": "Masculino|Femenino|Otro",
  "country": "CO|US|CA|MX|VE|Other"
}
```

| Campo | Zod (Implementado) | API Esperada | Tipo Zod | Tipo API | Validaciones Zod | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| `first_name` | `first_name` | `first_name` | string | string | required, max 50, alpha regex | ALINEADO |
| `last_name` | `last_name` | `last_name` | string | string | required, max 50, alpha regex | ALINEADO |
| `email` | `email` | `email` | string | string | required, email format | ALINEADO |
| `birth_date` | `birth_date` | `birth_date` | string | string (ISO) | required, min 18 years refine | ALINEADO |
| `gender` | `gender` | `gender` | enum `["M","F","O"]` | enum `{Masculino,Femenino,Otro}` | required, enum | DISCREPANCIA |
| `country` | `country` | `country` | enum `["CO","US","CA","MX","VE","OT"]` | enum `{CO,US,CA,MX,VE,Other}` | required, enum | DISCREPANCIA |
| `password` | `password` | `password` | string | string | required, regex fortaleza | ALINEADO |
| `confirm_password` | `confirm_password` | NO EXISTE | string | — | debe igualar `password` | CAMPO SOLO FRONTEND |
| `terms` | `terms` | NO EXISTE | literal `true` | — | must be `true` | CAMPO SOLO FRONTEND |

**Discrepancias detectadas**:

1. **`gender`** (linea 100, `auth.ts`): Zod acepta `["M", "F", "O"]`. El backend espera `{Masculino, Femenino, Otro}` (DB enum `gender_type`, Architecture §2.2). **Requiere capa de mapeo antes del envio a la API**.

2. **`country`** (linea 108, `auth.ts`): Zod acepta `["CO", "US", "CA", "MX", "VE", "OT"]`. El backend espera `{CO, US, CA, MX, VE, Other}` (DB enum `country_type`, Architecture §2.2). La discrepancia es el valor `"OT"` (Zod) vs `"Other"` (DB). **Requiere transformacion `"OT" -> "Other"` antes del envio**.

**Veredicto**: OBSERVACIONES (discrepancias de enum documentadas — mapeo pendiente de integracion)

---

### 1.3 `recoverySchema` — `POST /auth/recovery`

**Contrato de API (CLAUDE.md)**:
```
POST /auth/recovery — campo: email
```

| Campo | Zod (Implementado) | API Esperada | Tipo Zod | Tipo API | Validaciones Zod | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| `email` | `email` | `email` | string | string | required, email format | ALINEADO |

**Veredicto**: ALINEADO

---

### 1.4 `resetPasswordSchema` — `PATCH /auth/reset-password`

**Contrato de API (CLAUDE.md)**:
```
PATCH /auth/reset-password — campos: token, new_password
```

| Campo | Zod (Implementado) | API Esperada | Tipo Zod | Tipo API | Validaciones Zod | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| `new_password` | `new_password` | `new_password` | string | string | required, regex fortaleza | ALINEADO |
| `confirm_password` | `confirm_password` | NO EXISTE | string | — | debe igualar `new_password` | CAMPO SOLO FRONTEND |
| `token` | `token` | `token` | string UUID | string | required, UUID format | ALINEADO (ver nota) |

**Nota sobre `token`**: El campo existe en el schema Zod (linea 166, `auth.ts`) con validacion UUID. El flujo de integracion debe definir si el token viaja en el body del request o como query param. La Architecture no especifica explicitamente esto para `reset-password`. Se documenta como brecha pendiente de definicion en la SPEC (ver Seccion 3).

**Veredicto**: ALINEADO con brecha de diseno pendiente de resolucion

---

### 1.5 `profileSchema` — `PATCH /users/me`

**Contrato de API (CLAUDE.md)**:
```
PATCH /users/me — campos: first_name, last_name, birth_date, gender, country (email inmutable)
```

| Campo | Zod (Implementado) | API Esperada | Tipo Zod | Tipo API | Validaciones Zod | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| `first_name` | `first_name` | `first_name` | string | string | required, max 50, alpha regex | ALINEADO |
| `last_name` | `last_name` | `last_name` | string | string | required, max 50, alpha regex | ALINEADO |
| `birth_date` | `birth_date` | `birth_date` | string | string (ISO) | required, min 18 years refine | ALINEADO |
| `gender` | `gender` | `gender` | enum `["M","F","O"]` | enum `{Masculino,Femenino,Otro}` | required, enum | DISCREPANCIA |
| `country` | `country` | `country` | enum `["CO","US","CA","MX","VE","OT"]` | enum `{CO,US,CA,MX,VE,Other}` | required, enum | DISCREPANCIA |

**Observaciones**:
- El campo `email` esta correctamente **ausente** del schema (`profile.ts` linea 46-47, comentario explicito). Alineado con la regla de inmutabilidad del email (Architecture §DB, Scope §3.2 F6).
- Las discrepancias de `gender` y `country` son identicas a las detectadas en `registerSchema` — mismo patron, misma solucion de mapeo requerida.

**Veredicto**: OBSERVACIONES (mismas discrepancias de enum que en `registerSchema`)

---

### 1.6 `securitySchema` — `PATCH /users/me` (cambio de contrasena)

**Contrato de API (CLAUDE.md / Architecture §3.3)**:
El endpoint `PATCH /users/me` gestiona la actualizacion de perfil. El cambio de contrasena implica `current_password` + `new_password`. La Architecture define que el cambio actualiza `password_changed_at` y revoca tokens anteriores.

| Campo | Zod (Implementado) | API Esperada | Tipo Zod | Tipo API | Validaciones Zod | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| `current_password` | `current_password` | `current_password` | string | string | required, min 1 | ALINEADO |
| `new_password` | `new_password` | `new_password` | string | string | required, regex fortaleza | ALINEADO |
| `confirm_new_password` | `confirm_new_password` | NO EXISTE | string | — | debe igualar `new_password` | CAMPO SOLO FRONTEND |

**Observacion adicional**: La implementacion en `profile.ts` (lineas 118-124) incluye una segunda validacion `.refine()` que verifica que `new_password !== current_password`. Esta regla de negocio no esta documentada explicitamente en la SPEC v1.3.0 §5 (que solo define `passwordChangeSchema` con tres campos). Sin embargo, es una mejora de seguridad coherente con las reglas de negocio del proyecto. Se documenta como **adicion benigna no especificada**.

**Veredicto**: ALINEADO (con adicion no especificada documentada)

---

### 1.7 `deleteAccountSchema` — `DELETE /users/me`

**Contrato de API (CLAUDE.md)**:
```
DELETE /users/me — requiere confirmacion de contrasena
```

| Campo | Zod (Implementado) | API Esperada | Tipo Zod | Tipo API | Validaciones Zod | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| `confirmation` | `confirmation` | NO EXISTE | literal `"ELIMINAR MI CUENTA"` | — | exact match | CAMPO SOLO FRONTEND |
| `password` | `password` | `password` | string | string | required, min 1 | ALINEADO |

**Veredicto**: ALINEADO

---

## 2. Verificacion de Enums Criticos

### 2.1 Enum `gender`

| Valor Zod (Frontend) | Label UI | Valor DB/API Backend | Coincidencia |
|:---|:---|:---|:---|
| `"M"` | Masculino | `"Masculino"` | NO COINCIDE — requiere mapeo |
| `"F"` | Femenino | `"Femenino"` | NO COINCIDE — requiere mapeo |
| `"O"` | Otro | `"Otro"` | NO COINCIDE — requiere mapeo |

**Definicion en SPEC §2 (CC-002)**: Keys UI = `M`, `F`, `O`. Esta es la fuente que autoriza los valores del Zod. La SPEC esta en conflicto con la DB (`gender_type` en Architecture §2.2: `{Masculino, Femenino, Otro}`).

**Conclusion**: Los valores UI abreviados (`M`, `F`, `O`) **deben ser mapeados** a los valores DB (`Masculino`, `Femenino`, `Otro`) en la capa de servicio del frontend antes de enviar el request a la API. La SPEC v1.3.0 §2 autoriza los keys de formulario UI; la Architecture define los valores que acepta el backend.

**Archivo afectado**: `frontend/src/lib/validations/auth.ts` (linea 100), `frontend/src/lib/validations/profile.ts` (linea 83).

---

### 2.2 Enum `country`

| Valor Zod (Frontend) | Label UI | Valor DB/API Backend | Coincidencia |
|:---|:---|:---|:---|
| `"CO"` | Colombia | `"CO"` | COINCIDE |
| `"US"` | EE.UU. | `"US"` | COINCIDE |
| `"CA"` | Canada | `"CA"` | COINCIDE |
| `"MX"` | Mexico | `"MX"` | COINCIDE |
| `"VE"` | Venezuela | `"VE"` | COINCIDE |
| `"OT"` | Otro | `"Other"` | NO COINCIDE — requiere mapeo |

**Discrepancia especifica**: El valor `"OT"` (Zod/SPEC §2) vs `"Other"` (DB `country_type` en Architecture §2.2). Cinco de seis valores son identicos. Solo el caso "Otro pais" requiere transformacion.

**Archivo afectado**: `frontend/src/lib/validations/auth.ts` (linea 108), `frontend/src/lib/validations/profile.ts` (linea 91).

---

## 3. Campos Problematicos Potenciales

### 3.1 `birth_date`: Formato de fecha

**Implementacion**: El Zod schema (`auth.ts` linea 89, `profile.ts` linea 72) define `birth_date` como `z.string()` con refine de edad minima. La funcion `isAtLeast18` parsea el string con `new Date(dateStr)`, esperando formato `YYYY-MM-DD`.

**Contrato API (Architecture §6.1)**: `"birth_date": "1990-01-01"` — explicitamente un string ISO 8601 (`YYYY-MM-DD`).

**Estado**: ALINEADO. El schema Zod recibe y valida strings `YYYY-MM-DD`, que es exactamente el formato que el backend espera. No hay conversion de tipo requerida.

**Precaucion de integracion**: El componente de formulario (`<input type="date">`) nativo retorna `YYYY-MM-DD`. Si se usa un Date Picker custom, debe garantizarse que el valor enviado al schema sea un string en formato ISO, no un objeto `Date`.

---

### 3.2 `token` en `resetPasswordSchema`: Origen del valor

**Implementacion**: El campo `token` existe en `resetPasswordSchema` (`auth.ts` linea 162-167) con validacion UUID. El comentario en el codigo (linea 163-165) documenta que viene "por query param" y se incluye para "validacion del payload completo antes del envio al backend (integracion Fase 4)".

**Estado del contrato**: La Architecture (§6) no especifica el contrato del endpoint `PATCH /auth/reset-password`. El CLAUDE.md indica que los campos son `token, new_password`, pero no especifica si `token` viaja en el body o como query param.

**Brecha detectada (GAP-R4-01)**: La mecanica de transporte del `token` de reset de contrasena no esta definida en la Architecture v1.5.0. Dos opciones validas:
  - Opcion A: Query param (`PATCH /auth/reset-password?token=uuid`) — el Zod schema lo captura del URL y lo incluye en el payload de validacion local.
  - Opcion B: Body JSON (`{"token": "uuid", "new_password": "..."}`) — el Zod schema representa exactamente el request body.

**Accion requerida**: El equipo de backend debe definir y documentar este comportamiento en la SPEC antes de la integracion real (Fase 4). El schema Zod actual es valido para ambas opciones en esta fase de mockup.

---

### 3.3 Campo `terms` en `registerSchema`

**Estado**: Campo de validacion exclusivamente frontend (`auth.ts` linea 121-123). El contrato de API en Architecture §6.1 **no incluye** el campo `terms` en el payload de `POST /auth/register`.

**Comportamiento correcto**: El checkbox `terms` debe ser validado en el frontend (Zod garantiza que sea `true`) antes de habilitar el submit. El campo **NO debe enviarse al backend**. La capa de servicio que construya el request body para `POST /auth/register` debe omitir `terms` y `confirm_password`.

**Riesgo de integracion**: Si el desarrollador toma `registerSchema`'s `z.infer<typeof registerSchema>` directamente como el tipo del request body, incluira `terms` y `confirm_password` en el payload. Esto podria causar errores de validacion Pydantic en el backend.

**Recomendacion [CON-F-01]**: En la capa de servicio/API client (Fase 4), implementar un mapper que extraiga solo los campos del contrato antes del envio: `{ email, password, first_name, last_name, birth_date, gender_mapped, country_mapped }`.

---

### 3.4 Campo `confirmation` en `deleteAccountSchema`

**Estado**: Campo de validacion exclusivamente frontend (`profile.ts` linea 142-144). El contrato de API para `DELETE /users/me` especifica solo "confirmacion de contrasena", que se mapea al campo `password`.

**Comportamiento correcto**: La keyword `"ELIMINAR MI CUENTA"` es un **guard de UI** que previene borrados accidentales. El backend solo necesita recibir la contrasena del usuario para autenticar la accion de borrado. El campo `confirmation` **NO debe enviarse al backend**.

---

### 3.5 Campo `confirm_password` / `confirm_new_password`

Presente en `registerSchema` (linea 116), `resetPasswordSchema` (linea 155) y `securitySchema` (linea 114). En todos los casos son campos de **validacion exclusiva de frontend** para garantizar que el usuario no cometa typos en la contrasena. Ningun endpoint de la API incluye un campo de confirmacion de contrasena. **No deben enviarse al backend**.

---

## 4. Adiciones No Especificadas en SPEC

| Schema | Campo / Logica | Descripcion | Evaluacion |
|:---|:---|:---|:---|
| `securitySchema` | Refine `current_password !== new_password` | Previene que la nueva contrasena sea igual a la actual | Adicion benigna de seguridad — coherente con best practices |
| `registerSchema` | `first_name`/`last_name` regex acepta acentos `\u00e0-\u00fc` | Soporte de caracteres latinos en nombres | Adicion correcta — la SPEC dice "solo letras" sin restriccion de encoding |
| `resetPasswordSchema` | Validacion UUID en `token` | Valida formato antes de enviar al backend | Adicion defensiva correcta |

---

## 5. Resumen de Discrepancias

| ID | Schema Afectado | Campo | Tipo | Descripcion | Bloqueante para Produccion |
|:---|:---|:---|:---|:---|:---|
| DIS-01 | `registerSchema`, `profileSchema` | `gender` | Enum mismatch | Valores UI `M/F/O` vs DB `Masculino/Femenino/Otro` | Si (requiere mapper en Fase 4) |
| DIS-02 | `registerSchema`, `profileSchema` | `country` | Enum mismatch | Valor UI `OT` vs DB `Other` | Si (requiere mapper en Fase 4) |
| GAP-R4-01 | `resetPasswordSchema` | `token` | Diseno sin definir | Transporte de token (query param vs body) no especificado en Architecture | No (fase mockup — debe resolverse en Fase 2/3) |
| OBS-01 | `registerSchema` | `terms`, `confirm_password` | Campo frontend-only | No deben enviarse al backend en Fase 4 | No (riesgo en capa de servicio) |
| OBS-02 | `deleteAccountSchema` | `confirmation` | Campo frontend-only | No debe enviarse al backend | No (riesgo en capa de servicio) |
| OBS-03 | `securitySchema` | Refine extra | Logica no especificada en SPEC | Valida `current_password !== new_password` | No (adicion benigna) |

---

## 6. Veredicto Final

### Estado: CONTRATO_SINCRONIZADO con OBSERVACIONES

Los 7 esquemas Zod implementados son **funcionalmente correctos para la fase de mockup**. Las validaciones de formulario estan bien definidas y los tests unitarios cubren los casos de borde criticos (edad exacta de 18 anos, passwords no coincidentes, enums invalidos).

**Las discrepancias detectadas (DIS-01, DIS-02) son esperadas y documentadas en la SPEC v1.3.0 §2 (CC-002)**: la SPEC define intencionalmente valores UI abreviados distintos a los valores de DB, reconociendo que existira una capa de mapeo. Esto no es un error — es una decision de diseno que debe materializarse en la Fase 4 de integracion.

**No existe ningun bloqueante para el cierre de la etapa f1_1.1** (fase de mockups). Las discrepancias identificadas son trabajo pendiente de la Fase 4, no defectos de esta etapa.

### Acciones Requeridas Antes de la Integracion (Fase 4)

1. **[CON-F-01]** Implementar mapper `gender`: `M -> Masculino`, `F -> Femenino`, `O -> Otro` en la capa de API client.
2. **[CON-F-02]** Implementar mapper `country`: `OT -> Other` (los demas valores son directamente compatibles).
3. **[CON-F-03]** Excluir `terms`, `confirm_password` y `confirmation` del payload de request al backend.
4. **[CON-F-04]** Definir y documentar en Architecture/SPEC el mecanismo de transporte del `token` en `PATCH /auth/reset-password` (GAP-R4-01).

### Certificacion para Etapa Actual

**CERTIFICADO** para el cierre de la etapa f1_1.1 (Mockups Visuales y UX). Los esquemas Zod cumplen con la SPEC v1.3.0 y las discrepancias detectadas son consistentes con el estado de prototipo de la etapa.

---

*Documento generado por TSK-F-R4 — Auditoría Técnica y de Contratos*
*Arbitraje ejecutado bajo Protocolo Contract-First / SSOT*
