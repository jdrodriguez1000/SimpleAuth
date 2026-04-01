# Change Control: CC-002 - Formalización de Logout en el Alcance

> [!IMPORTANT]
> **Estado**: `Autorizado` (Simulado para alineación inmediata)
> **Fecha**: 2026-04-01

## 1. Descripción del Cambio
Se solicita la formalización de la funcionalidad de **Logout** como una característica explícita dentro del alcande del proyecto (`PROJECT_scope.md`). Aunque técnicamente contemplada en las reglas de negocio de revocación de JWT, su ausencia en la lista de "Detailed Features" (Sección 3) genera incertidumbre en el diseño de UI/UX y en la planificación de pruebas.

## 2. Impacto en Documentación
- **PROJECT_scope.md**: Agregar la característica `F8: Secure Logout` en la sección 3.1.
- **f1_1.1_prd.md**: Incluir User Story y Requerimiento Funcional para el cierre de sesión (Ya realizado en v1.1.0).

## 3. Especificación de la Característica (F8)
- **Como** usuario autenticado, **quiero** cerrar mi sesión de forma voluntaria **para** asegurar que nadie más pueda usar mi cuenta en el dispositivo actual.
- **Criterios de Aceptación (AC)**:
  - El sistema debe invalidar el Refresh Token actual en la base de datos (`token_denylist`).
  - El sistema debe limpiar las cookies del navegador (`HttpOnly`).
  - El sistema debe redirigir al usuario a la pantalla de Login tras un cierre exitoso.

## 4. Veredicto de Auditoría
Cambio aceptado para garantizar la consistencia entre la arquitectura de seguridad y la interfaz de usuario.
