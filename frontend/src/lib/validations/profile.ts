// [REQ-F-01] - Esquemas Zod de perfil: edicion de datos, seguridad y baja de cuenta
// [TSK-F-12.1] - Definir schemas Zod para Profile en lib/validations/profile.ts (SPEC v1.3.0 §5)

import { z } from "zod";
import { passwordField as strongPasswordField, isAtLeast18 } from "./shared";

// ---------------------------------------------------------------------------
// profileSchema
// [REQ-F-01] — SPEC v1.3.0 §5 profileSchema
// El email es inmutable — excluido del schema (Scope §3.2 F6 + Architecture §DB).
// Enum values: M/F/O y CO/US/CA/MX/VE/OT (SPEC §2 CC-002, UI forms)
// ---------------------------------------------------------------------------

export const profileSchema = z.object({
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

  /** Fecha de nacimiento (YYYY-MM-DD). Debe cumplir edad minima de 18 anos. */
  birth_date: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine(isAtLeast18, {
      message: "Debes ser mayor de 18 anos para actualizar tu perfil",
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
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ---------------------------------------------------------------------------
// securitySchema
// [REQ-F-01] — SPEC v1.3.0 §5 passwordChangeSchema
// ---------------------------------------------------------------------------

export const securitySchema = z
  .object({
    /** Contrasena actual del usuario para verificar identidad. */
    current_password: z
      .string()
      .min(1, "Debes ingresar tu contrasena actual"),

    /** Nueva contrasena con requisitos de fortaleza completos. */
    new_password: strongPasswordField,

    /** Confirmacion de la nueva contrasena — debe coincidir con new_password. */
    confirm_new_password: z
      .string()
      .min(1, "La confirmacion de contrasena es obligatoria"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Las contrasenas no coinciden",
    path: ["confirm_new_password"],
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: "La nueva contrasena debe ser diferente a la contrasena actual",
    path: ["new_password"],
  });

export type SecurityFormData = z.infer<typeof securitySchema>;

// ---------------------------------------------------------------------------
// deleteAccountSchema
// [REQ-F-01] — SPEC v1.3.0 §5 deleteAccountSchema / FR-1.1.9
// ---------------------------------------------------------------------------

/** Palabra clave exacta que el usuario debe escribir para confirmar la baja. */
const CONFIRMATION_KEYWORD = "ELIMINAR MI CUENTA" as const;

export const deleteAccountSchema = z.object({
  /**
   * Texto de confirmacion — debe ser exactamente "ELIMINAR MI CUENTA".
   * SPEC v1.3.0 §5 — literal string gatekeeper.
   */
  confirmation: z.literal(CONFIRMATION_KEYWORD, {
    error: `Debes escribir exactamente "${CONFIRMATION_KEYWORD}" para continuar`,
  }),

  /** Contrasena actual del usuario para verificar identidad antes de la baja. */
  password: z
    .string()
    .min(
      1,
      "Debes ingresar tu contrasena actual para confirmar la eliminacion"
    ),
});

export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
