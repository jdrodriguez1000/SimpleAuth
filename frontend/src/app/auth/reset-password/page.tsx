// [REQ-F-04] - Vista de Restablecimiento de Contraseña (FR-1.1.4 Vista B — US-1.1.4)
// [TSK-F-06.2] - Formulario de nueva contraseña con validación de igualdad y estado éxito inline
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { PasswordStrengthChecklist } from "@/components/ui/PasswordStrengthChecklist";

// --- Tipos locales ---

interface ResetFormState {
  new_password: string;
  confirm_password: string;
}

// --- Clases reutilizables (Design System — no hardcoding) ---

const INPUT_CLASSES = [
  "bg-[var(--input)] border border-[var(--border)]",
  "rounded-[var(--radius-md)] px-3 py-2 w-full",
  "text-[var(--foreground)]",
  "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
  "placeholder:text-[var(--foreground)] placeholder:opacity-40",
  "transition-[border-color,box-shadow] duration-200",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const LABEL_CLASSES = "text-label-sm text-[var(--foreground)] opacity-70 mb-1 block";

// --- Componente interno (requiere useSearchParams — debe estar bajo <Suspense>) ---
// Next.js 15 App Router: useSearchParams() sólo puede usarse dentro de Suspense boundary.

function ResetPasswordForm() {
  // Lee el token desde la query string: /auth/reset-password?token=uuid
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [form, setForm] = useState<ResetFormState>({
    new_password: "",
    confirm_password: "",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [reset, setReset] = useState<boolean>(false);

  /**
   * handleChange — actualiza el estado del formulario y valida coincidencia
   * de contraseñas en tiempo real.
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

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
   * handleSubmit — valida coincidencia de contraseñas y presencia del token
   * antes de simular el restablecimiento (mock — integración real en Fase 4).
   * SPEC v1.3.0 §6 — Loading States.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validación: coincidencia de contraseñas
    if (form.new_password !== form.confirm_password) {
      setError("Las contraseñas no coinciden.");
      setConfirmPasswordError("Las contraseñas no coinciden");
      return;
    }

    // Validación: token presente (llegó desde un enlace válido)
    if (!token) {
      setError("Enlace de recuperación inválido o expirado.");
      return;
    }

    setSubmitting(true);
    // Simulación de llamada al backend (1.5s mock — integración real en Fase 4)
    await new Promise<void>((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setReset(true);
  }

  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle="Elige una contraseña segura"
    >
      {/*
       * GlassCard: contenedor unificado para estado formulario y estado éxito.
       * shadow="elevated" — consistente con el resto de vistas /auth.
       */}
      <GlassCard shadow="elevated" padding="lg">

        {/* ===== ESTADO ÉXITO: confirmación inline ===== */}
        {reset ? (
          /*
           * Estado reset=true: reemplaza el formulario dentro del mismo GlassCard.
           * Mantiene la altura visual del card para evitar saltos de layout.
           */
          <div className="flex flex-col items-center text-center gap-4">

            {/* Ícono SVG de candado con checkmark — color var(--primary) */}
            <div
              aria-hidden="true"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--primary)]/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="w-8 h-8"
                aria-hidden="true"
              >
                {/* Cuerpo del candado */}
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="var(--primary)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Arco del candado */}
                <path
                  d="M8 11V7a4 4 0 118 0v4"
                  stroke="var(--primary)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Checkmark dentro del candado */}
                <path
                  d="M9.5 16.5l1.5 1.5 3-3"
                  stroke="var(--primary)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Título de confirmación */}
            <h2 className="text-headline-md text-[var(--foreground)] text-center mt-4 mb-2">
              ¡Contraseña actualizada!
            </h2>

            {/* Descripción */}
            <p className="text-body-md text-[var(--foreground)] opacity-70 text-center mb-6">
              Tu contraseña ha sido restablecida correctamente. Ya puedes
              iniciar sesión con tus nuevas credenciales.
            </p>

            {/* CTA: ir al login — estilado como botón gradiente completo */}
            <Link
              href="/auth/login"
              className={[
                "w-full block text-center",
                "bg-primary-gradient text-white font-semibold",
                "rounded-[var(--radius-md)] px-4 py-2.5",
                "transition-opacity duration-200 hover:opacity-90",
                "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2",
                "focus:ring-offset-[var(--background)]",
              ].join(" ")}
            >
              Ir al login
            </Link>
          </div>

        ) : (
          /* ===== ESTADO FORMULARIO: campos de nueva contraseña ===== */
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulario de restablecimiento de contraseña"
          >

            {/* ===== CAMPO: Nueva contraseña ===== */}
            {/*
             * Password Strength Checklist: visible apenas el usuario empiece a escribir.
             * Patrón idéntico a /auth/register — consistencia de UX.
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

            {/* ===== CAMPO: Confirmar contraseña ===== */}
            <div className="mb-5">
              <label htmlFor="confirm_password" className={LABEL_CLASSES}>
                Confirmar contraseña
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

            {/* ===== MENSAJE DE ERROR GLOBAL ===== */}
            {/*
             * Visible cuando hay error de validación (token ausente o contraseñas distintas).
             * Color: var(--error) — rojo vibrante según Design System (SPEC §4.1).
             * role="alert" + aria-live="assertive" para lectores de pantalla (A11y).
             */}
            {error && (
              <div
                id="reset-error"
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
             * Texto "Restablecer contraseña" / loading "Restableciendo..." con spinner.
             * Estado submitting: opacity-60 + cursor-wait — SPEC v1.3.0 §6.
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
                // Estado de carga: spinner inline + texto alternativo
                <span className="flex items-center justify-center gap-2">
                  {/* Spinner SVG inline — sin dependencias externas (TSK-F-14 agrega Framer Motion) */}
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
                  Restableciendo...
                </span>
              ) : (
                "Restablecer contraseña"
              )}
            </button>

            {/* ===== NOTA DE SEGURIDAD ===== */}
            {/*
             * Texto tonal de contexto: informa al usuario sobre la expiración del enlace.
             * opacity-40 para jerarquía visual de tercer nivel — no distrae del CTA.
             */}
            <p className="text-body-md text-[var(--foreground)] opacity-40 text-center mt-3">
              Por seguridad, este enlace expira en 1 hora.
            </p>
          </form>
        )}

      </GlassCard>
    </AuthLayout>
  );
}

// --- Componente raíz exportado ---
// Suspense es obligatorio en Next.js 15 App Router cuando se usa useSearchParams()
// dentro de un Client Component. Sin este wrapper el build falla con error de
// "useSearchParams() should be wrapped in a suspense boundary".

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
