// [REQ-F-04] - Logout: limpieza de sesión local y redirección segura (FR-1.1.5)
// [TSK-F-08.1] - Página de redirección automática sin UI visible.
//                Limpia localStorage/sessionStorage y redirige a
//                /auth/login?toast=logout_success (contrato con TSK-F-08.2).
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Limpieza de estado local.
    // PROTOTIPO: no hay tokens JWT ni cookies reales — la limpieza es simbólica.
    // FASE 4: aquí se llamará al endpoint POST /auth/logout (revocación RT vía cookie)
    // y se borrará el Access Token del estado en memoria antes de redirigir.
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }

    // Breve pausa de 300 ms antes de redirigir.
    // Evita el flash instantáneo y permite que el usuario perciba la transición.
    // router.replace (no push) impide que el usuario vuelva a /auth/logout
    // con el botón "atrás" del navegador.
    const timer = setTimeout(() => {
      router.replace("/auth/login?toast=logout_success");
    }, 300);

    return () => clearTimeout(timer);
  }, [router]);

  // --- UI de transición (visible ~300 ms) ---
  // Pantalla minimalista alineada con el design system "The Intelligent Monolith".
  // Sin AuthLayout ni GlassCard — SPEC v1.3.0 §3.1: Layout: None para /auth/logout.
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[var(--surface-container-low)]"
      aria-live="polite"
      aria-label="Cerrando sesión"
    >
      {/* Spinner de transición */}
      <svg
        className="animate-spin h-8 w-8 text-[var(--primary)] mb-4"
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
      <p className="text-body-md text-[var(--foreground)] opacity-60">
        Cerrando sesión...
      </p>
    </div>
  );
}
