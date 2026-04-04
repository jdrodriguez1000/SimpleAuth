// [TSK-F-02.1] - Componente GlassCard con efecto glassmorphism (SPEC v1.3.0 §3.3)
// [TSK-F-14] - Animación de entrada sutil con Framer Motion via prop animated (SPEC v1.3.0 §6)
// Contenedor principal para todas las vistas /auth del Design System "The Intelligent Monolith"
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

// --- Constantes de mapeo de props ---

const BLUR_VALUES: Record<NonNullable<GlassCardProps["blur"]>, string> = {
  sm: "8px",
  md: "12px",
  lg: "20px",
};

const SHADOW_CLASSES: Record<NonNullable<GlassCardProps["shadow"]>, string> = {
  none: "",
  card: "shadow-card",
  ambient: "shadow-ambient",
  elevated: "shadow-elevated",
};

const PADDING_CLASSES: Record<NonNullable<GlassCardProps["padding"]>, string> =
  {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

// --- Variantes de animación (SPEC §6: scale 0.98→1, opacity 0→1, duración 0.3s) ---

const cardVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
};

// --- Interfaz del componente ---

export interface GlassCardProps {
  children: React.ReactNode;
  /** Clases adicionales para composición externa */
  className?: string;
  /** Intensidad del blur: sm=8px | md=12px (default) | lg=20px */
  blur?: "sm" | "md" | "lg";
  /** Opacidad del fondo (0.0 - 1.0). Default: 0.7 */
  opacity?: number;
  /** Tipo de sombra tintada. Default: 'ambient' */
  shadow?: "none" | "card" | "ambient" | "elevated";
  /** Padding interno. Default: 'lg' */
  padding?: "none" | "sm" | "md" | "lg";
  /**
   * Habilita la animación de entrada con Framer Motion.
   * Default: true — pasar false para retrocompatibilidad o contextos sin animación.
   */
  animated?: boolean;
}

// --- Componente ---

/**
 * Contenedor glassmorphism premium del Design System SimpleAuth.
 * Con `animated=true` (default) ejecuta una entrada sutil: scale 0.98→1 + opacity 0→1.
 * Respeta la preferencia del usuario de reducir el movimiento (WCAG 2.1 §2.3).
 */
function GlassCard({
  children,
  className,
  blur = "md",
  opacity = 0.7,
  shadow = "ambient",
  padding = "lg",
  animated = true,
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();

  // El blur base (md=12px) lo provee la clase .glass-card de globals.css.
  // Para sm y lg se sobreescribe vía style inline para mantener un único
  // punto de verdad en las variables CSS y evitar duplicar valores en Tailwind.
  const blurValue = BLUR_VALUES[blur];

  const inlineStyle: CSSProperties = {
    backdropFilter: `blur(${blurValue})`,
    WebkitBackdropFilter: `blur(${blurValue})`,
    // Sobreescribe la opacidad del fondo manteniendo el canal RGB del token CSS.
    // La variable --surface-rgb ya contiene los valores R, G, B separados por coma.
    background: `rgba(var(--surface-rgb), ${opacity})`,
  };

  const sharedClassName = cn(
    // Base glassmorphism: borde translúcido y radio del Design System
    "rounded-[var(--radius-xl)] border border-white/10",
    // Sombra tintada según prop
    SHADOW_CLASSES[shadow],
    // Padding interno según prop
    PADDING_CLASSES[padding],
    // Transición suave al cambiar tema (alineado con body en globals.css)
    "transition-[background,box-shadow] duration-300 ease-in-out",
    className
  );

  // Si animated=false, renderiza el div estático para retrocompatibilidad.
  if (!animated) {
    return (
      <div role="region" style={inlineStyle} className={sharedClassName}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      role="region"
      style={inlineStyle}
      className={sharedClassName}
      variants={cardVariants}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;
export { GlassCard };
