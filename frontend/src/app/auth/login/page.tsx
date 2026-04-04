// [REQ-F-02] - Vista de Login: autenticación mediante credenciales con feedback visual claro (US-1.1.2)
// [TSK-F-05.1] - Maquetación de vista /auth/login con estados de carga y error (SPEC v1.3.0 §3, PRD FR-1.1.2)
// [TSK-F-08.2] - Integración de ToastNotification para notificaciones post-logout por ?toast=
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ToastNotification } from "@/components/ui/Toast";

// --- Tipos locales ---

interface LoginFormState {
  email: string;
  password: string;
}

// --- Componente ---

export default function LoginPage() {
  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * handleSubmit — simula el flujo de autenticación (mockup funcional).
   * No conecta a la API real; integración en Fase 4.
   * SPEC v1.3.0 §6 — Loading States: opacidad reducida + cursor wait.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Simulación de llamada al backend (1.5s)
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    // Mock: siempre completa sin error en el mockup base
    setSubmitting(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    // AuthLayout: title y subtitle sobre el GlassCard (SPEC v1.3.0 §3.2)
    <AuthLayout title="Inicia sesión" subtitle="Bienvenido de vuelta">
      {/* Toast: lee ?toast= de la URL y muestra notificación flotante (TSK-F-08.2) */}
      <Suspense fallback={null}>
        <ToastNotification />
      </Suspense>

      {/*
       * GlassCard: contenedor del formulario — glassmorphism premium (SPEC v1.3.0 §3.3).
       * shadow="elevated" para mayor profundidad visual en la vista de login.
       */}
      <GlassCard shadow="elevated" padding="lg">
        <form onSubmit={handleSubmit} noValidate aria-label="Formulario de inicio de sesión">

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
              aria-describedby={error ? "login-error" : undefined}
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

          {/* ===== CAMPO: Contraseña ===== */}
          <div className="mb-2">
            <label
              htmlFor="password"
              className="text-label-sm text-[var(--foreground)] opacity-70 mb-1 block"
            >
              Contraseña
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

          {/* ===== ENLACE: Olvidé mi contraseña (PR FR-1.1.2) ===== */}
          {/*
           * Alineado a la derecha, entre el campo password y el botón de submit.
           * Color primario con hover suave para no competir visualmente con el CTA.
           */}
          <div className="flex justify-end mb-6">
            <Link
              href="/auth/recovery"
              className={[
                "text-body-md text-[var(--primary)]",
                "hover:opacity-80 transition-opacity duration-200",
                "focus:outline-none focus-visible:underline",
              ].join(" ")}
              tabIndex={submitting ? -1 : 0}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* ===== MENSAJE DE ERROR (estado visual) ===== */}
          {/*
           * Visible solo cuando hay error en estado local.
           * Color: var(--error) — rojo vibrante según Design System (SPEC §4.1).
           * role="alert" para lectores de pantalla (A11y).
           */}
          {error && (
            <div
              id="login-error"
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
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>

          {/* ===== PIE DEL CARD: enlace al registro ===== */}
          {/*
           * Separador visual con borde tonal (No-Line Rule — UI Kit §2.1).
           * Texto neutro con link primario para redirigir al registro.
           */}
          <div className="mt-6 pt-5 border-t border-[var(--border)] text-center">
            <p className="text-body-md text-[var(--foreground)] opacity-70">
              ¿No tienes cuenta?{" "}
              <Link
                href="/auth/register"
                className={[
                  "text-[var(--primary)] font-medium",
                  "hover:opacity-80 transition-opacity duration-200",
                  "focus:outline-none focus-visible:underline",
                ].join(" ")}
                tabIndex={submitting ? -1 : 0}
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </GlassCard>
    </AuthLayout>
  );
}
