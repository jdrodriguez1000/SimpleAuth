---
name: devops-pipeline
description: Protocolo técnico para la orquestación de contenedores (Docker), automatización de CI/CD y gestión de Infraestructura como Código (IaC).
user-invocable: false
agent: devops-integrator
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Protocolo de Orquestación y Despliegue (Docker/CI)
Este skill define el procedimiento técnico para garantizar que el entorno de SimpleAuth sea reproducible, seguro y eficiente. Se rige por el estándar Docker First de CLAUDE.md.

## Paso 1 — Análisis de Orquestación

Antes de configurar, revisa los servicios necesarios para la etapa:
1.  **Postgres (v16)**: ¿Tiene el volumen persistente configurado?
2.  **API (Python/FastAPI)**: ¿El Dockerfile usa una imagen ligera (`slim` o `alpine`) y carga dependencias limpias?
3.  **Web (Next.js)**: ¿Se usa la construcción multi-etapa (multi-stage build) para optimizar el tamaño de la imagen?
4.  **Red (Docker Network)**: ¿Los servicios se ven entre sí por DNS interno?


## Paso 2 — Configuración y Endurecimiento de Contenedores

Verifica y genera según sea necesario:
1.  **Dockerfiles**: Uso de usuarios no-root (`USER appuser`) por seguridad.
2.  **docker-compose.yml**: Definición clara de variables de entorno (usando archivos `.env` y `.env.example`).
3.  **Wait-for-DB Script**: Implementar la lógica que asegura que la API no inicie hasta que Postgres esté listo para recibir conexiones.
4.  **Healthchecks**: Definir el estado de salud de cada contenedor para el auto-reinicio.


## Paso 3 — Inyección de Recomendaciones de Infraestructura

Si detectas un riesgo de estabilidad o de seguridad en la imagen Docker:
1.  No corrijas el código si no es de infraestructura.
2.  Redacta la **Recomendación de Infra [INF-F-XX]** adjunta a la tarea.
3.  Informa al Auditor de Etapa: "El despliegue falla en arquitecturas ARM64/AMD64."


## Paso 4 — Notificación y Emisión de Token de Despliegue

**Opción A — Error de Aprovisionamiento Detectado:**
1.  Reporte detallado del log de fallo de Docker o del Pipeline de GitHub Actions.
2.  Genera el token `.agents/tokens/consulting/devops_infra_token.md` con estado `🚫 ERROR_DE_APROVISIONAMIENTO`.

**Opción B — Infraestructura Certificada:**
1.  Si todos los contenedores levantan con `health: healthy` y el pipeline de CI/CD es verde.
2.  Genera el archivo `.agents/tokens/consulting/devops_infra_token.md` con el siguiente contenido:

```markdown
# TOKEN: INFRA_CERTIFICADA_OK
- **Etapa**: [F].[E]
- **Servicios Validados**: [lista de servicios]
- **Healthcheck Stat**: ✅ TODOS SALUDABLES (100%)
- **Ciclo CI/CD**: ✅ VERDE (GitHub Actions)
- **Veredicto**: INFRAESTRUCTURA ROBUSTA
- **Fecha**: [YYYY-MM-DD]
```

## Reglas Innegociables

1.  **Cero Secretos en Imágenes**: Prohibido "quemar" (bake) contraseñas o tokens en los archivos Dockerfile o en las imágenes finales.
2.  **Imágenes Inmutables**: Promover el uso de tags de versión específicos (`python:3.12-slim`), nunca usar `latest`.
3.  **No modificar código de aplicación**: Eres el gestor de la "caja"; si el contenido de la caja no funciona, reporta, no metas la mano en la lógica.
4.  **Trazabilidad**: Relacionar cada reporte con un `[REQ-F-XX]` de infraestructura.
5.  **Limpieza Automática**: Todo script de limpieza de datos debe estar orquestado en el despliegue de desarrollo.
