// [REQ-F-01] - Esquemas Zod de autenticacion: registro, login, recovery, reset-password
// [TSK-F-12.1] - Definir schemas Zod para Auth en lib/validations/auth.ts (SPEC v1.3.0 §5)

import { z } from "zod";
import { passwordField, isAtLeast18 } from "./shared";

// ---------------------------------------------------------------------------
// loginSchema
// [REQ-F-02] — SPEC v1.3.0 §5 loginSchema
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  /** Correo electronico en formato valido. */
  email: z.string().email("El correo electronico no es valido"),
  /** Contrasena minima de 8 caracteres (sin requisitos adicionales en login). */
  password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// registerSchema
// [REQ-F-01] — SPEC v1.3.0 §5 registerSchema
// Enum values: M/F/O y CO/US/CA/MX/VE/OT (SPEC §2 CC-002, UI forms)
// ---------------------------------------------------------------------------

export const registerSchema = z
  .object({
    /** Nombre: maximo 50 caracteres, solo letras y espacios (incluye acentos). */
    first_name: z
      .string()
      .min(1, "El nombre es obligatorio")
      .max(50, "El nombre no puede superar 50 caracteres")
      .regex(
        /^[A-Za-z\u00e0-\u00fc\s'-]+$/i,
        "El nombre solo puede contener letras"
      ),

    /** Apellido: maximo 50 caracteres, solo letras y espacios (incluye acentos). */
    last_name: z
      .string()
      .min(1, "El apellido es obligatorio")
      .max(50, "El apellido no puede superar 50 caracteres")
      .regex(
        /^[A-Za-z\u00e0-\u00fc\s'-]+$/i,
        "El apellido solo puede contener letras"
      ),

    /** Correo electronico en formato valido. */
    email: z.string().email("El correo electronico no es valido"),

    /** Fecha de nacimiento (YYYY-MM-DD). Debe cumplir edad minima de 18 anos. */
    birth_date: z
      .string()
      .min(1, "La fecha de nacimiento es obligatoria")
      .refine(isAtLeast18, {
        message: "Debes ser mayor de 18 anos para registrarte",
      }),

    /**
     * Genero — valores del enum SPEC §2 CC-002:
     * M = Masculino, F = Femenino, O = Otro
     */
    gender: z.enum(["M", "F", "O"] as const, {
      error: "Selecciona un genero valido",
    }),

    /**
     * Pais — valores del enum SPEC §2 CC-002:
     * CO, US, CA, MX, VE, OT
     */
    country: z.enum(["CO", "US", "CA", "MX", "VE", "OT"] as const, {
      error: "Selecciona un pais valido",
    }),

    /** Contrasena con requisitos de fortaleza. */
    password: passwordField,

    /** Confirmacion de contrasena — debe coincidir con password. */
    confirm_password: z
      .string()
      .min(1, "La confirmacion de contrasena es obligatoria"),

    /** Aceptacion de Terminos y Condiciones — debe ser true. */
    terms: z.literal(true, {
      error: "Debes aceptar los Terminos y Condiciones para continuar",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contrasenas no coinciden",
    path: ["confirm_password"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ---------------------------------------------------------------------------
// recoverySchema
// [REQ-F-04] — SPEC v1.3.0 §5 recoveryRequestSchema
// ---------------------------------------------------------------------------

export const recoverySchema = z.object({
  /** Correo electronico para el envio del enlace de recuperacion. */
  email: z.string().email("El correo electronico no es valido"),
});

export type RecoveryFormData = z.infer<typeof recoverySchema>;

// ---------------------------------------------------------------------------
// resetPasswordSchema
// [REQ-F-04] — SPEC v1.3.0 §5 resetPasswordSchema
// ---------------------------------------------------------------------------

export const resetPasswordSchema = z
  .object({
    /** Nueva contrasena con requisitos de fortaleza. */
    new_password: passwordField,

    /** Confirmacion de la nueva contrasena — debe coincidir con new_password. */
    confirm_password: z
      .string()
      .min(1, "La confirmacion de contrasena es obligatoria"),

    /**
     * Token de recuperacion (UUID) recibido por query param.
     * Se incluye en el schema para permitir validacion del payload completo
     * antes del envio al backend (integracion Fase 4).
     */
    token: z
      .string()
      .uuid("El enlace de recuperacion es invalido o ha expirado"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Las contrasenas no coinciden",
    path: ["confirm_password"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
