// [TSK-F-14] - Wrapper de transición de página con Framer Motion (SPEC v1.3.0 §6 — Micro-animations)
// Client Component: requiere hooks de Framer Motion (useReducedMotion).
"use client";

import { motion, useReducedMotion } from "framer-motion";

// --- Interfaz del componente ---

interface PageTransitionProps {
  children: React.ReactNode;
  /** Clases CSS adicionales para composición externa */
  className?: string;
}

// --- Variantes de animación (SPEC §6: y: 20→0, opacity: 0→1, duración ~0.3s) ---

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

// --- Componente ---

/**
 * Envuelve el contenido de una página con una animación de entrada sutil.
 * Respeta la preferencia del usuario de reducir el movimiento (WCAG 2.1 §2.3).
 * Animación: opacity 0→1 + y 8→0, duración 0.3s, easeOut.
 */
function PageTransition({ children, className }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={pageVariants}
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

export default PageTransition;
export { PageTransition };
