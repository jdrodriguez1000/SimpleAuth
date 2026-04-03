---
name: db-management
description: Protocolo técnico para la gestión de esquemas PostgreSQL, ejecución de migraciones con Alembic y auditoría de datos.
user-invocable: false
agent: db-manager
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Protocolo de Operación: Infraestructura de Datos (PostgreSQL)

Este skill define el procedimiento técnico obligatorio para cualquier modificación, inspección o mantenimiento de la base de datos PostgreSQL 16. Se rige por la Política de Migraciones de CLAUDE.md.


## Paso 0 — Identificar la Operación Solicitada

Antes de ejecutar cualquier acción, clasifica la solicitud:

| Código       | Operación      | Descripción                                                                                           |
| ------------ | -------------- | ----------------------------------------------------------------------------------------------------- |
| `OP-INTRO`   | Inspección     | Verificar existencia de tablas, columnas, índices, ENUMs o CHECKs vía `information_schema`.           |
| `OP-MIG`     | Migraciones    | `alembic revision --autogenerate` o `alembic upgrade head` para cambios estructurales.                |
| `OP-DDL`     | DDL Manual     | Consultas `CREATE` o `ALTER` (restringido a entorno de desarrollo para ajustes puntuales).            |
| `OP-AUDIT`   | Auditoría      | Verificación de integridad: `jti` en denylist, estados de usuarios (`Pending`, `Active`, `Inactive`). |
| `OP-HYGIENE` | Higiene (GDPR) | Ejecución de la utilidad `purge-inactive` (Hard Delete de 30 días) y limpieza horaria.                |
| `OP-CONN`    | Conectividad   | Verificar conexión a Postgres desde el contenedor de la API (Python).                                 |

Si la solicitud es ambigua, preguntar al usuario:

```
¿Qué operación de base de datos necesitas ejecutar?
Opciones: inspección / migraciones / auditoría / higiene (GDPR) / conectividad
```

## Paso 1 — Verificar Prerrequisitos

Antes de cualquier cambio estructural (`OP-MIG`, `OP-DDL`) o eliminación (`OP-HYGIENE`):

1. Leer `docs/database/schema.sql` — fuente de verdad del esquema actual.
2. Leer `CLAUDE.md` — sección de Política de Migraciones.
3. Para cambios de esquema: verificar en `docs/changes/` que existe un Control de Cambio (CC) en estado `✅ Aprobado`.

Si se requiere CC y no existe, detener inmediatamente:

```
BLOQUEADO — CAMBIO DE ESQUEMA SIN CC APROBADO
Toda modificación al schema (Alembic) requiere un Control de Cambio aprobado.
Invocar /change-control para formalizar el cambio antes de continuar.
```

## Paso 2 — Canal de Acceso y Ejecución

Usar el comando de ejecución correcto según el entorno Docker:

| Entorno           | Comando Base                                       | Nota                                                      |
| ----------------- | -------------------------------------------------- | --------------------------------------------------------- |
| **API Container** | `docker exec api_service [comando]`                | Para Alembic, scripts de purga y scripts de conectividad. |
| **DB Container**  | `docker exec postgres_db psql -U user -d db [sql]` | Para consultas directas de inspección o auditoría.        |

Las credenciales se cargan SIEMPRE desde archivos `.env` o variables de entorno del contenedor. Nunca hardcodear conexión strings.


## Paso 3 — Ejecución por Tipo de Operación

### OP-INTRO — Inspección de Esquema (PostgreSQL Nativo)

Verificar la existencia de tablas y sus propiedades:

```sql
-- Verificar tablas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Verificar columnas y tipos
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = '{tabla}' ORDER BY ordinal_position;

-- Verificar tipos ENUM definidos
SELECT n.nspname as schema, t.typname as type 
FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid 
WHERE t.typtype = 'e';
```

### OP-MIG — Gestión de Alembic

Toda alteración de tablas (`users`, `auth_locks`, etc.) se realiza mediante migraciones:

1. **Autogeneración**: `docker exec api_service alembic revision --autogenerate -m "descripción"`.
2. **Revisión**: Leer el archivo de migración generado en `alembic/versions/` antes de aplicarlo.
3. **Aplicación**: `docker exec api_service alembic upgrade head`.
4. **Verificación**: Comprobar que la base de datos se ha actualizado correctamente.

### OP-HYGIENE — Higiene GDPR y Limpieza Operativa

Ejecutar las tareas de purga programadas:

```bash
# Purga manual de usuarios inactivos (GDPR)
docker exec api_service python manage.py purge-inactive

# Limpieza operacional horaria (Pending/Expired tokens)
docker exec api_service python manage.py cleanup-hourly
```

### OP-AUDIT — Auditoría de Integridad y Seguridad

```sql
-- Estado de usuarios (conteo)
SELECT status, COUNT(*) FROM users GROUP BY status;

-- Revisión de rate limiters activos
SELECT COUNT(*) FROM auth_locks WHERE locked_until > NOW();

-- Sesiones en Denylist
SELECT COUNT(*) FROM token_denylist WHERE expires_at > NOW();
```

## Paso 4 — Sincronización de schema.sql

Después de cada migración exitosa (`alembic upgrade head`):

1. Leer el archivo actual `docs/database/schema.sql`.
2. Actualizar el bloque DDL correspondiente (tablas, tipos ENUM, índices).
3. Asegurar que incluya las restricciones `CHECK` y valores `DEFAULT` exactos.
4. Escribir el archivo sincronizado.

La estructura de `docs/database/schema.sql` sigue el orden de la Arquitectura (Sección 2).


## Paso 5 — Reporte Final

Al completar la operación, presentar un reporte conciso:

```
OPERACION: [OP-INTRO / OP-MIG / OP-AUDIT / OP-HYGIENE / OP-CONN]
ESTADO: Completado / Bloqueado / Parcial

| Acción ejecutada | Resultado  | Notas                       |
| ---------------- | ---------- | --------------------------- |
| [descripción]    | OK / ERROR | [detalle o código de error] |

schema.sql: [Actualizado / Sin cambios]
Próxima acción sugerida: [Ejecutar tests / Aplicar CC / etc.]
```


## Restricciones Innegociables

1. **Alembic como Único Canal de Escritura**: No ejecutar `CREATE TABLE` o `ALTER TABLE` manuales en producción. Usar siempre el flujo de migraciones.
2. **Respeto a GDPR**: Nunca retrasar la ejecución de purgas de datos de cuentas inactivas (+30 días).
3. **Validación de CHECK Constraints**: Asegurar que `birth_date` siempre cumpla la política de >= 18 años.
4. **Cero Hardcoding**: Conexión a base de datos basada estrictamente en variables de entorno.
5. **No eliminación manual**: Nunca ejecutar `DELETE` o `TRUNCATE` directos desde fuera de los scripts de purga autorizados (`manage.py`).
