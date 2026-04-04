// [REQ-F-01] - Vista de Baja de Cuenta: confirmación de eliminación del usuario autenticado (FR-1.1.9)
// [TSK-F-10.2] - Maquetación de vista /profile/delete con AppLayout + GlassCard — SPEC v1.3.0
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";

// --- Constante del gatekeeper de seguridad ---
// SPEC v1.3.0 — la palabra clave exacta que el usuario debe escribir para habilitar el botón.
const CONFIRMATION_KEYWORD = "ELIMINAR MI CUENTA";

// --- Tipos locales ---

interface DeleteFormState {
  confirmation: string;
  password: string;
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

// --- Sub-componente: Icono SVG de advertencia (triángulo warning) ---
// SPEC v1.3.0 FR-1.1.9 — icono prominente con color var(--error).

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 shrink-0 text-[var(--error)]"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// --- Componente principal ---

export default function DeleteAccountPage() {
  const [form, setForm] = useState<DeleteFormState>({
    confirmation: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Gatekeeper: el botón solo se habilita cuando ambas condiciones se cumplen.
  // SPEC v1.3.0 — confirmation debe ser exactamente CONFIRMATION_KEYWORD.
  const isGatekeeperSatisfied =
    form.confirmation === CONFIRMATION_KEYWORD && form.password.length > 0;

  /**
   * handleChange — actualiza el estado del formulario.
   * Limpia los mensajes de error global al modificar cualquier campo.
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }

  /**
   * handleSubmit — valida el gatekeeper y simula el envío al backend.
   * Integración real con DELETE /users/me en Fase 4.
   * SPEC v1.3.0 §6 — Loading States.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validación final del gatekeeper antes de enviar
    if (form.confirmation !== CONFIRMATION_KEYWORD) {
      setError(`Debes escribir exactamente "${CONFIRMATION_KEYWORD}" para continuar.`);
      return;
    }

    if (!form.password) {
      setError("Debes ingresar tu contraseña actual para confirmar la eliminación.");
      return;
    }

    setSubmitting(true);

    // Simulación de llamada al backend (1.2s mock — integración real en Fase 4)
    await new Promise<void>((resolve) => setTimeout(resolve, 1200));

    setSubmitting(false);
    setSuccess(true);
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
              "text-[var(--error)]",
            ].join(" ")}
          >
            Eliminar cuenta
          </h1>
          <p className="mt-1 text-body-md text-[var(--foreground)] opacity-60">
            Esta acción es irreversible. Lee detenidamente antes de continuar.
          </p>
        </header>

        {/* ===== BLOQUE DE ADVERTENCIA GDPR 30 DÍAS ===== */}
        {/*
         * FR-1.1.9 — Aviso prominente de política de retención de datos.
         * Fondo: var(--error)/10, borde: var(--error)/30 — coherente con banners de error.
         * aria-label para lectores de pantalla.
         */}
        <div
          role="note"
          aria-label="Aviso importante de eliminación de cuenta"
          className={[
            "mb-6 flex gap-3 items-start",
            "px-4 py-4 rounded-[var(--radius-md)]",
            "bg-[var(--error)]/10 border border-[var(--error)]/30",
          ].join(" ")}
        >
          <WarningIcon />
          <div className="flex flex-col gap-1">
            <p className="text-body-md font-semibold text-[var(--error)]">
              Eliminación permanente de datos — 30 días
            </p>
            <p className="text-body-md text-[var(--foreground)] opacity-80">
              Al confirmar, tu cuenta pasará a estado <strong>inactivo</strong> de forma inmediata.
              Tus datos personales serán eliminados permanentemente después de{" "}
              <strong>30 días</strong>.
            </p>
            <p className="text-body-sm text-[var(--foreground)] opacity-60 mt-1">
              Durante ese período puedes reactivar tu cuenta en cualquier momento
              iniciando sesión con tus credenciales actuales.
            </p>
          </div>
        </div>

        {/* ===== FORMULARIO DE CONFIRMACIÓN EN GLASSCARD ===== */}
        {/*
         * GlassCard: contenedor con glassmorphism premium (SPEC v1.3.0 §3.3).
         * shadow="ambient" — profundidad sutil, apropiada para vistas de perfil.
         */}
        <GlassCard shadow="ambient" padding="lg">
          {/* Estado success: mensaje de confirmación sin redirección automática */}
          {success ? (
            /*
             * SPEC v1.3.0 — Estado de éxito post-borrado.
             * role="status" + aria-live="polite" para lectores de pantalla (A11y).
             * No se redirige automáticamente — el usuario controla la navegación.
             */
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center gap-4 py-4 text-center"
            >
              {/* Icono de confirmación: checkmark con color primario */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-14 w-14 text-[var(--primary)]"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex flex-col gap-2">
                <h2 className="text-headline-md text-[var(--foreground)]">
                  Cuenta desactivada
                </h2>
                <p className="text-body-md text-[var(--foreground)] opacity-70">
                  Tu cuenta ha sido desactivada. Recibirás un correo de confirmación
                  con los detalles del proceso de eliminación.
                </p>
                <p className="text-body-sm text-[var(--foreground)] opacity-50 mt-1">
                  Recuerda que tienes 30 días para reactivarla iniciando sesión.
                </p>
              </div>
            </div>
          ) : (
            /* ===== FORMULARIO DEL GATEKEEPER ===== */
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Formulario de confirmación de baja de cuenta"
            >
              {/* ===== CAMPO: Texto de confirmación (gatekeeper) ===== */}
              {/*
               * SPEC v1.3.0 — El usuario debe escribir exactamente "ELIMINAR MI CUENTA".
               * La instrucción explícita se muestra encima del campo como guía visual.
               */}
              <div className="mb-5">
                <label htmlFor="confirmation" className={LABEL_CLASSES}>
                  Confirmación de baja
                </label>
                <p className="text-body-sm text-[var(--foreground)] opacity-60 mb-2">
                  Para continuar, escribe exactamente:{" "}
                  <span className="font-semibold text-[var(--error)] select-none">
                    {CONFIRMATION_KEYWORD}
                  </span>
                </p>
                <input
                  id="confirmation"
                  name="confirmation"
                  type="text"
                  required
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={CONFIRMATION_KEYWORD}
                  value={form.confirmation}
                  onChange={handleChange}
                  disabled={submitting}
                  aria-describedby="confirmation-hint"
                  className={[
                    INPUT_CLASSES,
                    // Indicador visual: borde verde cuando el texto coincide
                    form.confirmation === CONFIRMATION_KEYWORD
                      ? "border-green-500 focus:ring-green-500/30"
                      : "",
                  ].join(" ")}
                />
                <p
                  id="confirmation-hint"
                  className="mt-1 text-body-sm text-[var(--foreground)] opacity-40"
                >
                  Distingue mayúsculas y minúsculas.
                </p>
              </div>

              {/* ===== CAMPO: Contraseña actual (gatekeeper) ===== */}
              {/*
               * Verificación de identidad antes de la eliminación.
               * SPEC v1.3.0 — deleteAccountSchema: campo password obligatorio.
               */}
              <div className="mb-6">
                <label htmlFor="password" className={LABEL_CLASSES}>
                  Contraseña actual
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  disabled={submitting}
                  className={INPUT_CLASSES}
                />
              </div>

              {/* ===== MENSAJE DE ERROR GLOBAL ===== */}
              {/*
               * Visible cuando hay error de validación o respuesta de error del servidor.
               * Color: var(--error) — rojo vibrante del Design System (SPEC §4.1).
               * role="alert" + aria-live="assertive" para lectores de pantalla (A11y).
               */}
              {error && (
                <div
                  id="delete-error"
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

              {/* ===== BOTÓN DE CONFIRMACIÓN FINAL ===== */}
              {/*
               * SPEC v1.3.0 — Botón destructivo con color var(--error).
               * Deshabilitado mientras el gatekeeper no esté satisfecho.
               * Estado submitting: opacity-60 + cursor-wait — Loading States §6.
               */}
              <button
                type="submit"
                disabled={!isGatekeeperSatisfied || submitting}
                aria-busy={submitting}
                aria-disabled={!isGatekeeperSatisfied}
                className={[
                  "w-full text-white font-semibold",
                  "rounded-[var(--radius-md)] px-4 py-2.5",
                  "transition-opacity duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--error)]/50 focus:ring-offset-2",
                  "focus:ring-offset-[var(--background)]",
                  // Fondo: var(--error) — rojo vibrante del Design System (sin hardcoding)
                  "bg-[var(--error)]",
                  // Estado: deshabilitado o submitting vs habilitado
                  !isGatekeeperSatisfied || submitting
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:opacity-90 cursor-pointer",
                  submitting ? "cursor-wait" : "",
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
                    Eliminando cuenta...
                  </span>
                ) : (
                  "Eliminar mi cuenta definitivamente"
                )}
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    </AppLayout>
  );
}
