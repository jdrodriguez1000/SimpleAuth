// [REQ-F-04] - Vista de Recuperación de Contraseña: captura de email con feedback de envío (US-1.1.4)
// [TSK-F-06.1] - Maquetación de vista /auth/recovery (Request) con estado inicial + estado éxito inline
"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { GlassCard } from "@/components/ui/GlassCard";

// --- Tipos locales ---

interface RecoveryFormState {
  email: string;
}

// --- Componente ---

export default function RecoveryPage() {
  const [form, setForm] = useState<RecoveryFormState>({ email: "" });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<boolean>(false);

  /**
   * handleSubmit — simula el flujo de solicitud de recuperación (mockup funcional).
   * No conecta a la API real; integración en Fase 4.
   * SPEC v1.3.0 §6 — Loading States: opacidad reducida + cursor wait.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Simulación de llamada al backend (1.5s)
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    setSubmitting(false);
    setSent(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    // AuthLayout: title y subtitle sobre el GlassCard (SPEC v1.3.0 §3.2)
    <AuthLayout
      title="Recupera tu contraseña"
      subtitle="Te enviaremos un enlace a tu correo"
    >
      {/*
       * GlassCard: contenedor unificado para estado inicial y estado éxito.
       * shadow="elevated" para mayor profundidad visual — consistente con login/register.
       */}
      <GlassCard shadow="elevated" padding="lg">

        {/* ===== ESTADO ÉXITO: confirmación inline ===== */}
        {sent ? (
          /*
           * Estado éxito: reemplaza el formulario dentro del mismo GlassCard.
           * Evita salto de layout — el GlassCard mantiene su tamaño visual.
           */
          <div className="flex flex-col items-center text-center gap-4">

            {/* Ícono SVG de sobre enviado — color var(--primary), w-14 h-14 */}
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
                {/* Cuerpo del sobre */}
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  stroke="var(--primary)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Checkmark sobre el sobre */}
                <circle
                  cx="17"
                  cy="17"
                  r="5"
                  fill="var(--primary)"
                  className="opacity-20"
                />
                <path
                  d="M15 17l1.5 1.5L19 15"
                  stroke="var(--primary)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Título de confirmación */}
            <h2 className="text-headline-md text-[var(--foreground)]">
              ¡Enlace enviado!
            </h2>

            {/* Mensaje principal */}
            <p className="text-body-md text-[var(--foreground)] opacity-70">
              Si el correo existe en nuestro sistema, recibirás un enlace en los
              próximos minutos.
            </p>

            {/*
             * Nota de spam: bloque compacto con fondo primario tonal.
             * Texto en negrita para Spam/Promociones — jerarquía visual clara.
             */}
            <div
              className={[
                "w-full bg-[var(--primary)]/10 border border-[var(--primary)]/30",
                "rounded-[var(--radius-md)] p-3",
                "text-body-md text-[var(--foreground)] text-center",
              ].join(" ")}
            >
              Revisa también tu carpeta de{" "}
              <strong className="font-semibold">Spam</strong> o{" "}
              <strong className="font-semibold">Promociones</strong>.
            </div>

            {/* Botón "Volver al login" con estilo gradiente completo */}
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
              Volver al login
            </Link>
          </div>

        ) : (
          /* ===== ESTADO INICIAL: formulario de captura de email ===== */
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulario de recuperación de contraseña"
          >

            {/* ===== CAMPO: Correo electrónico ===== */}
            <div className="mb-5">
              {/*
               * Label: text-label-sm — escala tipográfica del UI Kit §3.
               * opacity-70 para jerarquía visual sutil respecto al input.
               */}
              <label
                htmlFor="email"
                className="text-label-sm text-[var(--foreground)] opacity-70 mb-1 block"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                disabled={submitting}
                aria-describedby={error ? "recovery-error" : undefined}
                className={[
                  "bg-[var(--input)] border border-[var(--border)]",
                  "rounded-[var(--radius-md)] px-3 py-2 w-full",
                  "text-[var(--foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
                  "placeholder:text-[var(--foreground)] placeholder:opacity-40",
                  "transition-[border-color,box-shadow] duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                ].join(" ")}
              />
            </div>

            {/* ===== MENSAJE DE ERROR (estado visual) ===== */}
            {/*
             * Visible solo cuando hay error en estado local.
             * Color: var(--error) — rojo vibrante según Design System (SPEC §4.1).
             * role="alert" + aria-live="assertive" para lectores de pantalla (A11y).
             */}
            {error && (
              <div
                id="recovery-error"
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
             * Estilo: bg-primary-gradient con texto blanco — CTA principal del Design System.
             * Estado submitting: opacity-60 + cursor-wait + texto alternativo + spinner.
             * SPEC v1.3.0 §6 — Loading States.
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
                // Estado de carga: spinner + texto alternativo
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
                  Enviando...
                </span>
              ) : (
                "Enviar enlace"
              )}
            </button>

            {/* ===== PIE DEL CARD: enlace de vuelta al login ===== */}
            {/*
             * Separador visual con borde tonal (No-Line Rule — UI Kit §2.1).
             * Texto neutro con link primario para redirigir al login.
             */}
            <div className="mt-6 pt-5 border-t border-[var(--border)] text-center">
              <p className="text-body-md text-[var(--foreground)] opacity-70">
                ¿Recordaste tu contraseña?{" "}
                <Link
                  href="/auth/login"
                  className={[
                    "text-[var(--primary)] font-medium",
                    "hover:opacity-80 transition-opacity duration-200",
                    "focus:outline-none focus-visible:underline",
                  ].join(" ")}
                  tabIndex={submitting ? -1 : 0}
                >
                  Volver al login
                </Link>
              </p>
            </div>
          </form>
        )}

      </GlassCard>
    </AuthLayout>
  );
}
