// [REQ-F-08] - Notificación flotante post-logout con auto-dismiss (SPEC v1.3.0 §3)
// [TSK-F-08.2] - Componente Toast: lee ?toast= de URL, muestra notificación y limpia el param

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// ---------------------------------------------------------------------------
// Mapa de mensajes por clave de toast
// ---------------------------------------------------------------------------

const TOAST_MESSAGES: Record<
  string,
  { message: string; type: "success" | "error" | "info" }
> = {
  logout_success: {
    message: "Sesión cerrada correctamente.",
    type: "success",
  },
};

// ---------------------------------------------------------------------------
// Sub-componente presentacional (no depende de hooks de navegación)
// ---------------------------------------------------------------------------

interface ToastUIProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

function ToastUI({ message, type, onClose }: ToastUIProps) {
  const styles: Record<
    "success" | "error" | "info",
    { border: string; icon: string; iconPath: string }
  > = {
    success: {
      border: "border-[var(--success)]/40",
      icon: "text-[var(--success)]",
      iconPath: "M5 13l4 4L19 7",
    },
    error: {
      border: "border-[var(--error)]/40",
      icon: "text-[var(--error)]",
      iconPath: "M6 18L18 6M6 6l12 12",
    },
    info: {
      border: "border-[var(--primary)]/40",
      icon: "text-[var(--primary)]",
      iconPath: "M13 16h-1v-4h-1m1-4h.01",
    },
  };

  const s = styles[type];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={[
        // Posicionamiento: esquina superior derecha, sobre todo el contenido
        "fixed top-4 right-4 z-50",
        // Dimensiones y layout
        "flex items-center gap-3 px-4 py-3 max-w-sm w-full",
        // Estética Design System — tokens CSS (no hardcoded)
        "bg-[var(--surface-container-high)]",
        "border",
        s.border,
        "rounded-[var(--radius-md)]",
        "shadow-elevated",
        // Animación de entrada (definida en globals.css TSK-F-01)
        "animate-slide-down",
      ].join(" ")}
    >
      {/* Icono SVG inline según tipo — sin dependencias externas */}
      <svg
        className={`h-5 w-5 flex-shrink-0 ${s.icon}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={s.iconPath} />
      </svg>

      {/* Mensaje */}
      <p className="text-body-md text-[var(--foreground)] flex-1">{message}</p>

      {/* Botón de cierre */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="text-[var(--foreground)] opacity-40 hover:opacity-80 transition-opacity duration-150 flex-shrink-0"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente público — requiere <Suspense> en el consumidor (useSearchParams)
// ---------------------------------------------------------------------------

export function ToastNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = searchParams.get("toast");
    if (!key || !TOAST_MESSAGES[key]) return;

    setToast(TOAST_MESSAGES[key]);
    setVisible(true);

    // Limpiar el query param sin recargar la página
    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl, { scroll: false });

    // Auto-dismiss a los 4 segundos
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [searchParams, router, pathname]);

  if (!visible || !toast) return null;

  return (
    <ToastUI
      message={toast.message}
      type={toast.type}
      onClose={() => setVisible(false)}
    />
  );
}
