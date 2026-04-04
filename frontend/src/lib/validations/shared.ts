// Helpers compartidos para los esquemas Zod de validacion
// [TSK-F-12.1] — Modulo de utilidades reutilizables entre auth.ts y profile.ts
// Extraido en TSK-F-R4.1 para eliminar duplicacion (O-1).

import { z } from "zod";

// ---------------------------------------------------------------------------
// Regex de fortaleza de contrasena
// Regla: minimo 8 caracteres, al menos 1 mayuscula, 1 numero, 1 caracter especial.
// Scope §6 "Password Policy" / SPEC v1.3.0 §5.
// ---------------------------------------------------------------------------

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

export const passwordField = z
  .string()
  .min(8, "La contrasena debe tener al menos 8 caracteres")
  .regex(
    PASSWORD_REGEX,
    "La contrasena debe contener al menos una mayuscula, un numero y un caracter especial (!@#$%^&*)"
  );

// ---------------------------------------------------------------------------
// Verificacion de edad minima (18 anos)
// SPEC v1.3.0 §5 — birth_date: date (min 18 years).
// ---------------------------------------------------------------------------

/**
 * Verifica que la fecha de nacimiento corresponde a alguien con 18+ anos
 * en el momento de la validacion.
 */
export function isAtLeast18(dateStr: string): boolean {
  if (!dateStr) return false;
  const birth = new Date(dateStr);
  if (isNaN(birth.getTime())) return false;
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  return birth <= eighteenYearsAgo;
}
