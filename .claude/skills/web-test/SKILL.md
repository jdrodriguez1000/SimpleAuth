---
name: web-test
description: Protocolo técnico para la ejecución de pruebas de componentes (Vitest), flujos de usuario (E2E) y validación de lógica de cliente en Next.js.
user-invocable: false
agent: frontend-tester
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Protocolo de Validación y QA Frontend (UI/UX)

Este skill define el procedimiento técnico obligatorio para verificar que la interfaz de usuario de SimpleAuth sea funcional y libre de regresiones. Se rige por el estándar de TDD Universal de CLAUDE.md.

## Paso 1 — Verificar Token del Coder

Antes de iniciar pruebas, busca el archivo `.agents/tokens/pipeline/frontend_coder_token.md`.
Si el archivo **no existe** o el estado es diferente a `✅ TERMINADA`:
1.  Detener flujo.
2.  Informa: "Esperando el token del frontend-coder para iniciar la validación de UI."

## Paso 2 — Configuración del Test Environment

1.  **Vitest + React Testing Library**: Para tests unitarios de componentes (botones, inputs, formularios).
2.  **Mocks de API (MSW)**: No uses la API real del backend en esta fase. Utiliza `Mock Service Worker` para simular respuestas (éxito, 401, 500) y verificar cómo reacciona la UI.
3.  **Playwright (Opcional en esta fase)**: Para validación de flujos de navegación elementales en el navegador.


## Paso 3 — Ejecución de Pruebas de UI

Valida los tres estados del componente:
1.  **Default/Idle**: El componente se renderiza correctamente según el diseño.
2.  **Loading**: Se muestra el spinner o el estado de carga al invocar una acción.
3.  **Result (Success/Error)**: La UI reacciona correctamente a la respuesta del mock de API (ej. redirigir tras login exitoso o mostrar un toast de error).


## Paso 4 — Notificación y Emisión de Token de Veredicto

**Opción A — Fallos Visuales o de Lógica:**
1.  Identifica el componente y el caso de prueba fallido.
2.  Genera el token `.agents/tokens/pipeline/frontend_tester_token.md` con estado `🚫 BLOQUEADO`.
3.  Elimina el `frontend_coder_token.md`.

**Opción B — Éxito de Interfaz:**
1.  Genera el token `.agents/tokens/pipeline/frontend_tester_token.md` con contenido:

```markdown
# TOKEN: FRONTEND_TESTER_CONFORME
- **Tarea**: [TSK-F-XX]
- **Resultado Tests**: ✅ ÉXITO en [cantidad] componentes
- **Mocks Utilizados**: [lista de mocks API]
- **Veredicto**: CONFORME
- **Fecha**: [YYYY-MM-DD]
```

## Reglas Innegociables

1.  **Snapshot Testing**: Úsalo para detectar cambios de diseño no deseados en componentes comunes.
2.  **Prohibido ignorar advertencias**: No emitas un token si ves errores de consola de React (ej. falta de keys, props inválidas) aunque el test "pase".
3.  **A11y Tests**: Realiza una validación básica de accesibilidad (ej. que los inputs tengan label asociado).
4.  **No modificar el diseño**: Si un componente no se ve "bien" pero el código funciona, reporta la observación estéticamente pero cede el veredicto final al **frontend-reviewer**.
5.  **Mocks Inalterables**: No modifiques los mocks de la API para que el test pase; el código debe adaptarse al contrato definido.
