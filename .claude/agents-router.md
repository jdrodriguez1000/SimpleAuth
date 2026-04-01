---
# Router de Agentes Especializados — Proyecto SimpleAuth

Este archivo mapea la gobernanza de los agentes especializados del proyecto. Claude Code debe consultar este router antes de delegar tareas estructurales, de persistencia, de cierre de etapa o de arquitectura.

## 🤖 Agentes Especializados

### 🛡️ Capa 1: Gobernanza y Gestión
| Agente | Archivo de Instrucciones | Habilidades (Skill Path) | Estado | Responsabilidad Principal |
|---|---|---|---|---|
| **db-manager** | [.claude/agents/db-manager.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/db-manager.md) | [db-management](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/db-management/SKILL.md) | ✅ Activo | Gestión exclusiva del esquema PostgreSQL 16 y migraciones Alembic. |
| **stage-auditor** | [.claude/agents/stage-auditor.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/stage-auditor.md) | [stage-audit](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/stage-audit/SKILL.md) | ✅ Activo | Auditoría forense técnica y documental. Certificación del DoD antes del cierre. |
| **stage-closer** | [.claude/agents/stage-closer.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/stage-closer.md) | [stage-close](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/stage-close/SKILL.md) | ✅ Activo | Redacción formal del Resumen Ejecutivo de fin de etapa en lenguaje de negocio. |
| **session-closer** | [.claude/agents/session-closer.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/session-closer.md) | [s-handoff](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/session-close-handoff/SKILL.md), [s-lessons](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/session-close-lessons/SKILL.md) | ✅ Activo | Cierre de sesión en dos pasos: handoff de estado y registro de lecciones aprendidas. |

### 🐍 Capa 2: Pipeline de Backend (Python)
| Agente | Archivo de Instrucciones | Habilidades (Skill Path) | Estado | Responsabilidad Principal |
|---|---|---|---|---|
| **backend-coder** | [.claude/agents/backend-coder.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/backend-coder.md) | [python-code](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/python-code/SKILL.md) | ✅ Activo | Desarrollo de lógica, modelos y endpoints en Python/FastAPI. |
| **backend-tester** | [.claude/agents/backend-tester.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/backend-tester.md) | [python-test](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/python-test/SKILL.md) | ✅ Activo | Creación y ejecución de tests unitarios y de integración con Pytest. |
| **backend-reviewer** | [.claude/agents/backend-reviewer.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/backend-reviewer.md) | [python-review](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/python-review/SKILL.md) | ✅ Activo | Code Review final, auditoría de seguridad y cierre oficial de tareas. |

### ⚛️ Capa 3: Pipeline de Frontend (Next.js)
| Agente | Archivo de Instrucciones | Habilidades (Skill Path) | Estado | Responsabilidad Principal |
|---|---|---|---|---|
| **frontend-coder** | [.claude/agents/frontend-coder.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/frontend-coder.md) | [web-code](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/web-code/SKILL.md) | ✅ Activo | Desarrollo de interfaz premium, componentes y estados en Next.js. |
| **frontend-tester** | [.claude/agents/frontend-tester.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/frontend-tester.md) | [web-test](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/web-test/SKILL.md) | ✅ Activo | Validación funcional de UI, accesibilidad y mocks de API con MSW/Vitest. |
| **frontend-reviewer** | [.claude/agents/frontend-reviewer.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/frontend-reviewer.md) | [web-review](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/web-review/SKILL.md) | ✅ Activo | Auditoría visual, consistencia del Design System y cierre oficial de tareas web. |

### 🧠 Capa 4: Especialistas Transversales (Seniors)
| Agente | Archivo de Instrucciones | Habilidades (Skill Path) | Estado | Responsabilidad Principal |
|---|---|---|---|---|
| **integration-tester** | [.claude/agents/integration-tester.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/integration-tester.md) | [e2e-test](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/e2e-test/SKILL.md) | ✅ Activo | Pruebas de extremo a extremo (E2E) con Playwright. Certificación final. |
| **security-hardener** | [.claude/agents/security-hardener.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/security-hardener.md) | [security-audit](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/security-audit/SKILL.md) | ✅ Activo | Auditoría de ciberseguridad, cifrado y blindaje de API (OWASP). |
| **ui-consistency-manager** | [.claude/agents/ui-consistency-manager.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/ui-consistency-manager.md) | [ui-design-audit](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/ui-design-audit/SKILL.md) | ✅ Activo | Guardián del sistema de diseño, estética premium y accesibilidad web. |
| **gdpr-compliance-officer** | [.claude/agents/gdpr-compliance-officer.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/gdpr-compliance-officer.md) | [privacy-audit](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/privacy-audit/SKILL.md) | ✅ Activo | Auditoría de privacidad, purga de 30 días y cumplimiento GDPR. |
| **devops-integrator** | [.claude/agents/devops-integrator.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/devops-integrator.md) | [devops-pipeline](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/devops-pipeline/SKILL.md) | ✅ Activo | Orquestación Docker, pipelines CI/CD e infraestructura como código. |
| **integration-mediator** | [.claude/agents/integration-mediator.md](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/agents/integration-mediator.md) | [contract-arbitration](file:///c:/Users/USUARIO/Documents/Work/SimpleAuth/.claude/skills/contract-arbitration/SKILL.md) | ✅ Activo | Arbitraje de contratos técnicos (OpenAPI) y sincronización Web-API. |

---

## 🏛️ Gobernanza y Restricciones

1. **Delegación de Autoridad**: Cualquier operación estructural o de persistencia **DEBE** ser delegada a estos agentes.
2. **Uso de Habilidades**: Los agentes tienen prohibido improvisar lógica técnica; deben invocar y seguir estrictamente sus habilidades (`SKILL.md`).
3. **Flujo de Tokens**: El pipeline es la única vía válida para completar tareas `[TSK]`.
4. **Inter-dependencia**: Ciertos cierres de etapa requieren tokens de la Capa 4 (Seguridad, GDPR) según la criticidad de la SPEC.

---

> [!IMPORTANT]
> Este router es el mapa de comando del proyecto. No modificar sin autorización expresa del Auditor de Gobernanza.
