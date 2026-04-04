// [REQ-F-01] - Vista de Perfil: editor de datos personales del usuario autenticado (FR-1.1.3 A)
// [TSK-F-09] - Maquetación de vista /profile con AppLayout + GlassCard — SPEC v1.3.0 §3.2 + §3.3
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";

// --- Tipos locales ---

interface ProfileFormState {
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  country: string;
}

// --- Datos mock del usuario autenticado ---
// Simula el estado de sesión activa; integración real con contexto/auth en Fase 4.

const MOCK_USER = {
  first_name: "Juan",
  last_name: "Rodríguez",
  email: "juan.rodriguez@ejemplo.com",
  birth_date: "1995-08-14",
  gender: "M",
  country: "CO",
};

// --- Helpers de validación ---

/**
 * Verifica que el usuario tenga al menos 18 años según la fecha ingresada.
 * SPEC v1.3.0 §5 — PRD FR-1.1.3 (A).
 */
function isAtLeast18(birthDateStr: string): boolean {
  if (!birthDateStr) return false;
  const birth = new Date(birthDateStr);
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  return birth <= eighteenYearsAgo;
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

const INPUT_READONLY_CLASSES = [
  "bg-[var(--input)] border border-[var(--border)]",
  "rounded-[var(--radius-md)] px-3 py-2 w-full",
  "text-[var(--foreground)] opacity-50",
  "cursor-not-allowed select-none",
].join(" ");

const SELECT_CLASSES = [
  "bg-[var(--input)] border border-[var(--border)]",
  "rounded-[var(--radius-md)] px-3 py-2 w-full",
  "text-[var(--foreground)]",
  "appearance-none",
  "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
  "transition-[border-color,box-shadow] duration-200",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const LABEL_CLASSES =
  "text-label-sm text-[var(--foreground)] opacity-70 mb-1 block";

// --- Sub-componente: Chevron SVG para <select> ---
// Patrón idéntico al usado en /auth/register (SPEC v1.3.0 — consistencia visual).

function ChevronDown() {
  return (
    <svg
      className="h-4 w-4 text-[var(--foreground)] opacity-50"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// --- Componente principal ---

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileFormState>({
    first_name: MOCK_USER.first_name,
    last_name: MOCK_USER.last_name,
    birth_date: MOCK_USER.birth_date,
    gender: MOCK_USER.gender,
    country: MOCK_USER.country,
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  /**
   * handleChange — maneja inputs de texto, date y select.
   * Limpia los mensajes de éxito/error al modificar cualquier campo.
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    setError(null);

    // Validación en tiempo real — fecha de nacimiento (PRD FR-1.1.3 A)
    if (name === "birth_date" && value) {
      if (!isAtLeast18(value)) {
        setBirthDateError("Debes ser mayor de 18 años para actualizar tu perfil");
      } else {
        setBirthDateError(null);
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

    // Validación: edad mínima 18 años
    if (!isAtLeast18(form.birth_date)) {
      setError("Debes ser mayor de 18 años para actualizar tu perfil");
      setBirthDateError("Debes ser mayor de 18 años para actualizar tu perfil");
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
              "text-[var(--foreground)]",
            ].join(" ")}
          >
            Mi Perfil
          </h1>
          <p className="mt-1 text-body-md text-[var(--foreground)] opacity-60">
            Actualiza tu información personal. El correo electrónico no puede
            modificarse.
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
            aria-label="Formulario de edición de perfil"
          >
            {/* ===== FILA: Nombre y Apellido (grid 2 columnas) ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* Campo: Nombre */}
              <div>
                <label htmlFor="first_name" className={LABEL_CLASSES}>
                  Nombre
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  required
                  maxLength={50}
                  placeholder="Juan"
                  value={form.first_name}
                  onChange={handleChange}
                  disabled={submitting}
                  className={INPUT_CLASSES}
                />
              </div>

              {/* Campo: Apellido */}
              <div>
                <label htmlFor="last_name" className={LABEL_CLASSES}>
                  Apellido
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  required
                  maxLength={50}
                  placeholder="Rodríguez"
                  value={form.last_name}
                  onChange={handleChange}
                  disabled={submitting}
                  className={INPUT_CLASSES}
                />
              </div>
            </div>

            {/* ===== CAMPO: Correo electrónico (inmutable) ===== */}
            {/*
             * El email es el identificador único universal — no editable.
             * Architecture §DB — "email es el identificador único universal en todos los estados".
             * Se muestra como campo deshabilitado con etiqueta indicativa de inmutabilidad.
             */}
            <div className="mb-5">
              <label htmlFor="email" className={LABEL_CLASSES}>
                Correo electrónico{" "}
                <span
                  className="opacity-60 font-normal"
                  aria-label="campo no editable"
                >
                  — no editable
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                readOnly
                disabled
                value={MOCK_USER.email}
                aria-readonly="true"
                aria-disabled="true"
                className={INPUT_READONLY_CLASSES}
              />
            </div>

            {/* ===== CAMPO: Fecha de nacimiento ===== */}
            {/*
             * PRD FR-1.1.3 (A) — Validación de edad mínima: 18 años en el editor de perfil.
             */}
            <div className="mb-5">
              <label htmlFor="birth_date" className={LABEL_CLASSES}>
                Fecha de nacimiento{" "}
                <span className="opacity-60 font-normal">
                  — Debes tener al menos 18 años
                </span>
              </label>
              <input
                id="birth_date"
                name="birth_date"
                type="date"
                required
                value={form.birth_date}
                onChange={handleChange}
                disabled={submitting}
                aria-describedby={
                  birthDateError ? "birth-date-error" : undefined
                }
                className={INPUT_CLASSES}
              />
              {birthDateError && (
                <p
                  id="birth-date-error"
                  role="alert"
                  aria-live="assertive"
                  className="mt-1 text-body-sm text-[var(--error)]"
                >
                  {birthDateError}
                </p>
              )}
            </div>

            {/* ===== CAMPO: Género (select con chevron SVG) ===== */}
            {/*
             * Valores enum: M/F/O — Labels: Masculino/Femenino/Otro (SPEC v1.3.0 §2 CC-002).
             * Patrón idéntico al usado en /auth/register para consistencia visual.
             */}
            <div className="mb-5">
              <label htmlFor="gender" className={LABEL_CLASSES}>
                Género
              </label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  required
                  value={form.gender}
                  onChange={handleChange}
                  disabled={submitting}
                  className={SELECT_CLASSES}
                >
                  <option value="" disabled>
                    Selecciona tu género
                  </option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronDown />
                </div>
              </div>
            </div>

            {/* ===== CAMPO: País (select con chevron SVG) ===== */}
            {/*
             * Valores enum: CO/US/CA/MX/VE/OT — Labels completos (SPEC v1.3.0 §2 CC-002).
             */}
            <div className="mb-6">
              <label htmlFor="country" className={LABEL_CLASSES}>
                País
              </label>
              <div className="relative">
                <select
                  id="country"
                  name="country"
                  required
                  value={form.country}
                  onChange={handleChange}
                  disabled={submitting}
                  className={SELECT_CLASSES}
                >
                  <option value="" disabled>
                    Selecciona tu país
                  </option>
                  <option value="CO">Colombia</option>
                  <option value="US">EE.UU.</option>
                  <option value="CA">Canadá</option>
                  <option value="MX">México</option>
                  <option value="VE">Venezuela</option>
                  <option value="OT">Otro</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronDown />
                </div>
              </div>
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
                Perfil actualizado correctamente.
              </div>
            )}

            {/* ===== MENSAJE DE ERROR GLOBAL ===== */}
            {/*
             * Visible solo cuando existe error de validación o del servidor.
             * Color: var(--error) — rojo vibrante del Design System (SPEC §4.1).
             * role="alert" + aria-live="assertive" para lectores de pantalla (A11y).
             */}
            {error && (
              <div
                id="profile-error"
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
                  Guardando cambios...
                </span>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
