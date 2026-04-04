// [TSK-F-13] — Tests unitarios de esquemas Zod de perfil de usuario
// Cubre: profileSchema, securitySchema, deleteAccountSchema

import { describe, it, expect } from "vitest";
import {
  profileSchema,
  securitySchema,
  deleteAccountSchema,
} from "../profile";

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
// profileSchema
// ---------------------------------------------------------------------------

describe("profileSchema", () => {
  const validData = {
    first_name: "Maria",
    last_name: "Lopez",
    birth_date: birthDateYearsAgo(30),
    gender: "F" as const,
    country: "US" as const,
  };

  it("happy path: datos validos retornan success true", () => {
    const result = profileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("first_name vacio retorna error", () => {
    const result = profileSchema.safeParse({ ...validData, first_name: "" });
    expect(result.success).toBe(false);
  });

  it("last_name vacio retorna error", () => {
    const result = profileSchema.safeParse({ ...validData, last_name: "" });
    expect(result.success).toBe(false);
  });

  it("birth_date vacio retorna error", () => {
    const result = profileSchema.safeParse({ ...validData, birth_date: "" });
    expect(result.success).toBe(false);
  });

  it("usuario menor de 18 anos en birth_date retorna error", () => {
    const result = profileSchema.safeParse({
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
    const result = profileSchema.safeParse({
      ...validData,
      birth_date: birthDateYearsAgo(18),
    });
    expect(result.success).toBe(true);
  });

  it("gender con valor invalido retorna error", () => {
    const result = profileSchema.safeParse({
      ...validData,
      // @ts-expect-error — testeando enum invalido intencionalmente
      gender: "X",
    });
    expect(result.success).toBe(false);
  });

  it("country con valor invalido retorna error", () => {
    const result = profileSchema.safeParse({
      ...validData,
      // @ts-expect-error — testeando enum invalido intencionalmente
      country: "AR",
    });
    expect(result.success).toBe(false);
  });

  it("first_name con mas de 50 caracteres retorna error", () => {
    const result = profileSchema.safeParse({
      ...validData,
      first_name: "A".repeat(51),
    });
    expect(result.success).toBe(false);
  });

  it("last_name con mas de 50 caracteres retorna error", () => {
    const result = profileSchema.safeParse({
      ...validData,
      last_name: "B".repeat(51),
    });
    expect(result.success).toBe(false);
  });

  it("first_name con caracteres numericos retorna error", () => {
    const result = profileSchema.safeParse({
      ...validData,
      first_name: "Juan123",
    });
    expect(result.success).toBe(false);
  });

  it("todos los valores de gender validos son aceptados", () => {
    const genders = ["M", "F", "O"] as const;
    for (const gender of genders) {
      const result = profileSchema.safeParse({ ...validData, gender });
      expect(result.success).toBe(true);
    }
  });

  it("todos los valores de country validos son aceptados", () => {
    const countries = ["CO", "US", "CA", "MX", "VE", "OT"] as const;
    for (const country of countries) {
      const result = profileSchema.safeParse({ ...validData, country });
      expect(result.success).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// securitySchema
// ---------------------------------------------------------------------------

describe("securitySchema", () => {
  const validData = {
    current_password: "ContrasenaActual1!",
    new_password: "NuevaContrasena2@",
    confirm_new_password: "NuevaContrasena2@",
  };

  it("happy path: datos validos retornan success true", () => {
    const result = securitySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("current_password vacio retorna error", () => {
    const result = securitySchema.safeParse({
      ...validData,
      current_password: "",
    });
    expect(result.success).toBe(false);
  });

  it("new_password vacio retorna error", () => {
    const result = securitySchema.safeParse({
      ...validData,
      new_password: "",
      confirm_new_password: "",
    });
    expect(result.success).toBe(false);
  });

  it("confirm_new_password vacio retorna error", () => {
    const result = securitySchema.safeParse({
      ...validData,
      confirm_new_password: "",
    });
    expect(result.success).toBe(false);
  });

  it("contrasenas new_password y confirm_new_password que no coinciden retornan error", () => {
    const result = securitySchema.safeParse({
      ...validData,
      confirm_new_password: "ContrasenaDistinta9#",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorPaths = result.error.issues.map((i) => i.path.join("."));
      expect(errorPaths).toContain("confirm_new_password");
    }
  });

  it("new_password igual a current_password retorna error", () => {
    const result = securitySchema.safeParse({
      current_password: "MismaContrasena1!",
      new_password: "MismaContrasena1!",
      confirm_new_password: "MismaContrasena1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorPaths = result.error.issues.map((i) => i.path.join("."));
      expect(errorPaths).toContain("new_password");
    }
  });

  it("new_password sin mayuscula retorna error", () => {
    const result = securitySchema.safeParse({
      ...validData,
      new_password: "nuevacontrasena2@",
      confirm_new_password: "nuevacontrasena2@",
    });
    expect(result.success).toBe(false);
  });

  it("new_password sin numero retorna error", () => {
    const result = securitySchema.safeParse({
      ...validData,
      new_password: "NuevaContrasena@",
      confirm_new_password: "NuevaContrasena@",
    });
    expect(result.success).toBe(false);
  });

  it("new_password sin caracter especial retorna error", () => {
    const result = securitySchema.safeParse({
      ...validData,
      new_password: "NuevaContrasena2",
      confirm_new_password: "NuevaContrasena2",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// deleteAccountSchema
// ---------------------------------------------------------------------------

describe("deleteAccountSchema", () => {
  const KEYWORD = "ELIMINAR MI CUENTA";

  it("happy path: keyword correcta y password retornan success true", () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: KEYWORD,
      password: "MiContrasena1!",
    });
    expect(result.success).toBe(true);
  });

  it("keyword incorrecta retorna error", () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: "eliminar mi cuenta",
      password: "MiContrasena1!",
    });
    expect(result.success).toBe(false);
  });

  it("keyword vacia retorna error", () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: "",
      password: "MiContrasena1!",
    });
    expect(result.success).toBe(false);
  });

  it("keyword parcialmente correcta retorna error", () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: "ELIMINAR MI",
      password: "MiContrasena1!",
    });
    expect(result.success).toBe(false);
  });

  it("keyword con espacio extra al final retorna error", () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: KEYWORD + " ",
      password: "MiContrasena1!",
    });
    expect(result.success).toBe(false);
  });

  it("keyword en minusculas retorna error", () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: KEYWORD.toLowerCase(),
      password: "MiContrasena1!",
    });
    expect(result.success).toBe(false);
  });

  it("password vacio retorna error", () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: KEYWORD,
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("ambos campos vacios retornan error", () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: "",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
