// [TSK-F-13] — Tests unitarios de esquemas Zod de autenticacion
// Cubre: loginSchema, registerSchema, recoverySchema, resetPasswordSchema

import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  recoverySchema,
  resetPasswordSchema,
} from "../auth";

// ---------------------------------------------------------------------------
// Helpers de fecha
// ---------------------------------------------------------------------------

/** Genera una fecha de nacimiento exactamente N anos atras desde hoy (formato YYYY-MM-DD). */
function birthDateYearsAgo(years: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------

describe("loginSchema", () => {
  it("happy path: datos validos retornan success true", () => {
    const result = loginSchema.safeParse({
      email: "usuario@ejemplo.com",
      password: "Contrasena1!",
    });
    expect(result.success).toBe(true);
  });

  it("email vacio retorna error", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "Contrasena1!",
    });
    expect(result.success).toBe(false);
  });

  it("password vacio retorna error", () => {
    const result = loginSchema.safeParse({
      email: "usuario@ejemplo.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("email malformado retorna error", () => {
    const result = loginSchema.safeParse({
      email: "no-es-un-email",
      password: "Contrasena1!",
    });
    expect(result.success).toBe(false);
  });

  it("email sin dominio retorna error", () => {
    const result = loginSchema.safeParse({
      email: "usuario@",
      password: "Contrasena1!",
    });
    expect(result.success).toBe(false);
  });

  it("password menor a 8 caracteres retorna error", () => {
    const result = loginSchema.safeParse({
      email: "usuario@ejemplo.com",
      password: "Abc1!",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// registerSchema
// ---------------------------------------------------------------------------

describe("registerSchema", () => {
  const validData = {
    first_name: "Juan",
    last_name: "Rodriguez",
    email: "juan@ejemplo.com",
    birth_date: birthDateYearsAgo(25),
    gender: "M" as const,
    country: "CO" as const,
    password: "Contrasena1!",
    confirm_password: "Contrasena1!",
    terms: true as const,
  };

  it("happy path: datos validos retornan success true", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("first_name vacio retorna error", () => {
    const result = registerSchema.safeParse({ ...validData, first_name: "" });
    expect(result.success).toBe(false);
  });

  it("last_name vacio retorna error", () => {
    const result = registerSchema.safeParse({ ...validData, last_name: "" });
    expect(result.success).toBe(false);
  });

  it("email vacio retorna error", () => {
    const result = registerSchema.safeParse({ ...validData, email: "" });
    expect(result.success).toBe(false);
  });

  it("birth_date vacio retorna error", () => {
    const result = registerSchema.safeParse({ ...validData, birth_date: "" });
    expect(result.success).toBe(false);
  });

  it("usuario menor de 18 anos en birth_date retorna error", () => {
    const result = registerSchema.safeParse({
      ...validData,
      birth_date: birthDateYearsAgo(17),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorPaths = result.error.issues.map((i) => i.path.join("."));
      expect(errorPaths).toContain("birth_date");
    }
  });

  it("usuario exactamente de 18 anos es valido", () => {
    const result = registerSchema.safeParse({
      ...validData,
      birth_date: birthDateYearsAgo(18),
    });
    expect(result.success).toBe(true);
  });

  it("contrasenas que no coinciden retornan error en confirm_password", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirm_password: "OtraContrasena9@",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorPaths = result.error.issues.map((i) => i.path.join("."));
      expect(errorPaths).toContain("confirm_password");
    }
  });

  it("terms false retorna error", () => {
    const result = registerSchema.safeParse({
      ...validData,
      // @ts-expect-error — testeando valor invalido intencionalmente
      terms: false,
    });
    expect(result.success).toBe(false);
  });

  it("gender con valor invalido retorna error", () => {
    const result = registerSchema.safeParse({
      ...validData,
      // @ts-expect-error — testeando enum invalido intencionalmente
      gender: "X",
    });
    expect(result.success).toBe(false);
  });

  it("country con valor invalido retorna error", () => {
    const result = registerSchema.safeParse({
      ...validData,
      // @ts-expect-error — testeando enum invalido intencionalmente
      country: "ZZ",
    });
    expect(result.success).toBe(false);
  });

  it("password sin mayuscula retorna error", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "contrasena1!",
      confirm_password: "contrasena1!",
    });
    expect(result.success).toBe(false);
  });

  it("password sin numero retorna error", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "Contrasena!",
      confirm_password: "Contrasena!",
    });
    expect(result.success).toBe(false);
  });

  it("password sin caracter especial retorna error", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "Contrasena1",
      confirm_password: "Contrasena1",
    });
    expect(result.success).toBe(false);
  });

  it("todos los valores de gender validos son aceptados", () => {
    const genders = ["M", "F", "O"] as const;
    for (const gender of genders) {
      const result = registerSchema.safeParse({ ...validData, gender });
      expect(result.success).toBe(true);
    }
  });

  it("todos los valores de country validos son aceptados", () => {
    const countries = ["CO", "US", "CA", "MX", "VE", "OT"] as const;
    for (const country of countries) {
      const result = registerSchema.safeParse({ ...validData, country });
      expect(result.success).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// recoverySchema
// ---------------------------------------------------------------------------

describe("recoverySchema", () => {
  it("happy path: email valido retorna success true", () => {
    const result = recoverySchema.safeParse({
      email: "usuario@ejemplo.com",
    });
    expect(result.success).toBe(true);
  });

  it("email vacio retorna error", () => {
    const result = recoverySchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });

  it("email malformado retorna error", () => {
    const result = recoverySchema.safeParse({ email: "no-es-correo" });
    expect(result.success).toBe(false);
  });

  it("email con dominio valido pero sin TLD retorna error", () => {
    const result = recoverySchema.safeParse({ email: "usuario@dominio" });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// resetPasswordSchema
// ---------------------------------------------------------------------------

describe("resetPasswordSchema", () => {
  const validToken = "550e8400-e29b-41d4-a716-446655440000";

  it("happy path: datos validos retornan success true", () => {
    const result = resetPasswordSchema.safeParse({
      new_password: "NuevaContrasena1!",
      confirm_password: "NuevaContrasena1!",
      token: validToken,
    });
    expect(result.success).toBe(true);
  });

  it("new_password vacio retorna error", () => {
    const result = resetPasswordSchema.safeParse({
      new_password: "",
      confirm_password: "NuevaContrasena1!",
      token: validToken,
    });
    expect(result.success).toBe(false);
  });

  it("confirm_password vacio retorna error", () => {
    const result = resetPasswordSchema.safeParse({
      new_password: "NuevaContrasena1!",
      confirm_password: "",
      token: validToken,
    });
    expect(result.success).toBe(false);
  });

  it("contrasenas que no coinciden retornan error en confirm_password", () => {
    const result = resetPasswordSchema.safeParse({
      new_password: "NuevaContrasena1!",
      confirm_password: "OtraContrasena9@",
      token: validToken,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorPaths = result.error.issues.map((i) => i.path.join("."));
      expect(errorPaths).toContain("confirm_password");
    }
  });

  it("password sin mayuscula retorna error", () => {
    const result = resetPasswordSchema.safeParse({
      new_password: "nuevacontrasena1!",
      confirm_password: "nuevacontrasena1!",
      token: validToken,
    });
    expect(result.success).toBe(false);
  });

  it("password sin numero retorna error", () => {
    const result = resetPasswordSchema.safeParse({
      new_password: "NuevaContrasena!",
      confirm_password: "NuevaContrasena!",
      token: validToken,
    });
    expect(result.success).toBe(false);
  });

  it("password sin caracter especial retorna error", () => {
    const result = resetPasswordSchema.safeParse({
      new_password: "NuevaContrasena1",
      confirm_password: "NuevaContrasena1",
      token: validToken,
    });
    expect(result.success).toBe(false);
  });

  it("token vacio retorna error", () => {
    const result = resetPasswordSchema.safeParse({
      new_password: "NuevaContrasena1!",
      confirm_password: "NuevaContrasena1!",
      token: "",
    });
    expect(result.success).toBe(false);
  });

  it("token no UUID retorna error", () => {
    const result = resetPasswordSchema.safeParse({
      new_password: "NuevaContrasena1!",
      confirm_password: "NuevaContrasena1!",
      token: "token-invalido-no-uuid",
    });
    expect(result.success).toBe(false);
  });
});
