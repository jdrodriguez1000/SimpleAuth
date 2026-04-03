// [TSK-F-02.2] - Componente StatusCard con ResendButton y ConfirmDeleteButton
// Caso de uso principal: /auth/verify-result con estados success/error (SPEC v1.3.0 §3.3 + §6)
// Mapeo diferencial de mensajes para "Expirado" vs "Inválido" soportado mediante props de título/mensaje (G-05)

import { CheckCircle, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

// --- Interfaces ---

export interface StatusCardProps {
  /** Estado principal de la tarjeta: éxito o error */
  status: "success" | "error";
  /** Título visible (headline-md, Manrope) */
  title: string;
  /** Mensaje descriptivo (body-md, muted) */
  message: string;
  /** Callback de reenvío — si se define y status='error', renderiza ResendButton */
  onResend?: () => void;
  /** Label personalizado para el botón de reenvío. Default: 'Reenviar correo de verificación' */
  resendLabel?: string;
  /** Callback de eliminación — si se define, renderiza aviso GDPR + ConfirmDeleteButton */
  onConfirmDelete?: () => void;
  /** Estado de carga del ResendButton */
  isResending?: boolean;
  /** Acción secundaria (ej: "Volver al login") */
  secondaryAction?: {
    label: string;
    href: string;
  };
  /** Clases adicionales para composición externa */
  className?: string;
}

// --- Sub-componente: ResendButton ---
// UI Kit §4.1: botón primario con gradiente, escala táctil y estado de carga

interface ResendButtonProps {
  onClick: () => void;
  label: string;
  isLoading: boolean;
}

function ResendButton({ onClick, label, isLoading }: ResendButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
      className={cn(
        // Base: gradiente primario del Design System (globals.css .bg-primary-gradient)
        "bg-primary-gradient text-white w-full",
        "rounded-[var(--radius)] px-6 py-3",
        "text-sm font-semibold",
        // Escala táctil (UI Kit §4.1)
        "hover:scale-[0.99] active:scale-[0.97]",
        "transition-transform duration-150 ease-in-out",
        // Estado de carga
        isLoading ? "opacity-70 cursor-wait" : "cursor-pointer"
      )}
    >
      {isLoading ? "Enviando..." : label}
    </button>
  );
}

// --- Sub-componente: ConfirmDeleteButton ---
// SPEC v1.3.0 §3.3: botón rojo vibrante con aviso de 30 días (FR-1.1.9)

interface ConfirmDeleteButtonProps {
  onClick: () => void;
}

function ConfirmDeleteButton({ onClick }: ConfirmDeleteButtonProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Aviso GDPR 30 días — FR-1.1.9 */}
      <p className="text-body-md text-muted-foreground text-center text-sm">
        Tu cuenta permanecerá inactiva 30 días antes de ser eliminada definitivamente.
      </p>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          // Color destructivo del Design System (--error / --destructive)
          "bg-destructive text-white w-full",
          "rounded-[var(--radius)] px-6 py-3",
          "text-sm font-semibold",
          // Escala táctil (UI Kit §4.1)
          "hover:scale-[0.99] active:scale-[0.97]",
          "transition-transform duration-150 ease-in-out",
          "cursor-pointer"
        )}
      >
        Eliminar mi cuenta
      </button>
    </div>
  );
}

// --- Componente principal: StatusCard ---

function StatusCard({
  status,
  title,
  message,
  onResend,
  resendLabel = "Reenviar correo de verificación",
  onConfirmDelete,
  isResending = false,
  secondaryAction,
  className,
}: StatusCardProps) {
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <GlassCard
      shadow="elevated"
      padding="lg"
      className={cn("flex flex-col items-center gap-6 text-center w-full max-w-md", className)}
    >
      {/* Ícono de estado — centrado, grande */}
      <div role="img" aria-label={isSuccess ? "Operación exitosa" : "Error"}>
        {isSuccess ? (
          // CheckCircle verde: light → green-500, dark → green-400
          <CheckCircle
            size={64}
            strokeWidth={1.5}
            className="text-green-500 dark:text-green-400"
            aria-hidden="true"
          />
        ) : (
          // XCircle rojo: usa el token --error / --destructive del Design System
          <XCircle
            size={64}
            strokeWidth={1.5}
            className="text-destructive"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Contenido textual */}
      <div className="flex flex-col gap-2">
        {/* Título: Manrope (font-display), headline-md */}
        <h2 className="text-headline-md text-foreground">{title}</h2>

        {/* Mensaje: Inter (body-md), muted */}
        <p className="text-body-md text-muted-foreground">{message}</p>
      </div>

      {/* Área de acciones — solo se renderiza si hay alguna acción disponible */}
      {(isError || onConfirmDelete || secondaryAction) && (
        <div className="flex flex-col items-center gap-3 w-full">
          {/* ResendButton: visible únicamente cuando status='error' y onResend está definido (SPEC §6) */}
          {isError && onResend && (
            <ResendButton
              onClick={onResend}
              label={resendLabel}
              isLoading={isResending}
            />
          )}

          {/* ConfirmDeleteButton: visible cuando onConfirmDelete está definido (/profile/delete) */}
          {onConfirmDelete && (
            <ConfirmDeleteButton onClick={onConfirmDelete} />
          )}

          {/* Acción secundaria: enlace sin fondo, hover con surface-container-high */}
          {secondaryAction && (
            <a
              href={secondaryAction.href}
              className={cn(
                "text-sm font-medium text-muted-foreground",
                "hover:text-foreground hover:bg-accent",
                "px-4 py-2 rounded-[var(--radius)]",
                "transition-colors duration-150 ease-in-out"
              )}
            >
              {secondaryAction.label}
            </a>
          )}
        </div>
      )}
    </GlassCard>
  );
}

export default StatusCard;
export { StatusCard, ResendButton, ConfirmDeleteButton };
