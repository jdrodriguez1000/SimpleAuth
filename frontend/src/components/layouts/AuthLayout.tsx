// [TSK-F-03.1] - AuthLayout: contenedor base para vistas públicas /auth — SPEC v1.3.0 §3.2
// [TSK-F-04] - Logo SVG premium integrado; placeholder ShieldCheck eliminado (G-11)
// Server Component — no necesita "use client". El ThemeToggle es el único cliente.

import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

// --- Interfaz del componente ---

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Título opcional debajo del logo (ej: "Inicia sesión", "Crea tu cuenta") */
  title?: string;
  /** Subtítulo o descripción breve opcional */
  subtitle?: string;
}

// --- Componente ---

function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    /*
     * Contenedor raíz: ocupa toda la pantalla, centrado vertical y horizontalmente.
     * Fondo: surface-container-low (SPEC §3.2 — no blanco puro).
     */
    <div
      className={cn(
        "min-h-screen flex flex-col",
        "bg-[var(--surface-container-low)]",
        // Transición suave al cambiar tema — alineada con body en globals.css
        "transition-[background-color] duration-300 ease-in-out"
      )}
    >
      {/* ===== HEADER ===== */}
      <header className="w-full flex items-center justify-between px-4 py-4 sm:px-6">
        {/*
         * Logo: ShieldCheck placeholder hasta TSK-F-04 (assets generados con IA).
         * Tipografía: font-display (Manrope) — UI Kit §3.
         * Color: var(--primary) — azul inteligente del Design System.
         */}
        <div className="flex items-center gap-2 mx-auto">
          {/*
           * [TSK-F-04] Logo SVG artesanal — escudo + checkmark con gradiente primario.
           * priority: above the fold, evita layout shift en la carga inicial.
           */}
          <Image
            src="/logo.svg"
            alt="SimpleAuth logo"
            width={28}
            height={28}
            priority
          />
          <span
            className={cn(
              "font-display font-700 text-xl tracking-tight",
              "text-[var(--primary)]"
            )}
          >
            SimpleAuth
          </span>
        </div>

        {/* Theme Toggle: esquina superior derecha — acción de cliente */}
        <div className="absolute right-4 top-4 sm:right-6 sm:top-4">
          <ThemeToggle />
        </div>
      </header>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <main
        className={cn(
          "flex flex-1 flex-col items-center justify-center",
          "px-4 pb-12 pt-4"
        )}
      >
        {/*
         * Bloque de título/subtítulo opcional por encima del panel de formulario.
         * El GlassCard NO está aquí — cada vista lo instancia con sus propias props.
         */}
        {(title || subtitle) && (
          <div className="w-full max-w-md mb-6 text-center">
            {title && (
              <h1
                className={cn(
                  "text-headline-md text-[var(--foreground)]",
                  "mb-1"
                )}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-body-md text-[var(--foreground)] opacity-60">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/*
         * Posicionador del panel del formulario.
         * GlassCard es responsabilidad de cada vista individual.
         * max-w-md ≈ 448px — ancho estándar para formularios de auth.
         */}
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}

export default AuthLayout;
export { AuthLayout };
