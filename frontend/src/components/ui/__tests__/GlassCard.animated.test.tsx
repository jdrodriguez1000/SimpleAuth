// [TSK-F-14.1] — Tests de prop animated en GlassCard
// Valida: renderizado estático vs animado, ausencia de atributos Framer Motion en DOM limpio
// y no regresiones sobre los tests previos de TSK-F-13

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------------
// Mock de framer-motion
// Igual que en PageTransition.test.tsx: motion.div → div semántico.
// useReducedMotion retorna false por defecto (modo animación activa).
// ---------------------------------------------------------------------------

vi.mock("framer-motion", () => {
  const React = require("react");
  const mockUseReducedMotion = vi.fn(() => false);

  return {
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            className,
            style,
            role,
            initial: _initial,
            animate: _animate,
            variants: _variants,
            transition: _transition,
            ...rest
          }: {
            children?: React.ReactNode;
            className?: string;
            style?: React.CSSProperties;
            role?: string;
            initial?: unknown;
            animate?: unknown;
            variants?: unknown;
            transition?: unknown;
            [key: string]: unknown;
          },
          ref: React.Ref<HTMLDivElement>
        ) =>
          React.createElement(
            "div",
            { className, style, role, ref, ...rest },
            children
          )
      ),
    },
    useReducedMotion: mockUseReducedMotion,
    __mockUseReducedMotion: mockUseReducedMotion,
  };
});

import { GlassCard } from "../GlassCard";

// ---------------------------------------------------------------------------
// animated=false: div estático, sin atributos de Framer Motion
// ---------------------------------------------------------------------------

describe("GlassCard — animated=false (modo estático)", () => {
  it("renderiza un div nativo sin data-attributes de framer-motion", () => {
    const { container } = render(
      <GlassCard animated={false}>Contenido estático</GlassCard>
    );
    const card = container.firstChild as HTMLElement;

    // Debe ser un div estándar
    expect(card.tagName).toBe("DIV");

    // No debe haber atributos de framer-motion en el DOM
    // Framer Motion inyecta data-projection-id y style con transform cuando está activo.
    // Con animated=false el div es puramente estático.
    expect(card.getAttribute("data-projection-id")).toBeNull();
  });

  it("renderiza el contenido hijo correctamente con animated=false", () => {
    render(
      <GlassCard animated={false}>
        <p>Contenido sin animación</p>
      </GlassCard>
    );
    expect(screen.getByText("Contenido sin animación")).toBeInTheDocument();
  });

  it("mantiene role=region con animated=false para accesibilidad", () => {
    render(<GlassCard animated={false}>Contenido</GlassCard>);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("aplica todas las clases de glassmorphism con animated=false", () => {
    render(
      <GlassCard animated={false} blur="lg" shadow="elevated" padding="sm">
        Contenido
      </GlassCard>
    );
    const card = screen.getByRole("region");
    expect(card.className).toContain("rounded-[var(--radius-xl)]");
    expect(card.className).toContain("shadow-elevated");
    expect(card.className).toContain("p-4");
  });

  it("aplica el style inline de blur y opacidad con animated=false", () => {
    render(
      <GlassCard animated={false} blur="sm" opacity={0.5}>
        Contenido
      </GlassCard>
    );
    const card = screen.getByRole("region");
    expect(card).toHaveStyle({ backdropFilter: "blur(8px)" });
    const style = card.getAttribute("style") ?? "";
    expect(style).toContain("0.5");
  });
});

// ---------------------------------------------------------------------------
// animated=true (default): renderiza con motion.div (que en test es un div)
// ---------------------------------------------------------------------------

describe("GlassCard — animated=true (modo animado, default)", () => {
  it("renderiza el contenido hijo correctamente con animated=true", () => {
    render(
      <GlassCard animated={true}>
        <p>Contenido animado</p>
      </GlassCard>
    );
    expect(screen.getByText("Contenido animado")).toBeInTheDocument();
  });

  it("mantiene role=region con animated=true para accesibilidad", () => {
    render(<GlassCard animated={true}>Contenido</GlassCard>);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("aplica la clase correcta de glassmorphism con animated=true", () => {
    render(<GlassCard animated={true}>Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).toContain("rounded-[var(--radius-xl)]");
    expect(card.className).toContain("border-white/10");
  });

  it("no bloquea la interactividad con animated=true (botón clickeable)", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <GlassCard animated={true}>
        <button onClick={handleClick}>Acción</button>
      </GlassCard>
    );

    await user.click(screen.getByRole("button", { name: "Acción" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("no introduce aria-hidden=true en el wrapper animado", () => {
    const { container } = render(
      <GlassCard animated={true}>Contenido</GlassCard>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).not.toBe("true");
  });
});

// ---------------------------------------------------------------------------
// Prop animated omitida: comportamiento igual a animated=true (default=true)
// ---------------------------------------------------------------------------

describe("GlassCard — prop animated omitida (default=true)", () => {
  it("renderiza con animación por defecto sin errores", () => {
    render(<GlassCard>Contenido por defecto</GlassCard>);
    expect(screen.getByText("Contenido por defecto")).toBeInTheDocument();
  });

  it("tiene role=region por defecto", () => {
    render(<GlassCard>Contenido</GlassCard>);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });
});
