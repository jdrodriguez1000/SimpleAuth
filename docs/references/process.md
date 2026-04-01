# Protocolo de Gobernanza y Desarrollo — Proyecto SimpleAuth

Este documento define el flujo de trabajo estricto de la **Agencia de Software Autónoma**. Ninguna línea de código o cambio estructural es válido si no sigue este proceso de paso de tokens y validaciones cruzadas.

---

## 🏛️ 1. Arquitectura de la Agencia (16 Agentes)

La agencia opera en **4 Capas de Especialidad** coordinadas por Claude Code.

### Capa 1: Gestión y Gobernanza (Executive)
*   **`db-manager`**: Única autoridad sobre PostgreSQL 16 y Alembic.
*   **`stage-auditor`**: Juez final de etapas; gatekeeper del DoD.
*   **`stage-closer`**: Notario de negocio; redacta resúmenes ejecutivos.
*   **`session-closer`**: Archivista del estado del proyecto (Handoff) y lecciones aprendidas.

### Capa 2: Pipeline Técnico de Backend (Python)
*   **`backend-coder`** → **`backend-tester`** → **`backend-reviewer`**
*   **Tokens**: `coder_token` → `tester_token` → `reviewer_token`.
*   **Propósito**: Lógica de negocio, modelos y API robusta.

### Capa 3: Pipeline Técnico de Frontend (Web)
*   **`frontend-coder`** → **`frontend-tester`** → **`frontend-reviewer`**
*   **Tokens**: `coder_token` → `tester_token` → `reviewer_token`.
*   **Propósito**: Interfaz de usuario premium, Next.js y consistencia visual.

### Capa 4: Seniors y Consultores Transversales (Advisory)
*   **`integration-tester`**: Certificación final E2E (Playwright).
*   **`security-hardener`**: Blindaje OWASP y cifrado.
*   **`ui-consistency-manager`**: Guardián del Design System.
*   **`gdpr-compliance-officer`**: Cumplimiento de privacidad y purgas de 30 días.
*   **`devops-integrator`**: Orquestación Docker y CI/CD.
*   **`integration-mediator`**: Árbitro de contratos OpenAPI (Web-API sync).

---

## 🚀 2. Flujo de Desarrollo (Pase de Pasaporte)

Cada tarea técnica `[TSK]` sigue un pasaporte de validación obligatorio:

### Fase A: Codificación (Coder)
1.  El Coder lee la SPEC y la Tarea.
2.  Implementa la lógica (Backend o Frontend).
3.  Genera `[backend/frontend]_coder_token.md`.

### Fase B: Validación Funcional (Tester)
1.  El Tester detecta el token del Coder.
2.  Ejecuta Pytest (Backend) o React Testing (Frontend).
3.  Si falla: Genera `BLOQUEO` → Vuelve al Coder.
4.  Si pasa: Genera `[backend/frontend]_tester_token.md` (CONFORME).

### Fase C: Auditoría Técnica (Reviewer)
1.  El Reviewer detecta el token del Tester.
2.  Realiza el Code Review (Seguridad, Calidad, Estándares).
3.  Si falla: Genera `RECHAZADO` → Vuelve al Coder.
4.  Si pasa: Genera `[backend/frontend]_reviewer_token.md` (APROBADO).
5.  **Único Punto de Cierre**: El Reviewer marca la tarea `[x]` en el Task List.

---

## 🧪 3. Proceso de Integración y Cierre de Etapa

Cuando todas las tareas `[TSK]` de una etapa están marcadas como `[x]`:

1.  **Arbitraje de Contrato**: El `integration-mediator` valida que el API y la Web estén sincronizados (`api_contract_token.md`).
2.  **Blindaje**: El `security-hardener` y `gdpr-compliance-officer` emiten sus certificados de seguridad y privacidad.
3.  **Prueba de Fuego (E2E)**: El `integration-tester` ejecuta el flujo completo del usuario en Docker. Genera `integration_token.md`.
4.  **Auditoría de Etapa**: El `stage-auditor` revisa toda la evidencia anterior. Si todo es correcto, emite el `audit_token.md`.
5.  **Cierre Formal**: El `stage-closer` genera el Resumen Ejecutivo en `docs/executives/` y limpia los tokens temporales de la etapa.

---

## 💾 4. Protocolo de Cierre de Sesión

Al terminar la interacción con el usuario (Fin de jornada):
1.  **`session-closer`** es invocado.
2.  **Paso 1 (Handoff)**: Actualiza `PROJECT_handoff.md` con el estado táctico preciso.
3.  **Paso 2 (Lecciones)**: Registra los éxitos y fallos en `docs/lessons/lessons-learned.md`.

---

## ⚖️ 5. Reglas de Inmodificabilidad

-   Ningún agente puede saltarse el orden del pipeline (Coder → Tester → Reviewer).
-   Los tokens se almacenan de forma centralizada en `.agents/tokens/`.
-   La base de datos solo es modificada por `db-manager` (Alembic).
-   **Zero-Unchecked-Task**: No se puede cerrar una etapa si queda una tarea `[ ]` sin el veredicto del Reviewer.

---

> [!IMPORTANT]
> Este proceso es la ley del proyecto. Cualquier desviación será detectada y bloqueada por el `stage-auditor`.
