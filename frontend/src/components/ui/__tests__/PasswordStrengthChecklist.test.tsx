// [TSK-F-15.1] — Tests de componente PasswordStrengthChecklist (lógica de reglas de seguridad)
// Valida renderizado, lógica de las 4 reglas, estados passed/failed y accesibilidad

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PasswordStrengthChecklist } from "../PasswordStrengthChecklist";

// ---------------------------------------------------------------------------
// Tests de renderizado base
// ---------------------------------------------------------------------------

describe("PasswordStrengthChecklist — renderizado base", () => {
  it("renderiza sin errores con contraseña vacía", () => {
    const { container } = render(<PasswordStrengthChecklist password="" />);
    expect(container).toBeTruthy();
  });

  it("renderiza exactamente 4 ítems de regla", () => {
    render(<PasswordStrengthChecklist password="" />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
  });

  it("renderiza la lista con aria-label de accesibilidad", () => {
    render(<PasswordStrengthChecklist password="" />);
    const list = screen.getByRole("list", { name: "Requisitos de contraseña" });
    expect(list).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Tests de visibilidad de las 4 reglas
// ---------------------------------------------------------------------------

describe("PasswordStrengthChecklist — visibilidad de reglas", () => {
  it("muestra la regla de mínimo 8 caracteres", () => {
    render(<PasswordStrengthChecklist password="" />);
    expect(screen.getByText("Mínimo 8 caracteres")).toBeInTheDocument();
  });

  it("muestra la regla de al menos una mayúscula", () => {
    render(<PasswordStrengthChecklist password="" />);
    expect(screen.getByText("Al menos una mayúscula")).toBeInTheDocument();
  });

  it("muestra la regla de al menos un número", () => {
    render(<PasswordStrengthChecklist password="" />);
    expect(screen.getByText("Al menos un número")).toBeInTheDocument();
  });

  it("muestra la regla de al menos un carácter especial", () => {
    render(<PasswordStrengthChecklist password="" />);
    expect(screen.getByText("Al menos un carácter especial (!@#$%^&*)")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Tests de regla: longitud mínima (8 caracteres)
// ---------------------------------------------------------------------------

describe("PasswordStrengthChecklist — regla longitud mínima", () => {
  it("regla de longitud falla con contraseña vacía", () => {
    render(<PasswordStrengthChecklist password="" />);
    const span = screen.getByText("Mínimo 8 caracteres");
    expect(span.className).toContain("opacity-50");
    expect(span.className).not.toContain("text-[var(--success)]");
  });

  it("regla de longitud falla con contraseña de 7 caracteres", () => {
    render(<PasswordStrengthChecklist password="Abcde1!" />);
    const span = screen.getByText("Mínimo 8 caracteres");
    expect(span.className).toContain("opacity-50");
  });

  it("regla de longitud pasa con contraseña de exactamente 8 caracteres", () => {
    render(<PasswordStrengthChecklist password="Abcdef1!" />);
    const span = screen.getByText("Mínimo 8 caracteres");
    expect(span.className).toContain("text-[var(--success)]");
    expect(span.className).not.toContain("opacity-50");
  });

  it("regla de longitud pasa con contraseña de más de 8 caracteres", () => {
    render(<PasswordStrengthChecklist password="Abcdefghij1!" />);
    const span = screen.getByText("Mínimo 8 caracteres");
    expect(span.className).toContain("text-[var(--success)]");
  });
});

// ---------------------------------------------------------------------------
// Tests de regla: mayúscula
// ---------------------------------------------------------------------------

describe("PasswordStrengthChecklist — regla mayúscula", () => {
  it("regla de mayúscula falla con contraseña sin mayúsculas", () => {
    render(<PasswordStrengthChecklist password="abcde123!" />);
    const span = screen.getByText("Al menos una mayúscula");
    expect(span.className).toContain("opacity-50");
  });

  it("regla de mayúscula pasa con al menos una letra mayúscula", () => {
    render(<PasswordStrengthChecklist password="Abcde123!" />);
    const span = screen.getByText("Al menos una mayúscula");
    expect(span.className).toContain("text-[var(--success)]");
  });

  it("regla de mayúscula pasa con varias mayúsculas", () => {
    render(<PasswordStrengthChecklist password="ABCde123!" />);
    const span = screen.getByText("Al menos una mayúscula");
    expect(span.className).toContain("text-[var(--success)]");
  });
});

// ---------------------------------------------------------------------------
// Tests de regla: número
// ---------------------------------------------------------------------------

describe("PasswordStrengthChecklist — regla número", () => {
  it("regla de número falla con contraseña sin dígitos", () => {
    render(<PasswordStrengthChecklist password="Abcdefgh!" />);
    const span = screen.getByText("Al menos un número");
    expect(span.className).toContain("opacity-50");
  });

  it("regla de número pasa con al menos un dígito", () => {
    render(<PasswordStrengthChecklist password="Abcdefg1!" />);
    const span = screen.getByText("Al menos un número");
    expect(span.className).toContain("text-[var(--success)]");
  });

  it("regla de número pasa con múltiples dígitos", () => {
    render(<PasswordStrengthChecklist password="Abcd1234!" />);
    const span = screen.getByText("Al menos un número");
    expect(span.className).toContain("text-[var(--success)]");
  });
});

// ---------------------------------------------------------------------------
// Tests de regla: carácter especial
// ---------------------------------------------------------------------------

describe("PasswordStrengthChecklist — regla carácter especial", () => {
  it("regla de carácter especial falla con contraseña sin símbolos", () => {
    render(<PasswordStrengthChecklist password="Abcde123" />);
    const span = screen.getByText("Al menos un carácter especial (!@#$%^&*)");
    expect(span.className).toContain("opacity-50");
  });

  it("regla de carácter especial pasa con símbolo !", () => {
    render(<PasswordStrengthChecklist password="Abcde123!" />);
    const span = screen.getByText("Al menos un carácter especial (!@#$%^&*)");
    expect(span.className).toContain("text-[var(--success)]");
  });

  it("regla de carácter especial pasa con símbolo @", () => {
    render(<PasswordStrengthChecklist password="Abcde123@" />);
    const span = screen.getByText("Al menos un carácter especial (!@#$%^&*)");
    expect(span.className).toContain("text-[var(--success)]");
  });

  it("regla de carácter especial pasa con símbolo #", () => {
    render(<PasswordStrengthChecklist password="Abcde123#" />);
    const span = screen.getByText("Al menos un carácter especial (!@#$%^&*)");
    expect(span.className).toContain("text-[var(--success)]");
  });

  it("regla de carácter especial pasa con símbolo $", () => {
    render(<PasswordStrengthChecklist password="Abcde123$" />);
    const span = screen.getByText("Al menos un carácter especial (!@#$%^&*)");
    expect(span.className).toContain("text-[var(--success)]");
  });

  it("regla de carácter especial pasa con símbolo %", () => {
    render(<PasswordStrengthChecklist password="Abcde123%" />);
    const span = screen.getByText("Al menos un carácter especial (!@#$%^&*)");
    expect(span.className).toContain("text-[var(--success)]");
  });

  it("regla de carácter especial pasa con símbolo ^", () => {
    render(<PasswordStrengthChecklist password="Abcde123^" />);
    const span = screen.getByText("Al menos un carácter especial (!@#$%^&*)");
    expect(span.className).toContain("text-[var(--success)]");
  });

  it("regla de carácter especial pasa con símbolo &", () => {
    render(<PasswordStrengthChecklist password="Abcde123&" />);
    const span = screen.getByText("Al menos un carácter especial (!@#$%^&*)");
    expect(span.className).toContain("text-[var(--success)]");
  });

  it("regla de carácter especial pasa con símbolo *", () => {
    render(<PasswordStrengthChecklist password="Abcde123*" />);
    const span = screen.getByText("Al menos un carácter especial (!@#$%^&*)");
    expect(span.className).toContain("text-[var(--success)]");
  });

  it("regla de carácter especial falla con símbolo no incluido en el set", () => {
    // Guión bajo no está en el set [!@#$%^&*]
    render(<PasswordStrengthChecklist password="Abcde123_" />);
    const span = screen.getByText("Al menos un carácter especial (!@#$%^&*)");
    expect(span.className).toContain("opacity-50");
  });
});

// ---------------------------------------------------------------------------
// Tests de contraseña completa: todas las reglas pasan
// ---------------------------------------------------------------------------

describe("PasswordStrengthChecklist — contraseña que cumple todas las reglas", () => {
  const contraseniaValida = "Secure1!";

  it("todas las reglas muestran estado passed con contraseña válida", () => {
    render(<PasswordStrengthChecklist password={contraseniaValida} />);

    const reglas = [
      "Mínimo 8 caracteres",
      "Al menos una mayúscula",
      "Al menos un número",
      "Al menos un carácter especial (!@#$%^&*)",
    ];

    reglas.forEach((etiqueta) => {
      const span = screen.getByText(etiqueta);
      expect(span.className).toContain("text-[var(--success)]");
      expect(span.className).not.toContain("opacity-50");
    });
  });

  it("con contraseña válida se renderizan 4 SVG checkmark (paths de confirmación)", () => {
    const { container } = render(
      <PasswordStrengthChecklist password={contraseniaValida} />
    );
    // El SVG de checkmark contiene el path con fillRule evenodd y la curva del check
    const svgs = container.querySelectorAll("svg");
    // Los 4 SVGs deben existir
    expect(svgs).toHaveLength(4);
  });
});

// ---------------------------------------------------------------------------
// Tests de contraseña que no cumple ninguna regla
// ---------------------------------------------------------------------------

describe("PasswordStrengthChecklist — contraseña que no cumple ninguna regla", () => {
  const contraseniaNula = "";

  it("todas las reglas muestran estado failed con contraseña vacía", () => {
    render(<PasswordStrengthChecklist password={contraseniaNula} />);

    const reglas = [
      "Mínimo 8 caracteres",
      "Al menos una mayúscula",
      "Al menos un número",
      "Al menos un carácter especial (!@#$%^&*)",
    ];

    reglas.forEach((etiqueta) => {
      const span = screen.getByText(etiqueta);
      expect(span.className).toContain("opacity-50");
      expect(span.className).not.toContain("text-[var(--success)]");
    });
  });
});

// ---------------------------------------------------------------------------
// Tests de casos borde
// ---------------------------------------------------------------------------

describe("PasswordStrengthChecklist — casos borde", () => {
  it("contraseña solo de números: falla longitud si es corta, falla mayúscula y especial", () => {
    render(<PasswordStrengthChecklist password="1234" />);
    expect(screen.getByText("Mínimo 8 caracteres").className).toContain("opacity-50");
    expect(screen.getByText("Al menos una mayúscula").className).toContain("opacity-50");
    expect(screen.getByText("Al menos un número").className).toContain("text-[var(--success)]");
    expect(screen.getByText("Al menos un carácter especial (!@#$%^&*)").className).toContain("opacity-50");
  });

  it("contraseña solo de letras minúsculas: falla número, mayúscula y especial", () => {
    render(<PasswordStrengthChecklist password="abcdefgh" />);
    expect(screen.getByText("Mínimo 8 caracteres").className).toContain("text-[var(--success)]");
    expect(screen.getByText("Al menos una mayúscula").className).toContain("opacity-50");
    expect(screen.getByText("Al menos un número").className).toContain("opacity-50");
    expect(screen.getByText("Al menos un carácter especial (!@#$%^&*)").className).toContain("opacity-50");
  });

  it("contraseña de 7 caracteres con todo menos longitud: solo falla longitud", () => {
    render(<PasswordStrengthChecklist password="Abcde1!" />);
    expect(screen.getByText("Mínimo 8 caracteres").className).toContain("opacity-50");
    expect(screen.getByText("Al menos una mayúscula").className).toContain("text-[var(--success)]");
    expect(screen.getByText("Al menos un número").className).toContain("text-[var(--success)]");
    expect(screen.getByText("Al menos un carácter especial (!@#$%^&*)").className).toContain("text-[var(--success)]");
  });

  it("contraseña con espacios y sin símbolos del set: falla carácter especial", () => {
    render(<PasswordStrengthChecklist password="Abcde 1 " />);
    expect(screen.getByText("Al menos un carácter especial (!@#$%^&*)").className).toContain("opacity-50");
  });

  it("contraseña muy larga cumple todas las reglas", () => {
    render(<PasswordStrengthChecklist password="SuperSegura123!ExtraLarga" />);
    const reglas = [
      "Mínimo 8 caracteres",
      "Al menos una mayúscula",
      "Al menos un número",
      "Al menos un carácter especial (!@#$%^&*)",
    ];
    reglas.forEach((etiqueta) => {
      expect(screen.getByText(etiqueta).className).toContain("text-[var(--success)]");
    });
  });

  it("contraseña con solo el carácter especial requerido y sin nada más falla otras reglas", () => {
    render(<PasswordStrengthChecklist password="!" />);
    expect(screen.getByText("Mínimo 8 caracteres").className).toContain("opacity-50");
    expect(screen.getByText("Al menos una mayúscula").className).toContain("opacity-50");
    expect(screen.getByText("Al menos un número").className).toContain("opacity-50");
    expect(screen.getByText("Al menos un carácter especial (!@#$%^&*)").className).toContain("text-[var(--success)]");
  });
});

// ---------------------------------------------------------------------------
// Tests de accesibilidad (A11y)
// ---------------------------------------------------------------------------

describe("PasswordStrengthChecklist — accesibilidad", () => {
  it("la lista tiene aria-label descriptivo", () => {
    render(<PasswordStrengthChecklist password="" />);
    expect(
      screen.getByRole("list", { name: "Requisitos de contraseña" })
    ).toBeInTheDocument();
  });

  it("los SVG tienen aria-hidden=true para no contaminar lectores de pantalla", () => {
    const { container } = render(<PasswordStrengthChecklist password="Secure1!" />);
    const svgs = container.querySelectorAll("svg");
    svgs.forEach((svg) => {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("el texto de cada regla es legible directamente sin depender del SVG", () => {
    render(<PasswordStrengthChecklist password="" />);
    // Cada regla es identificable por su texto visible
    expect(screen.getByText("Mínimo 8 caracteres")).toBeVisible();
    expect(screen.getByText("Al menos una mayúscula")).toBeVisible();
    expect(screen.getByText("Al menos un número")).toBeVisible();
    expect(screen.getByText("Al menos un carácter especial (!@#$%^&*)")).toBeVisible();
  });

  it("actualizar la prop password no desmonta el componente (estabilidad de DOM)", () => {
    const { rerender } = render(<PasswordStrengthChecklist password="" />);
    rerender(<PasswordStrengthChecklist password="Secure1!" />);
    // Después del re-render las 4 reglas siguen presentes
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });
});
