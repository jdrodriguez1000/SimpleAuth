# CLAUDE.md

Este archivo provee orientación a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Stack Tecnológico

| Capa            | Tecnología                                                          |
| --------------- | ------------------------------------------------------------------- |
| Frontend        | Next.js 15, TypeScript, Shadcn UI + Tailwind, Zod + React Hook Form |
| Backend         | FastAPI (Python 3.12+), SQLModel                                    |
| Base de Datos   | PostgreSQL 16, Alembic (migraciones)                                |
| Seguridad Auth  | PyJWT (HS256), Passlib/bcrypt (work factor 12)                      |
| Infraestructura | Docker + Docker Compose, Nginx/Traefik como gateway                 |
| Observabilidad  | Logs JSON estructurados, Sentry, `X-Correlation-ID` por petición    |
| Correo          | SMTP (Mailtrap en dev / SendGrid en prod)                           |


## Arquitectura

Arquitectura desacoplada de 3 capas:

```
Navegador (Next.js 15)
  ├─ Access Token: almacenado solo en memoria
  └─ Refresh Token: cookie HttpOnly + Secure + SameSite=Strict
       ↓
Gateway Nginx/Traefik (terminación SSL, reverse proxy)
       ↓
Backend FastAPI
  ├─ Controllers → Services → SQLModel → PostgreSQL
  └─ Servicio de Correo (SMTP)
```

La DB y la API no se exponen públicamente — todo el tráfico pasa por el gateway.

## Esquema de Base de Datos

Cuatro tablas: `users`, `auth_locks`, `auth_tokens`, `token_denylist`.

**Restricciones clave:**
- `email` es el identificador único universal en todos los estados del usuario — no se permiten duplicados en ningún estado
- `birth_date` validado con `CHECK (birth_date <= CURRENT_DATE - INTERVAL '18 years')`
- `gender`: enum `{Masculino, Femenino, Otro}`
- `country`: enum `{CO, US, CA, MX, VE, Other}`
- `status`: enum `{Pending, Active, Inactive}`

## Reglas de Auth y Seguridad

**Ciclo de vida de tokens:**
- Access Token: JWT, 1h, enviado como `Authorization: Bearer`
- Refresh Token: JWT, 7 días, cookie HttpOnly, rotado en cada uso (RTR)
- Ventana de gracia RTR: 30 segundos (maneja condiciones de carrera en peticiones concurrentes)
- Máximo 5 sesiones de Refresh Token activas por usuario; la más antigua se revoca automáticamente si se supera el límite

**Revocación de tokens:**
- Los `jti` de los JWT se rastrean en `token_denylist` (sin necesidad de Redis)
- El cambio de contraseña actualiza `password_changed_at` y el middleware rechaza cualquier token con `iat < password_changed_at`

**Rate limiting:**
- Persistido en la tabla `auth_locks` (sobrevive reinicios del servidor)
- Máximo 5 intentos fallidos por 15 min por identificador `ip:email`
- El contador se reinicia a 0 en cualquier login o refresh exitoso

**Casos borde en registro:**
- Email en estado `Pending`: permitir upsert (corrección de errores tipográficos antes de la verificación)
- Email en estado `Inactive`: bloquear registro y sugerir iniciar sesión para reactivar
- Usuario `Inactive` que provee contraseña correcta al hacer login: disparar correo de reactivación en lugar de autenticar

**Automatización GDPR:**
- Soft delete: establece `status = Inactive`, `deleted_at = NOW()`
- Hard delete CLI: `docker exec api_service python manage.py purge-inactive` (cron diario `0 0 * * *`)
- Jobs de limpieza cada hora: purgar cuentas `Pending` expiradas (1h), `auth_tokens` expirados, entradas expiradas de `token_denylist`, `auth_locks` obsoletos

## Contrato de Errores de API

Todas las respuestas de error (4xx/5xx) usan esta estructura:
```json
{
  "error": {
    "code": "AUTH_EXPIRED_TOKEN",
    "message": "Mensaje legible por humanos",
    "detail": "contexto legible por máquina",
    "correlation_id": "uuid-v4"
  }
}
```

## Endpoints Principales de la API

| Método | Ruta             | Propósito                                     |
| ------ | ---------------- | --------------------------------------------- |
| POST   | `/auth/register` | Registrar usuario (upsert si está Pending)    |
| GET    | `/auth/verify`   | Verificación de correo (double opt-in)        |
| POST   | `/auth/login`    | Login → retorna AT + establece cookie RT      |
| POST   | `/auth/refresh`  | Rotar RT (lee de cookie, sin body)            |
| POST   | `/auth/recovery` | Iniciar recuperación de contraseña por correo |
| PATCH  | `/users/me`      | Actualizar perfil (email es inmutable)        |
| DELETE | `/users/me`      | Soft delete de cuenta                         |
| GET    | `/health`        | Health check para orquestación                |

## Fases de Implementación

1. **Fase 1** — Mockups (Figma) + documento de Plan de Pruebas
2. **Fase 2** — Infraestructura Docker, setup FastAPI, migraciones Alembic, endpoints de registro y verificación, suite pytest
3. **Fase 3** — Login/JWT/RTR, gestión de perfil, reactivación, rate limiting, hardening CSRF/CORS, pruebas de integración
4. **Fase 4** — Integración frontend Next.js, pruebas E2E (Playwright), CLI GDPR + orquestación de crons

## Comandos de Desarrollo (Planificados)

Una vez implementado, los comandos esperados son:

```bash
# Backend
docker compose up --build         # Iniciar todos los servicios
docker compose exec api pytest    # Ejecutar pruebas del backend
docker compose exec api pytest tests/unit/test_auth.py  # Ejecutar un archivo de pruebas específico
docker compose exec api alembic upgrade head  # Aplicar migraciones
docker compose exec api python manage.py purge-inactive  # Hard delete GDPR

# Frontend
npm run dev    # Iniciar servidor de desarrollo Next.js
npm run build  # Build de producción
npm run lint   # ESLint
```

## Reglas de Comportamiento y Gobernanza

1.  **Mentalidad de Auditor (Devil's Advocate)**: El agente debe cuestionar proactivamente la lógica, los requerimientos y la arquitectura en busca de vacíos, contradicciones o "falsas negativas". No aceptes tareas mal definidas o con "magia técnica".
2.  **Soberanía Documental (SDD)**: El código es un reflejo **estricto** de la documentación. Se prohíbe escribir código funcional sin que existan —y estén autorizados— el PRD, SPEC, PLAN y TASK de la etapa correspondiente.
3.  **No Improvisar (Workflows)**: Utiliza siempre los agentes y habilidades especializados. No inventes flujos de ejecución fuera de los definidos en `.agents/workflows/` o en `.claude/agents/`.
4.  **Cadena de Confianza (Tokens)**: El inicio de cualquier etapa de desarrollo o diseño está condicionado a un token en estado **`AUTORIZADO`**. Sin el sello verde, el sistema se considera bloqueado.
5.  **Control de Cambios (CC)**: Toda modificación a documentos de gobernanza global (`Scope`, `Architecture`, `Plan`) o a etapas ya cerradas debe ser autorizada mediante un **Control de Cambios** formal (`/change-control`).

## Documentos de gobernanza

Los documentos de gobernanza están en `docs/governance/`:
- `PROJECT_scope.md` — Requerimientos de negocio y criterios de aceptación (v1.5.0 Final)
- `PROJECT_architecture.md` — Arquitectura técnica y contratos de API (v1.5.0 Production-Ready)
- `PROJECT_plan.md` — Hoja de ruta e implementación por fases (v1.6.1 Authorized)
- `PROJECT_ui_kit.md` — Sistema de diseño, paleta de colores y reglas estéticas (v1.1.0)
- `docs/references/process.md` — Protocolo de gobernanza de la Agencia (16 Agentes) y flujo de tokens.

## Agencia de Software Autónoma (16 Agentes)

El proyecto es ejecutado por una agencia de 16 agentes especializados organizados en 4 capas (Gobernanza, Backend, Frontend, Consultores). 
**DEBE consultarse `docs/references/process.md` siempre que:**
1. Se inicie una tarea de codificación, testing o review (`[TSK]`).
2. Se requiera una auditoría de seguridad, UI, GDPR o infraestructura.
3. Se necesite certificar la integración final de una etapa (E2E).
4. Se realice el cierre formal de una sesión o etapa.

Todo el desarrollo técnico sigue el **Pipeline de Tokens**: `Coder` → `Tester` → `Reviewer`.


## Mandatos Globales de Calidad
- **TDD (Test-Driven Development)**: Es obligatorio crear pruebas unitarias antes de la lógica funcional.
- **Limpieza de Código**: El código debe seguir principios de Clean Code y ser autodocumentado.
- **Seguridad por Diseño**: Todas las capas (Persistencia, Lógica, UI) deben implementar validaciones y seguridad de forma nativa.
- **Ambiente virtual obligatorio**: Nunca instalar en Python global. Agregar dependencia antes de usarla en código
al archivo 'requirements.txt' y ejecutar 'pip install -r requirements.txt'.


## Protocolo de Control de Cambios (CC)

Gestionado por el agente `change-controller`. Es obligatorio para cualquier modificación a la Gobernanza Global (`docs/governance/`) o a documentos de diseño de etapas ya cerradas o ajustes no presentes en los documentos sdd de la etapa actual.
- **Invariante**: Ningún cambio estructural se ejecuta sin un documento `CC_XXXXX.md` en estado `✅ Aprobado`.

## Metodología Spec-Driven Development (SDD)

Proceso lineal y obligatorio de diseño para cada etapa del proyecto (ubicada en `docs/f[F]_[E]/`):
1.  **PRD** — QUÉ: Definición de métricas de éxito y requerimientos de negocio.
2.  **SPEC** — CÓMO: Definición de contratos, interfaces y lógica algorítmica/negocio.
3.  **PLAN** — CUÁNDO: Estrategia de implementación y casos de prueba.
4.  **TASK** — ACCIÓN: Checklist técnico granular para ejecución por agentes.

### Cadena de Validación (Tokens)
Cada documento SDD debe ser auditado con mentalidad de **Abogado del Diablo** y poseer un token `AUTORIZADO` en `.agents/tokens/sdd/` para permitir el inicio del siguiente paso en la cadena.

### Resolución de Conflictos y Brechas
- **Prevalencia**: `Scope > Architecture > Plan > SDD Local (PRD/SPEC)`.
- **Detección de Vacíos (Gaps)**: Si una etapa carece de definición técnica suficiente, el agente tiene la **obligación de detenerse**. No se permite la improvisación de lógica de negocio en la fase de codificación.


## Flujo de Trabajo (Git)

### Estrategia de Ramas
- **`main`** — Rama estable. Solo código verificado.
- **`dev`** — Rama de desarrollo e integración. Cambios en progreso.
- **`feat/f[F]_[E]_*`** — Ramas de funcionalidad por etapa. **Obligatorias**.
- **Protección**: Prohibido el desarrollo de código o docs SDD directamente en `main` o `dev`. Uso obligatorio de Rama de Funcionalidad.

### Commits
Formato atómico en español: `feat:` | `fix:` | `docs:` | `refactor:` | `chore:`
**Ejemplo**: `feat: motor de estrategias con redistribución meritocrática`

## Convenciones de Idioma

- **Código / Archivos / Carpetas**: Inglés (`snake_case` archivos, `CamelCase` clases).
- **Documentación / Comentarios / Commits**: Español.
- **Interfaz (UI) / Salida al Usuario**: Español.
- **Variables / Funciones en el Código**: Inglés.
.

## Protocolo de Inicio y Cierre

### **Al Iniciar (Orden Obligatorio):**
1.  **Leer `CLAUDE.md`** (Gobernanza central).
2.  **Leer `PROJECT_handoff.md`** — Estado macro y táctico del proyecto.
3.  **Leer `docs/lessons/lessons-learned.md`** — Solo sección de etapa activa.
  
### **Al Iniciar (Opcional):**
1.  **Leer `.claude/agents-router.md`** (Mapa de delegación a subagentes).
2.  **Leer `docs/references/process.md`** — Protocolo de flujo de tokens y roles de agentes.
3.  **Leer `docs/changes/`** — Solo CCs en estado `✅ Aprobado`.
4.  **Leer `docs/database/schema.sql`** — Esquema actual de Supabase.

### **Al Cerrar sesión técnica (Garantía de Continuidad):**
1.  **Reescribir `PROJECT_handoff.md`**: Actualizar con archivos modificados, contexto inmediato, último error/bloqueador y próxima acción concreta.
2.  **Actualizar `docs/lessons/lessons-learned.md`**: Registrar hitos o descubrimientos críticos. **Prohibido sobrescribir lecciones anteriores**.
3.  **Asegurar** que el código pase los tests de la etapa actual (**TDD**).

### **Al Finalizar una ETAPA (Cierre de Hito):**
1.  **Crear/Actualizar `docs/executives/f[F]_[E]_executive.md`**: Resumir logros, métricas técnicas y estado final de la etapa. **Este documento es la única prueba de cierre**.
2.  **Actualizar el Indicador de Progreso** en la cabecera del siguiente prompt o handoff.
3.  **Solicitar aprobación del usuario** para pasar a la siguiente etapa del `PROJECT_plan.md`.

## Indicador de Progreso del Proyecto

```
E_total = Σ etapas de todas las fases (contar desde la tabla de abajo)
C       = número de archivos docs/executives/f*_executive.md existentes
Progreso Total = (C / E_total) × 100%
```

- **Nunca hardcodear** `E_total` — siempre contar dinámicamente desde la tabla del mapa de ruta.
- **Fuente de verdad de cierre**: La existencia de `docs/executives/f[F]_[E]_executive.md` marca la etapa como oficialmente terminada.