// [REQ-F-01] - Vista de Seguridad: cambio de contraseña del usuario autenticado (FR-1.1.3 B)
// [TSK-F-10.1] - Maquetación de vista /profile/security con AppLayout + GlassCard — SPEC v1.3.0
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { PasswordStrengthChecklist } from "@/components/ui/PasswordStrengthChecklist";

// --- Tipos locales ---

interface SecurityFormState {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// --- Clases reutilizables del Design System (sin hardcoding de colores) ---

const INPUT_CLASSES = [
  "bg-[var(--input)] border border-[var(--border)]",
  "rounded-[var(--radius-md)] px-3 py-2 w-full",
  "text-[var(--foreground)]",
  "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
  "placeholder:text-[var(--foreground)] placeholder:opacity-40",
  "transition-[border-color,box-shadow] duration-200",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const LABEL_CLASSES =
  "text-label-sm text-[var(--foreground)] opacity-70 mb-1 block";

// --- Helpers de validación ---

/**
 * Verifica que la nueva contraseña cumpla todos los requisitos de seguridad.
 * SPEC v1.3.0 — reglas: 8 chars, mayúscula, número, carácter especial.
 */
function isPasswordStrong(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
}

// --- Componente principal ---

export default function SecurityPage() {
  const [form, setForm] = useState<SecurityFormState>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  /**
   * handleChange — actualiza el estado del formulario.
   * Valida la coincidencia de contraseñas en tiempo real.
   * Limpia los mensajes de éxito/error global al modificar cualquier campo.
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    setError(null);

    // Validación en tiempo real — confirmación de contraseña
    if (name === "confirm_password") {
      if (value && value !== form.new_password) {
        setConfirmPasswordError("Las contraseñas no coinciden");
      } else {
        setConfirmPasswordError(null);
      }
    }

    // Re-validar confirm_password si new_password cambia
    if (name === "new_password" && form.confirm_password) {
      if (form.confirm_password !== value) {
        setConfirmPasswordError("Las contraseñas no coinciden");
      } else {
        setConfirmPasswordError(null);
      }
    }
  }

  /**
   * handleSubmit — valida los campos y simula el envío al backend.
   * Integración real con PATCH /users/me en Fase 4.
   * SPEC v1.3.0 §6 — Loading States.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validación: campo actual no vacío
    if (!form.current_password) {
      setError("Debes ingresar tu contraseña actual.");
      return;
    }

    // Validación: nueva contraseña cumple requisitos de seguridad
    if (!isPasswordStrong(form.new_password)) {
      setError(
        "La nueva contraseña no cumple los requisitos mínimos de seguridad."
      );
      return;
    }

    // Validación: coincidencia de contraseñas
    if (form.new_password !== form.confirm_password) {
      setError("Las contraseñas no coinciden.");
      setConfirmPasswordError("Las contraseñas no coinciden");
      return;
    }

    // Validación: nueva contraseña distinta a la actual
    if (form.current_password === form.new_password) {
      setError("La nueva contraseña debe ser diferente a la contraseña actual.");
      return;
    }

    setSubmitting(true);

    // Simulación de llamada al backend (1.2s mock — integración real en Fase 4)
    await new Promise<void>((resolve) => setTimeout(resolve, 1200));

    setSubmitting(false);
    setSuccess(true);

    // Limpiar formulario tras éxito
    setForm({ current_password: "", new_password: "", confirm_password: "" });
    setConfirmPasswordError(null);
  }

  return (
    <AppLayout>
      {/*
       * Contenedor de página: centrado con ancho máximo para legibilidad óptima.
       * El área de contenido del AppLayout ya provee el padding lateral.
       */}
      <div className="max-w-2xl mx-auto">
        {/* ===== ENCABEZADO DE SECCIÓN ===== */}
        <header className="mb-6">
          <h1
            className={[
              "font-display font-bold text-2xl tracking-tight",
              "text-[var(--foreground)]",
            ].join(" ")}
          >
            Seguridad
          </h1>
          <p className="mt-1 text-body-md text-[var(--foreground)] opacity-60">
            Actualiza tu contraseña para mantener tu cuenta protegida.
          </p>
        </header>

        {/* ===== FORMULARIO EN GLASSCARD ===== */}
        {/*
         * GlassCard: contenedor con glassmorphism premium (SPEC v1.3.0 §3.3).
         * shadow="ambient" — profundidad sutil, apropiada para vistas de perfil.
         */}
        <GlassCard shadow="ambient" padding="lg">
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulario de cambio de contraseña"
          >
            {/* ===== CAMPO: Contraseña actual ===== */}
            {/*
             * Campo requerido para verificar identidad antes del cambio.
             * No expone nunca la contraseña actual al DOM tras el submit (mock).
             */}
            <div className="mb-5">
              <label htmlFor="current_password" className={LABEL_CLASSES}>
                Contraseña actual
              </label>
              <input
                id="current_password"
                name="current_password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={form.current_password}
                onChange={handleChange}
                disabled={submitting}
                className={INPUT_CLASSES}
              />
            </div>

            {/* ===== CAMPO: Nueva contraseña ===== */}
            {/*
             * PasswordStrengthChecklist: visible desde el primer carácter ingresado.
             * Patrón idéntico al usado en /auth/register y /auth/reset-password.
             */}
            <div className="mb-5">
              <label htmlFor="new_password" className={LABEL_CLASSES}>
                Nueva contraseña
              </label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={form.new_password}
                onChange={handleChange}
                disabled={submitting}
                className={INPUT_CLASSES}
              />
              {/* Checklist visible desde el primer carácter ingresado */}
              {form.new_password.length > 0 && (
                <PasswordStrengthChecklist password={form.new_password} />
              )}
            </div>

            {/* ===== CAMPO: Confirmar nueva contraseña ===== */}
            {/*
             * Validación de coincidencia inline en tiempo real.
             * aria-describedby enlaza el campo con su error para lectores de pantalla.
             */}
            <div className="mb-6">
              <label htmlFor="confirm_password" className={LABEL_CLASSES}>
                Confirmar nueva contraseña
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={handleChange}
                disabled={submitting}
                aria-describedby={
                  confirmPasswordError ? "confirm-password-error" : undefined
                }
                className={INPUT_CLASSES}
              />
              {/* Error inline de coincidencia de contraseñas */}
              {confirmPasswordError && (
                <p
                  id="confirm-password-error"
                  role="alert"
                  aria-live="assertive"
                  className="mt-1 text-body-sm text-[var(--error)]"
                >
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* ===== MENSAJE DE ÉXITO INLINE ===== */}
            {/*
             * Visible solo tras un submit exitoso.
             * Color: var(--primary) — alineado con la paleta del Design System.
             * role="status" + aria-live="polite" para lectores de pantalla (A11y).
             */}
            {success && (
              <div
                role="status"
                aria-live="polite"
                className={[
                  "mb-4 px-3 py-2 rounded-[var(--radius-md)]",
                  "text-body-md text-[var(--primary)]",
                  "bg-[var(--primary)]/10 border border-[var(--primary)]/30",
                ].join(" ")}
              >
                Contraseña actualizada correctamente.
              </div>
            )}

            {/* ===== MENSAJE DE ERROR GLOBAL ===== */}
            {/*
             * Visible cuando hay error de validación o respuesta de error del servidor.
             * Color: var(--error) — rojo vibrante del Design System (SPEC §4.1).
             * role="alert" + aria-live="assertive" para lectores de pantalla (A11y).
             */}
            {error && (
              <div
                id="security-error"
                role="alert"
                aria-live="assertive"
                className={[
                  "mb-4 px-3 py-2 rounded-[var(--radius-md)]",
                  "text-body-md text-[var(--error)]",
                  "bg-[var(--error)]/10 border border-[var(--error)]/30",
                ].join(" ")}
              >
                {error}
              </div>
            )}

            {/* ===== BOTÓN DE SUBMIT ===== */}
            {/*
             * Estado submitting: opacity-60 + cursor-wait — SPEC v1.3.0 §6 Loading States.
             * Spinner SVG inline — sin dependencias externas.
             */}
            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className={[
                "w-full bg-primary-gradient text-white font-semibold",
                "rounded-[var(--radius-md)] px-4 py-2.5",
                "transition-opacity duration-200",
                "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2",
                "focus:ring-offset-[var(--background)]",
                submitting
                  ? "opacity-60 cursor-wait"
                  : "hover:opacity-90 cursor-pointer",
              ].join(" ")}
            >
              {submitting ? (
                // Estado de carga: spinner inline + texto alternativo (A11y)
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Actualizando contraseña...
                </span>
              ) : (
                "Actualizar contraseña"
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
