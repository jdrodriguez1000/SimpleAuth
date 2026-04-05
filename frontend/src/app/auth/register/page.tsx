// [REQ-F-01] - Vista de Registro: creación de cuenta con validaciones cliente (US-1.1.1)
// [TSK-F-05.2] - Maquetación de vista /auth/register con todos los campos del PRD (SPEC v1.3.0 §3, §5)
"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { PasswordStrengthChecklist } from "@/components/ui/PasswordStrengthChecklist";

// --- Tipos locales ---

interface RegisterFormState {
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  gender: string;
  country: string;
  password: string;
  confirm_password: string;
  terms: boolean;
}

// --- Helpers de validación ---

/**
 * Verifica si el usuario tiene al menos 18 años según la fecha ingresada.
 * PRD FR-1.1.1 — edad mínima requerida por SPEC v1.3.0 §5.
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

const SELECT_CLASSES = [
  "bg-[var(--input)] border border-[var(--border)]",
  "rounded-[var(--radius-md)] px-3 py-2 w-full",
  "text-[var(--foreground)]",
  "appearance-none",
  "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
  "transition-[border-color,box-shadow] duration-200",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const LABEL_CLASSES = "text-label-sm text-[var(--foreground)] opacity-70 mb-1 block";

// Chevron SVG para los <select>
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

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterFormState>({
    first_name: "",
    last_name: "",
    email: "",
    birth_date: "",
    gender: "",
    country: "",
    password: "",
    confirm_password: "",
    terms: false,
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  /**
   * handleChange — maneja inputs de texto, email, date, select.
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Validación en tiempo real — fecha de nacimiento (PRD FR-1.1.1)
    if (name === "birth_date" && value) {
      if (!isAtLeast18(value)) {
        setBirthDateError("Debes ser mayor de 18 años para registrarte");
      } else {
        setBirthDateError(null);
      }
    }

    // Validación en tiempo real — confirmación de contraseña
    if (name === "confirm_password") {
      if (value && value !== form.password) {
        setConfirmPasswordError("Las contraseñas no coinciden");
      } else {
        setConfirmPasswordError(null);
      }
    }

    // Re-validar confirm_password si password cambia
    if (name === "password" && form.confirm_password) {
      if (form.confirm_password !== value) {
        setConfirmPasswordError("Las contraseñas no coinciden");
      } else {
        setConfirmPasswordError(null);
      }
    }
  }

  /**
   * handleCheckbox — maneja el campo terms (checkbox).
   */
  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, terms: e.target.checked }));
  }

  /**
   * handleSubmit — valida todos los campos antes de simular el envío.
   * SPEC v1.3.0 §6 — Loading States + validaciones de negocio.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Validación: edad mínima 18 años
    if (!isAtLeast18(form.birth_date)) {
      setError("Debes ser mayor de 18 años para registrarte");
      setBirthDateError("Debes ser mayor de 18 años para registrarte");
      setSubmitting(false);
      return;
    }

    // Validación: contraseñas coincidentes
    if (form.password !== form.confirm_password) {
      setError("Las contraseñas no coinciden");
      setConfirmPasswordError("Las contraseñas no coinciden");
      setSubmitting(false);
      return;
    }

    // Validación: términos aceptados
    if (!form.terms) {
      setError("Debes aceptar los Términos y Condiciones para continuar");
      setSubmitting(false);
      return;
    }

    // Simulación de llamada al backend (1.5s mock — integración real en Fase 4)
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    setSubmitting(false);
  }

  return (
    // AuthLayout: título y subtítulo encima del GlassCard (SPEC v1.3.0 §3.2)
    <AuthLayout title="Crea tu cuenta" subtitle="Únete a SimpleAuth">
      {/*
       * GlassCard: contenedor del formulario — glassmorphism premium (SPEC v1.3.0 §3.3).
       * shadow="elevated" para mayor profundidad visual, alineado con la vista de login.
       */}
      <GlassCard shadow="elevated" padding="lg">
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulario de registro"
        >

          {/* ===== FILA: Nombre y Apellido (grid 2 columnas) ===== */}
          <div className="grid grid-cols-2 gap-4 mb-5">
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

          {/* ===== CAMPO: Correo electrónico ===== */}
          <div className="mb-5">
            <label htmlFor="email" className={LABEL_CLASSES}>
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
              className={INPUT_CLASSES}
            />
          </div>

          {/* ===== CAMPO: Fecha de nacimiento ===== */}
          {/*
           * PRD FR-1.1.1 — Validación de edad mínima: 18 años.
           * El label incluye la nota de edad para claridad inmediata al usuario.
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
              aria-describedby={birthDateError ? "birth-date-error" : undefined}
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

          {/* ===== CAMPO: Género (select) ===== */}
          {/*
           * Opciones exactas según SPEC §2 CC-002.
           * Wrapper relativo + chevron SVG posicionado a la derecha.
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

          {/* ===== CAMPO: País (select) ===== */}
          {/*
           * Opciones exactas según SPEC §2 CC-002.
           */}
          <div className="mb-5">
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

          {/* ===== CAMPO: Contraseña ===== */}
          {/*
           * PRD FR-1.1.1 — Seguridad: Password Strength Checklist en tiempo real.
           * El checklist se actualiza con cada keystroke sin debounce (estado local).
           */}
          <div className="mb-5">
            <label htmlFor="password" className={LABEL_CLASSES}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              disabled={submitting}
              className={INPUT_CLASSES}
            />
            {/* Password Strength Checklist — visible apenas el usuario empiece a escribir */}
            {form.password.length > 0 && (
              <PasswordStrengthChecklist password={form.password} />
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

          {/* ===== CAMPO: Términos y Condiciones (checkbox) ===== */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={form.terms}
                onChange={handleCheckbox}
                disabled={submitting}
                className="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)] cursor-pointer disabled:opacity-50"
              />
              <label
                htmlFor="terms"
                className="text-body-md text-[var(--foreground)] opacity-80 cursor-pointer"
              >
                He leído y acepto los{" "}
                <Link
                  href="#"
                  className="text-[var(--primary)] hover:opacity-80 transition-opacity duration-200 focus:outline-none focus-visible:underline"
                  tabIndex={submitting ? -1 : 0}
                >
                  Términos y Condiciones
                </Link>
              </label>
            </div>
          </div>

          {/* ===== MENSAJE DE ERROR GLOBAL ===== */}
          {/*
           * Visible solo cuando existe error de validación o del servidor.
           * Color: var(--error) — rojo vibrante según Design System (SPEC §4.1).
           * role="alert" + aria-live para lectores de pantalla (A11y).
           */}
          {error && (
            <div
              id="register-error"
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
           * Texto "Crear cuenta" / loading "Creando cuenta..." con spinner.
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
                Creando cuenta...
              </span>
            ) : (
              "Crear cuenta"
            )}
          </button>

          {/* ===== PIE DEL CARD: enlace al login ===== */}
          {/*
           * Separador visual con borde tonal (No-Line Rule — UI Kit §2.1).
           * Redirige a /auth/login para usuarios que ya tienen cuenta.
           */}
          <div className="mt-6 pt-5 border-t border-[var(--border)] text-center">
            <p className="text-body-md text-[var(--foreground)] opacity-70">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/auth/login"
                className={[
                  "text-[var(--primary)] font-medium",
                  "hover:opacity-80 transition-opacity duration-200",
                  "focus:outline-none focus-visible:underline",
                ].join(" ")}
                tabIndex={submitting ? -1 : 0}
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </GlassCard>
    </AuthLayout>
  );
}
