// [TSK-F-13] — Tests de componente GlassCard (lógica visual crítica G-09)
// Valida renderizado, props de transparencia, accesibilidad y estados visuales

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlassCard } from "../GlassCard";

// ---------------------------------------------------------------------------
// Tests de renderizado base
// ---------------------------------------------------------------------------

describe("GlassCard — renderizado base", () => {
  it("renderiza el contenido hijo correctamente", () => {
    render(<GlassCard>Contenido de prueba</GlassCard>);
    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
  });

  it("aplica role region para accesibilidad", () => {
    render(<GlassCard>Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card).toBeInTheDocument();
  });

  it("aplica clases de glassmorphism por defecto", () => {
    render(<GlassCard>Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).toContain("rounded-[var(--radius-xl)]");
    expect(card.className).toContain("border");
    expect(card.className).toContain("border-white/10");
  });
});

// ---------------------------------------------------------------------------
// Tests de prop blur (efecto de desenfoque)
// ---------------------------------------------------------------------------

describe("GlassCard — prop blur", () => {
  it("blur sm aplica backdropFilter de 8px via style inline", () => {
    render(<GlassCard blur="sm">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card).toHaveStyle({ backdropFilter: "blur(8px)" });
  });

  it("blur md aplica backdropFilter de 12px via style inline", () => {
    render(<GlassCard blur="md">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card).toHaveStyle({ backdropFilter: "blur(12px)" });
  });

  it("blur lg aplica backdropFilter de 20px via style inline", () => {
    render(<GlassCard blur="lg">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card).toHaveStyle({ backdropFilter: "blur(20px)" });
  });

  it("blur por defecto (md) aplica backdropFilter de 12px", () => {
    render(<GlassCard>Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card).toHaveStyle({ backdropFilter: "blur(12px)" });
  });
});

// ---------------------------------------------------------------------------
// Tests de prop opacity (transparencia del fondo)
// ---------------------------------------------------------------------------

describe("GlassCard — prop opacity", () => {
  it("opacity 0.7 por defecto aplica background con rgba correcto", () => {
    render(<GlassCard>Contenido</GlassCard>);
    const card = screen.getByRole("region");
    // El background usa rgba(var(--surface-rgb), 0.7)
    const style = card.getAttribute("style") ?? "";
    expect(style).toContain("0.7");
  });

  it("opacity personalizado se refleja en el style inline", () => {
    render(<GlassCard opacity={0.9}>Contenido</GlassCard>);
    const card = screen.getByRole("region");
    const style = card.getAttribute("style") ?? "";
    expect(style).toContain("0.9");
  });

  it("opacity 0 (completamente transparente) se aplica sin error", () => {
    render(<GlassCard opacity={0}>Contenido</GlassCard>);
    const card = screen.getByRole("region");
    const style = card.getAttribute("style") ?? "";
    expect(style).toContain(", 0)");
  });
});

// ---------------------------------------------------------------------------
// Tests de prop shadow
// ---------------------------------------------------------------------------

describe("GlassCard — prop shadow", () => {
  it("shadow none no aplica clase de sombra", () => {
    render(<GlassCard shadow="none">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).not.toContain("shadow-card");
    expect(card.className).not.toContain("shadow-ambient");
    expect(card.className).not.toContain("shadow-elevated");
  });

  it("shadow card aplica clase shadow-card", () => {
    render(<GlassCard shadow="card">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).toContain("shadow-card");
  });

  it("shadow ambient aplica clase shadow-ambient", () => {
    render(<GlassCard shadow="ambient">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).toContain("shadow-ambient");
  });

  it("shadow elevated aplica clase shadow-elevated", () => {
    render(<GlassCard shadow="elevated">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).toContain("shadow-elevated");
  });
});

// ---------------------------------------------------------------------------
// Tests de prop padding
// ---------------------------------------------------------------------------

describe("GlassCard — prop padding", () => {
  it("padding none aplica clase p-0", () => {
    render(<GlassCard padding="none">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).toContain("p-0");
  });

  it("padding sm aplica clase p-4", () => {
    render(<GlassCard padding="sm">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).toContain("p-4");
  });

  it("padding md aplica clase p-6", () => {
    render(<GlassCard padding="md">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).toContain("p-6");
  });

  it("padding lg aplica clase p-8", () => {
    render(<GlassCard padding="lg">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).toContain("p-8");
  });
});

// ---------------------------------------------------------------------------
// Tests de prop className (composicion externa)
// ---------------------------------------------------------------------------

describe("GlassCard — prop className", () => {
  it("clase adicional se fusiona con las clases base", () => {
    render(<GlassCard className="mi-clase-personalizada">Contenido</GlassCard>);
    const card = screen.getByRole("region");
    expect(card.className).toContain("mi-clase-personalizada");
    expect(card.className).toContain("rounded-[var(--radius-xl)]");
  });
});

// ---------------------------------------------------------------------------
// Tests de accesibilidad (A11y)
// ---------------------------------------------------------------------------

describe("GlassCard — accesibilidad", () => {
  it("admite multiples hijos sin error", () => {
    render(
      <GlassCard>
        <h2>Titulo</h2>
        <p>Parrafo de contenido</p>
        <button>Accion</button>
      </GlassCard>
    );
    expect(screen.getByText("Titulo")).toBeInTheDocument();
    expect(screen.getByText("Parrafo de contenido")).toBeInTheDocument();
    expect(screen.getByText("Accion")).toBeInTheDocument();
  });

  it("el contenedor tiene role region para navegacion por lectores de pantalla", () => {
    const { getAllByRole } = render(
      <>
        <GlassCard>Card 1</GlassCard>
        <GlassCard>Card 2</GlassCard>
      </>
    );
    const regions = getAllByRole("region");
    expect(regions).toHaveLength(2);
  });
});
