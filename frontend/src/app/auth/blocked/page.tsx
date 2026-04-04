// [REQ-F-07] - Vista de bloqueo por rate limit: pantalla informativa (FR-1.1.7)
// [TSK-F-11] - Maquetación de vista /auth/blocked — pantalla de bloqueo por intentos excesivos
// Server Component — no necesita "use client"; es puramente presentacional (sin estado ni eventos).

import Link from "next/link";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { GlassCard } from "@/components/ui/GlassCard";

// --- Componente ---

export default function BlockedPage() {
  return (
    // AuthLayout: sin subtitle — el contenido del card es suficientemente descriptivo
    <AuthLayout title="Acceso bloqueado temporalmente">
      {/*
       * GlassCard: shadow="elevated" — consistente con el patrón de vistas informativas.
       * padding="lg" — espacio generoso para contenido informativo.
       */}
      <GlassCard shadow="elevated" padding="lg">

        {/* ===== ÍCONO CENTRAL: candado con gradiente de error/warning ===== */}
        {/*
         * SVG inline — sin dependencias de iconos externos.
         * Gradiente: var(--error) para comunicar estado de bloqueo con claridad visual.
         * Design System "The Intelligent Monolith" — sin colores hardcodeados.
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
              <linearGradient id="lock-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--error)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--error)" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Cuerpo del candado (arco superior) */}
            <path
              d="M20 28V20a12 12 0 0 1 24 0v8"
              stroke="url(#lock-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Cuerpo rectangular del candado */}
            <rect
              x="12"
              y="28"
              width="40"
              height="28"
              rx="4"
              ry="4"
              fill="url(#lock-gradient)"
              opacity="0.12"
              stroke="url(#lock-gradient)"
              strokeWidth="2"
            />
            {/* Orificio de la cerradura */}
            <circle
              cx="32"
              cy="42"
              r="4"
              fill="url(#lock-gradient)"
              opacity="0.8"
            />
            {/* Ranura de llave */}
            <line
              x1="32"
              y1="46"
              x2="32"
              y2="50"
              stroke="url(#lock-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ===== TÍTULO ===== */}
        <h2 className="text-headline-md text-[var(--foreground)] text-center mt-4 mb-2">
          Demasiados intentos fallidos
        </h2>

        {/* ===== PÁRRAFO PRINCIPAL (FR-1.1.7 — menciona "15 minutos" de forma explícita) ===== */}
        <p className="text-body-md text-[var(--foreground)] opacity-70 text-center mb-6">
          Has superado el número máximo de intentos de inicio de sesión permitidos.
          Por seguridad, el acceso ha sido bloqueado temporalmente durante{" "}
          <strong className="text-[var(--foreground)] opacity-90">15 minutos</strong>.
          Transcurrido ese tiempo, podrás intentarlo nuevamente.
        </p>

        {/* ===== BLOQUE DE ALERTA INFORMATIVA ===== */}
        {/*
         * Fondo tonal de error con borde translúcido — patrón de alerta de advertencia
         * del Design System. var(--error) comunica el estado de bloqueo sin ser alarmante.
         */}
        <div
          role="alert"
          aria-label="Información sobre el bloqueo de cuenta"
          className={[
            "rounded-[var(--radius-md)] p-4",
            "bg-[var(--error)]/10 border border-[var(--error)]/30",
            "flex items-start gap-3 mb-6",
          ].join(" ")}
        >
          {/* Ícono de advertencia inline */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              stroke="var(--error)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <line
              x1="12"
              y1="9"
              x2="12"
              y2="13"
              stroke="var(--error)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="17" r="1" fill="var(--error)" />
          </svg>

          {/* Texto del bloque */}
          <div>
            <p className="text-body-md text-[var(--foreground)] font-semibold mb-1">
              Acceso bloqueado por 15 minutos
            </p>
            <p className="text-body-md text-[var(--foreground)] opacity-70">
              Este bloqueo protege tu cuenta de accesos no autorizados. Si no
              recuerdas tu contraseña, puedes recuperarla en cualquier momento.
            </p>
          </div>
        </div>

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

        {/* ===== SEPARADOR ===== */}
        <div className="border-t border-[var(--border)] my-5" />

        {/* ===== ENLACE SECUNDARIO: recuperación de contraseña ===== */}
        {/*
         * Información adicional recomendada por la SPEC — enlace a /auth/recovery.
         * opacity-60 para jerarquía visual secundaria.
         */}
        <p className="text-body-md text-[var(--foreground)] opacity-60 text-center">
          ¿No recuerdas tu contraseña?{" "}
          <Link
            href="/auth/recovery"
            className={[
              "text-[var(--primary)] font-medium underline-offset-4",
              "hover:underline hover:opacity-90 transition-opacity duration-200",
              "focus:outline-none focus:ring-1 focus:ring-[var(--ring)] rounded-sm",
            ].join(" ")}
          >
            Recupérala aquí
          </Link>
          {" "}sin esperar los 15 minutos.
        </p>

      </GlassCard>
    </AuthLayout>
  );
}
