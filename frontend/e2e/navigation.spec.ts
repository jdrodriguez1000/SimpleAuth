// [REQ-F-01] Pruebas de navegacion E2E — 11 rutas base del prototipo SimpleAuth (Fase 1)
// [TSK-F-16] Implementar Tests Playwright de Navegacion
// Alcance: prototipo estatico, sin backend real, datos mock en paginas de perfil.

import { test, expect, Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function visitAndExpectStatus(
  page: Page,
  url: string,
  heading: string
): Promise<void> {
  const response = await page.goto(url, { waitUntil: "networkidle" });
  expect(
    response?.status(),
    `La ruta ${url} retorno un status inesperado`
  ).not.toBe(404);
  expect(
    response?.status(),
    `La ruta ${url} retorno un error de servidor`
  ).not.toBe(500);
  await expect(
    page.getByRole("heading", { name: heading }),
    `Encabezado "${heading}" no encontrado en ${url}`
  ).toBeVisible();
}

// ---------------------------------------------------------------------------
// Suite: Rutas de autenticacion
// ---------------------------------------------------------------------------

test.describe("Rutas de autenticacion — navegacion base", () => {
  test("visita /auth/login y renderiza el formulario de inicio de sesion", async ({
    page,
  }) => {
    await visitAndExpectStatus(page, "/auth/login", "Inicia sesión");
    await expect(
      page.getByRole("form", { name: "Formulario de inicio de sesión" })
    ).toBeVisible();
  });

  test("visita /auth/register y renderiza el formulario de registro", async ({
    page,
  }) => {
    await visitAndExpectStatus(page, "/auth/register", "Crea tu cuenta");
    await expect(
      page.getByRole("form", { name: "Formulario de registro" })
    ).toBeVisible();
  });

  test("visita /auth/verify-sent y muestra la confirmacion de correo enviado", async ({
    page,
  }) => {
    await visitAndExpectStatus(page, "/auth/verify-sent", "Verifica tu cuenta");
  });

  test("visita /auth/recovery y renderiza el formulario de recuperacion", async ({
    page,
  }) => {
    await visitAndExpectStatus(
      page,
      "/auth/recovery",
      "Recupera tu contraseña"
    );
    await expect(page.getByLabel("Correo electrónico")).toBeVisible();
  });

  test("visita /auth/reset-password y renderiza el formulario de nueva contrasena", async ({
    page,
  }) => {
    await visitAndExpectStatus(page, "/auth/reset-password", "Nueva contraseña");
  });

  test("visita /auth/verify-result?status=success y muestra verificacion exitosa", async ({
    page,
  }) => {
    await visitAndExpectStatus(
      page,
      "/auth/verify-result?status=success",
      "Verificación exitosa"
    );
    await expect(
      page.getByRole("heading", { name: "¡Cuenta verificada!" })
    ).toBeVisible();
  });

  test("visita /auth/verify-result?status=error&reason=expired y muestra error de enlace expirado", async ({
    page,
  }) => {
    await visitAndExpectStatus(
      page,
      "/auth/verify-result?status=error&reason=expired",
      "Error de verificación"
    );
    await expect(
      page.getByRole("heading", { name: "Enlace expirado" })
    ).toBeVisible();
  });

  test("visita /auth/blocked y muestra la pantalla de acceso bloqueado", async ({
    page,
  }) => {
    await visitAndExpectStatus(
      page,
      "/auth/blocked",
      "Acceso bloqueado temporalmente"
    );
    await expect(
      page.getByText("15 minutos", { exact: true })
    ).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Suite: Rutas de perfil
// ---------------------------------------------------------------------------

test.describe("Rutas de perfil — navegacion base", () => {
  test("visita /profile y muestra el editor de perfil con datos mock", async ({
    page,
  }) => {
    const response = await page.goto("/profile", { waitUntil: "networkidle" });
    expect(
      response?.status(),
      "La ruta /profile retorno un status inesperado"
    ).not.toBe(404);
    expect(
      response?.status(),
      "La ruta /profile retorno un error de servidor"
    ).not.toBe(500);
    await expect(
      page.getByRole("heading", { name: "Mi Perfil" })
    ).toBeVisible();
  });

  test("visita /profile/security y muestra el formulario de seguridad", async ({
    page,
  }) => {
    const response = await page.goto("/profile/security", {
      waitUntil: "networkidle",
    });
    expect(
      response?.status(),
      "La ruta /profile/security retorno un status inesperado"
    ).not.toBe(404);
    expect(
      response?.status(),
      "La ruta /profile/security retorno un error de servidor"
    ).not.toBe(500);
    await expect(
      page.getByRole("heading", { name: "Seguridad" })
    ).toBeVisible();
  });

  test("visita /profile/delete y muestra el flujo de eliminacion de cuenta", async ({
    page,
  }) => {
    const response = await page.goto("/profile/delete", {
      waitUntil: "networkidle",
    });
    expect(
      response?.status(),
      "La ruta /profile/delete retorno un status inesperado"
    ).not.toBe(404);
    expect(
      response?.status(),
      "La ruta /profile/delete retorno un error de servidor"
    ).not.toBe(500);
    await expect(
      page.getByRole("heading", { name: "Eliminar cuenta" })
    ).toBeVisible();
    await expect(
      page.getByText("30 días", { exact: true })
    ).toBeVisible();
  });
});
