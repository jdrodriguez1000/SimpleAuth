// [REQ-F-03] - Vista post-registro: instrucciones de verificación de correo (US-1.1.1, FR-1.1.8-A)
// [TSK-F-05.3] - Maquetación de vista /auth/verify-sent — pantalla informativa sin formulario
// Server Component — no necesita "use client"; es puramente presentacional (sin estado ni eventos).

import Link from "next/link";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { GlassCard } from "@/components/ui/GlassCard";

// --- Componente ---

export default function VerifySentPage() {
  return (
    // AuthLayout: sin subtitle — el contenido del card ya es suficientemente descriptivo
    <AuthLayout title="Verifica tu cuenta">
      {/*
       * GlassCard: shadow="elevated" — consistente con el patrón de TSK-F-05.1 y TSK-F-05.2.
       * padding="lg" — espacio generoso para contenido informativo.
       */}
      <GlassCard shadow="elevated" padding="lg">

        {/* ===== ÍCONO CENTRAL: envelope con gradiente primario ===== */}
        {/*
         * SVG inline — sin dependencias de iconos externos (TSK-F-14 pendiente).
         * Gradiente: var(--primary) start → var(--primary) end con opacidad reducida en el relleno
         * para un look premium y coherente con el Design System "The Intelligent Monolith".
         */}
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="envelope-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Cuerpo del sobre */}
            <rect
              x="6"
              y="14"
              width="52"
              height="36"
              rx="4"
              ry="4"
              fill="url(#envelope-gradient)"
              opacity="0.15"
              stroke="url(#envelope-gradient)"
              strokeWidth="2"
            />
            {/* Solapa del sobre (chevron) */}
            <polyline
              points="6,14 32,38 58,14"
              fill="none"
              stroke="url(#envelope-gradient)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Líneas de pliegue laterales */}
            <line
              x1="6"
              y1="50"
              x2="22"
              y2="32"
              stroke="url(#envelope-gradient)"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
            <line
              x1="58"
              y1="50"
              x2="42"
              y2="32"
              stroke="url(#envelope-gradient)"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
          </svg>
        </div>

        {/* ===== TÍTULO ===== */}
        <h2 className="text-headline-md text-[var(--foreground)] text-center mt-4 mb-2">
          ¡Revisa tu correo!
        </h2>

        {/* ===== PÁRRAFO PRINCIPAL ===== */}
        <p className="text-body-md text-[var(--foreground)] opacity-70 text-center mb-6">
          Hemos enviado un enlace de verificación a tu dirección de correo
          electrónico. Haz clic en el enlace para activar tu cuenta.
        </p>

        {/* ===== BLOQUE DE ALERTA DE SPAM (PRD FR-1.1.8-A — OBLIGATORIO) ===== */}
        {/*
         * Requisito crítico: informar al usuario dónde buscar si no ve el correo.
         * Fondo tonal primario con borde primario translúcido — patrón de alerta informativa
         * del Design System (no usa var(--error) ya que no es un estado de fallo).
         */}
        <div
          role="note"
          aria-label="Sugerencia: revisa la carpeta de spam"
          className={[
            "rounded-[var(--radius-md)] p-4",
            "bg-[var(--primary)]/10 border border-[var(--primary)]/30",
            "flex items-start gap-3 mb-6",
          ].join(" ")}
        >
          {/* Ícono de advertencia/info inline */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="var(--primary)"
              strokeWidth="2"
            />
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16" r="1" fill="var(--primary)" />
          </svg>

          {/* Texto del bloque */}
          <div>
            <p className="text-body-md text-[var(--foreground)] font-semibold mb-1">
              ¿No ves el correo?
            </p>
            <p className="text-body-md text-[var(--foreground)] opacity-70">
              Revisa tu carpeta de{" "}
              <strong className="text-[var(--foreground)] opacity-90">Spam</strong>,{" "}
              <strong className="text-[var(--foreground)] opacity-90">Correo no deseado</strong>{" "}
              o{" "}
              <strong className="text-[var(--foreground)] opacity-90">Promociones</strong>.
              A veces los correos de verificación llegan ahí.
            </p>
          </div>
        </div>

        {/* ===== SEPARADOR ===== */}
        <div className="border-t border-[var(--border)] mb-6" />

        {/* ===== BOTÓN PRIMARIO: Volver al inicio de sesión ===== */}
        {/*
         * Link estilado como botón CTA — bg-primary-gradient coherente con el Design System.
         * Server Component seguro: no requiere onClick, es una navegación estándar.
         */}
        <Link
          href="/auth/login"
          className={[
            "w-full bg-primary-gradient text-white font-semibold",
            "rounded-[var(--radius-md)] px-4 py-2.5",
            "text-center block",
            "hover:opacity-90 transition-opacity duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2",
            "focus:ring-offset-[var(--background)]",
          ].join(" ")}
        >
          Volver al inicio de sesión
        </Link>

        {/* ===== PIE: expiración del enlace ===== */}
        {/*
         * Información de expiración: 1h según CLAUDE.md §Ciclo de vida de tokens.
         * opacity-50 para jerarquía visual baja — información secundaria.
         */}
        <p className="text-body-md text-[var(--foreground)] opacity-50 text-center mt-4">
          El enlace expirará en 1 hora.
        </p>

      </GlassCard>
    </AuthLayout>
  );
}
