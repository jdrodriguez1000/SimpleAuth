# PROJECT: SimpleAuth - Scope Document

> [!IMPORTANT]
> **Status**: `Final`  
> **Version**: 1.5.0  
> **Last Updated**: 2026-04-01

## 1. Executive Summary
El proyecto **SimpleAuth** tiene como objetivo desarrollar una aplicación web de autenticación y gestión de perfiles de usuario funcional, segura y moderna. El sistema implementa flujos completos de registro con verificación de correo, inicio de sesión basado en JWT y administración de perfiles con políticas de eliminación lógica, reactivación y purgado definitivo de datos.

## 2. High-Level Objectives
- Implementar un sistema de registro con validación estricta, verificación de correo (Tokens con validez de 1 hora) y política de edad mínima (+18 años).
- Proveer un mecanismo de autenticación robusto con JWT (Access Tokens 1h + Refresh Tokens en Cookies HttpOnly).
- Gestión de perfiles con listas cerradas de datos (País, Género).
- Implementar la baja de usuario mediante eliminación lógica (Soft Delete) y utilidad administrativa CLI para eliminación definitiva (Hard Delete/GDPR).

## 3. Detailed Features & Acceptance Criteria

### 3.1 Authentication & Authorization
- **F1: Register & Profile Creation**:
  - **Como** usuario, **quiero** registrarme proporcionando correo, contraseña y datos personales (Nombre, Apellido, Nacimiento, Género, País) **para** crear mi cuenta.
  - **Criterios de Aceptación (AC)**:
    - Validación de contraseña: Mínimo 8 caracteres, al menos una mayúscula, un número y un símbolo especial.
    - Datos obligatorios: Correo, Contraseña, Nombre, Apellido, Fecha de Nacimiento (Mínimo 18 años cumplidos), Género, País.
    - El correo electrónico es el identificador único universal (incluyendo estados `Active`, `Pending_Verification` e `Inactive`).
    - **Recuperación de Errores**: Un usuario con un registro en estado `Pending_Verification` que detecte un error tipográfico puede simplemente registrarse con el correo correcto. El registro previo (incorrecto) será limpiado automáticamente al expirar su token (1h) para optimizar la base de datos.
    - Género y País se seleccionarán de las listas cerradas definidas en este documento.
    - No se permite duplicidad de correos electrónicos en ningún estado del sistema.
- **F2: Email Verification (Double Opt-in)**:
  - **Como** usuario registrado, **debo** verificar mi correo mediante un enlace enviado a mi casilla **para** poder iniciar sesión por primera vez.
  - **AC**: El sistema envía un token vía SMTP. El estado inicial de la cuenta es `Pending_Verification`. El token tiene una validez de 1 hora. **Funcionalidad de reenvío**: Se permite solicitar un nuevo correo de verificación si el anterior expiró o no llegó.
- **F3: Secure Login**:
  - **Como** usuario verificado, **quiero** iniciar sesión con correo y contraseña **para** obtener acceso a la aplicación.
  - **AC**: Autenticación exitosa genera un par de tokens:
    - **Access Token**: JWT (vence en 1 hora).
    - **Refresh Token**: Almacenado en Cookie `HttpOnly` y `Secure` (vence en 7 días).
  - **Rotación**: Cada uso del Refresh Token genera uno nuevo (Refresh Token Rotation).
- **F4: Password Recovery**:
  - **Como** usuario, **quiero** solicitar un reset de contraseña vía email **para** recuperar mi cuenta si olvido mis credenciales.
  - **AC**: El enlace de recuperación tiene una validez de 1 hora.
- **F8: Secure Logout (CC-002)**:
  - **Como** usuario autenticado, **quiero** cerrar mi sesión **para** asegurar que nadie más pueda usar mi cuenta en el dispositivo.
  - **AC**: El sistema invalida el Refresh Token en Postgres (`token_denylist`) y limpia las cookies del navegador de inmediato.

### 3.2 Management & Maintenance
- **F5: Account Deletion (Soft & Hard Delete)**:
  - **Como** usuario, **quiero** darme de baja de la aplicación **para** cesar mi registro o solicitar la eliminación total de mis datos personales.
  - **AC**: 
    - **Soft Delete**: Marca la cuenta como `Inactive`. El usuario no puede loguearse.
    - **Hard Delete (Automated)**: El sistema debe incluir un proceso programado (Scheduled Job) que ejecute la **Utilidad CLI Administrativa** para purgar físicamente los datos de cuentas inactivas tras un periodo legal (30 días default) cumpliendo con GDPR.
  - **Flujo de Reactivación**: Un usuario `Inactive` que intente loguearse y proporcione sus **credenciales correctas** (Email + Password) recibirá la opción de reactivar su cuenta enviándole un nuevo correo de verificación (F2). Esto previene que terceros disparen correos de reactivación no deseados.
- **F6: Profile Update**:
  - **Como** usuario logueado, **quiero** cambiar mi contraseña o editar mis datos de perfil (excepto email) **para** mantener mi información actualizada.
  - **AC**: El correo electrónico NO es editable una vez verificado. **Seguridad**: El cambio de contraseña invalida automáticamente TODOS los tokens activos (Access y Refresh) del usuario en la base de datos de sesiones/denylist.
### 3.3 UI & Extended Features
- **F7: Theme Switching (Dark/Light Mode)**:
  - **Como** usuario, **quiero** alternar entre modo claro y oscuro **para** mejorar mi ergonomía visual y accesibilidad.
  - **AC**: El sistema persiste la elección del tema mediante `LocalStorage` en el navegador (no requiere almacenamiento en base de datos). El tema se aplica con estrategia de clases en Tailwind CSS.

## 4. Technical Constraints (Stack)
- **Frontend**: Next.js 14/15, Tailwind (Shadcn UI), TypeScript, Zod/React Hook Form.
- **Backend**: FastAPI (Python 3.12+), SQLModel (Postgres).
- **Security**: PyJWT, Passlib (bcrypt).
- **Session DB**: Tabla `token_denylist` en Postgres para revocación sin necesidad de Redis.
- **Communications**: SMTP (Mailtrap/SendGrid para correos transaccionales).
- **Deployment**: Docker & Docker Compose (Entorno de desarrollo y prod).

## 5. Out of Scope (Exclusiones)
- Login social (Social Auth) para el MVP.
- Roles administrativos múltiples (Solo un rol de sistema para purgado de datos).
- Edición de correo electrónico tras la verificación inicial.

---
## 6. Business Rules Summary
- **Password Policy**: Mínimo 8 caracteres con mayúscula, número y símbolo.
- **Token/Session Policy**: Tokens de correo (1h). Refresh Token (7 días) con rotación. Access Token (1h).
- **Data Retention**: Eliminación lógica inmediata. Purga física (Hard Delete) automatizada vía Scheduled Job / CLI tras 30 días de inactividad.
- **Rate Limiting**: Protección híbrida (IP + Account). Bloqueo temporal de 15 minutos tras 5 intentos fallidos consecutivos. El estado de bloqueo se persiste en la tabla `auth_locks` en Postgres para mitigar ataques de fuerza bruta distribuidos.
- **JWT Revocation**: Implementación de Denylist en Postgres (JTI para Logout, UserID para cambio de pass) para revocar tokens de forma inmediata.
- **Closed Lists**: 
  - **Países**: Colombia, Estados Unidos, Canadá, México, Venezuela, **Otro** (Lista definitiva para MVP).
  - **Géneros**: Masculino, Femenino, Otro (Lista definitiva para MVP).
- **Age Policy**: Solo se permiten usuarios mayores de 18 años (Basado en campo `birth_date`).
- **Email Primary Key**: El email es el identificador único inmutable una vez verificado.
