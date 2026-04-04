// [REQ-F-03] - Vista de Resultado de Verificación de Correo (FR-1.1.8 Vista B/C)
// [TSK-F-07] - Mapeo diferencial de mensajes para "Expirado" vs "Inválido" (G-05);
//              botón de reenvío funcional (mock); reacción a query params ?status y ?reason.
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { StatusCard } from "@/components/ui/StatusCard";

// --- Tipos locales ---

type VerifyStatus = "success" | "error";
type VerifyReason = "expired" | "invalid";

// --- Configuración diferencial de mensajes (G-05) ---
// Mapeo declarativo: evita condicionales anidados en el JSX.

interface MessageConfig {
  title: string;
  message: string;
  resendLabel?: string;
  secondaryAction: { label: string; href: string };
}

function resolveMessageConfig(
  status: VerifyStatus,
  reason: VerifyReason
): MessageConfig {
  if (status === "success") {
    return {
      title: "¡Cuenta verificada!",
      message:
        "Tu correo ha sido verificado correctamente. Ya puedes iniciar sesión.",
      secondaryAction: { label: "Ir al login", href: "/auth/login" },
    };
  }

  // status === "error"
  if (reason === "expired") {
    return {
      title: "Enlace expirado",
      message:
        "El enlace de verificación ha caducado. Los enlaces son válidos por 1 hora. Solicita uno nuevo.",
      resendLabel: "Reenviar enlace de verificación",
      secondaryAction: { label: "Volver al login", href: "/auth/login" },
    };
  }

  // reason === "invalid" — default para cualquier otro valor de reason
  return {
    title: "Enlace inválido",
    message:
      "El enlace de verificación no es válido o ya fue utilizado. Solicita uno nuevo si tu cuenta aún no está activa.",
    resendLabel: "Reenviar enlace de verificación",
    secondaryAction: { label: "Volver al login", href: "/auth/login" },
  };
}

// --- Componente interno (requiere useSearchParams — debe estar bajo <Suspense>) ---
// Next.js 15 App Router: useSearchParams() solo puede usarse dentro de Suspense boundary.

function VerifyResultContent() {
  const searchParams = useSearchParams();

  // Lectura defensiva de query params con fallbacks seguros
  const status = (searchParams.get("status") ?? "error") as VerifyStatus;
  const reason = (searchParams.get("reason") ?? "invalid") as VerifyReason;

  // Estado de carga del botón de reenvío (mock — integración real en Fase 4)
  const [isResending, setIsResending] = useState<boolean>(false);

  /**
   * handleResend — simula la llamada al backend para reenviar el correo de verificación.
   * SPEC v1.3.0 §6 — Loading States. Integración real en Fase 4.
   */
  async function handleResend(): Promise<void> {
    setIsResending(true);
    await new Promise<void>((r) => setTimeout(r, 1500)); // mock 1.5s
    setIsResending(false);
  }

  // Resolución del mapeo diferencial de mensajes (G-05)
  const config = resolveMessageConfig(status, reason);

  // Título dinámico para AuthLayout — derivado del status leído
  const layoutTitle =
    status === "success" ? "Verificación exitosa" : "Error de verificación";

  return (
    <AuthLayout title={layoutTitle}>
      {/*
       * StatusCard gestiona internamente la renderización de ResendButton
       * cuando onResend está definido y status="error". (SPEC v1.3.0 §6)
       * No se reimplementa el botón aquí — responsabilidad delegada al componente.
       */}
      <StatusCard
        status={status}
        title={config.title}
        message={config.message}
        onResend={status === "error" ? handleResend : undefined}
        resendLabel={config.resendLabel}
        isResending={isResending}
        secondaryAction={config.secondaryAction}
      />
    </AuthLayout>
  );
}

// --- Componente raíz exportado ---
// Suspense es obligatorio en Next.js 15 App Router cuando se usa useSearchParams()
// dentro de un Client Component. Sin este wrapper el build falla con error de
// "useSearchParams() should be wrapped in a suspense boundary".

export default function VerifyResultPage() {
  return (
    <Suspense fallback={<div />}>
      <VerifyResultContent />
    </Suspense>
  );
}
