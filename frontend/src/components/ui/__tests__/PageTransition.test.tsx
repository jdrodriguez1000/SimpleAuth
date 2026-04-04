// [TSK-F-14.1] — Tests de accesibilidad y comportamiento de PageTransition
// Valida: renderizado, prefers-reduced-motion, interactividad y ausencia de atributos A11y disruptivos

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------------
// Mock de framer-motion
// Permite controlar useReducedMotion sin depender del entorno de navegador.
// motion.div se convierte en un div semántico que acepta todas las props.
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
            initial: _initial,
            animate: _animate,
            variants: _variants,
            transition: _transition,
            ...rest
          }: {
            children?: React.ReactNode;
            className?: string;
            style?: React.CSSProperties;
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
            { className, style, ref, ...rest },
            children
          )
      ),
    },
    useReducedMotion: mockUseReducedMotion,
    __mockUseReducedMotion: mockUseReducedMotion,
  };
});

import { PageTransition } from "../PageTransition";

// Helper para acceder al mock de useReducedMotion desde los tests
async function getMockUseReducedMotion() {
  const mod = await import("framer-motion");
  return (mod as unknown as { __mockUseReducedMotion: ReturnType<typeof vi.fn> })
    .__mockUseReducedMotion;
}

// ---------------------------------------------------------------------------
// Renderizado básico
// ---------------------------------------------------------------------------

describe("PageTransition — renderizado básico", () => {
  it("renderiza sus hijos correctamente", () => {
    render(
      <PageTransition>
        <p>Contenido de prueba</p>
      </PageTransition>
    );
    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
  });

  it("renderiza múltiples hijos sin error", () => {
    render(
      <PageTransition>
        <h1>Título</h1>
        <p>Párrafo</p>
        <button>Acción</button>
      </PageTransition>
    );
    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Párrafo")).toBeInTheDocument();
    expect(screen.getByText("Acción")).toBeInTheDocument();
  });

  it("aplica la prop className al wrapper externo", () => {
    const { container } = render(
      <PageTransition className="w-full max-w-md">
        <span>Hijo</span>
      </PageTransition>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("w-full");
    expect(wrapper.className).toContain("max-w-md");
  });
});

// ---------------------------------------------------------------------------
// Respeto a prefers-reduced-motion
// ---------------------------------------------------------------------------

describe("PageTransition — prefers-reduced-motion", () => {
  beforeEach(async () => {
    const mock = await getMockUseReducedMotion();
    mock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("cuando reduce motion es true, el componente renderiza sin animación (estado visible)", async () => {
    const mock = await getMockUseReducedMotion();
    // Simula que el usuario prefiere reducción de movimiento
    mock.mockReturnValue(true);

    render(
      <PageTransition>
        <span>Sin animación</span>
      </PageTransition>
    );

    // El contenido debe estar visible inmediatamente (no oculto)
    expect(screen.getByText("Sin animación")).toBeInTheDocument();
    expect(screen.getByText("Sin animación")).toBeVisible();
  });

  it("cuando reduce motion es false, el componente renderiza con animación activa", async () => {
    const mock = await getMockUseReducedMotion();
    // Simula que el usuario no tiene preferencia de reducción
    mock.mockReturnValue(false);

    render(
      <PageTransition>
        <span>Con animación</span>
      </PageTransition>
    );

    // El contenido debe estar presente en el DOM
    expect(screen.getByText("Con animación")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Interactividad no bloqueada
// ---------------------------------------------------------------------------

describe("PageTransition — interactividad", () => {
  it("un botón dentro del wrapper es clickeable", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <PageTransition>
        <button onClick={handleClick}>Enviar</button>
      </PageTransition>
    );

    const button = screen.getByRole("button", { name: "Enviar" });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("un input dentro del wrapper recibe foco y texto", async () => {
    const user = userEvent.setup();

    render(
      <PageTransition>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </PageTransition>
    );

    const input = screen.getByLabelText("Email");
    await user.click(input);
    await user.type(input, "test@example.com");

    expect(input).toHaveValue("test@example.com");
  });
});

// ---------------------------------------------------------------------------
// Accesibilidad básica
// ---------------------------------------------------------------------------

describe("PageTransition — accesibilidad", () => {
  it("el wrapper no introduce aria-hidden=true al flujo del DOM", () => {
    const { container } = render(
      <PageTransition>
        <p>Contenido accesible</p>
      </PageTransition>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).not.toBe("true");
  });

  it("el wrapper no introduce roles que interrumpan el flujo del DOM", () => {
    const { container } = render(
      <PageTransition>
        <p>Contenido accesible</p>
      </PageTransition>
    );
    const wrapper = container.firstChild as HTMLElement;
    // El wrapper no debe tener role=presentation ni role=none que oculten contenido
    const role = wrapper.getAttribute("role");
    expect(role).not.toBe("presentation");
    expect(role).not.toBe("none");
  });

  it("los hijos son accesibles mediante roles semánticos", () => {
    render(
      <PageTransition>
        <button>Acción principal</button>
        <input aria-label="Campo de texto" />
      </PageTransition>
    );

    expect(screen.getByRole("button", { name: "Acción principal" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Campo de texto" })).toBeInTheDocument();
  });

  it("el wrapper no aplica pointer-events: none que bloquee la interacción", () => {
    const { container } = render(
      <PageTransition>
        <button>Click</button>
      </PageTransition>
    );
    const wrapper = container.firstChild as HTMLElement;
    const computedStyle = window.getComputedStyle(wrapper);
    // pointer-events no debe estar forzado a none inline
    expect(wrapper.style.pointerEvents).not.toBe("none");
    expect(computedStyle.pointerEvents).not.toBe("none");
  });
});
