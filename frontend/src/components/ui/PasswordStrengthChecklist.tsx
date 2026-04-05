// [REQ-F-01] - Componente reutilizable de feedback visual de seguridad de contraseña
// [TSK-F-15] - Extracción de PasswordStrengthChecklist a componente propio (eliminación de deuda técnica O-4)
// Patrón consistente con /auth/register, /auth/reset-password y /profile/security (SPEC v1.3.0)

// --- Interfaz de props ---

export interface PasswordStrengthProps {
  password: string;
}

// --- Definición de reglas de seguridad ---

interface PasswordCheck {
  label: string;
  passed: boolean;
}

function buildChecks(password: string): PasswordCheck[] {
  return [
    {
      label: "Mínimo 8 caracteres",
      passed: password.length >= 8,
    },
    {
      label: "Al menos una mayúscula",
      passed: /[A-Z]/.test(password),
    },
    {
      label: "Al menos un número",
      passed: /[0-9]/.test(password),
    },
    {
      label: "Al menos un carácter especial (!@#$%^&*)",
      passed: /[!@#$%^&*]/.test(password),
    },
  ];
}

// --- Componente principal ---

/**
 * PasswordStrengthChecklist — muestra en tiempo real el cumplimiento de las
 * 4 reglas de seguridad de contraseña definidas en SPEC v1.3.0.
 * No depende de React Hook Form ni de Framer Motion.
 * Todos los colores usan tokens CSS del Design System (var(--*)).
 */
export function PasswordStrengthChecklist({ password }: PasswordStrengthProps) {
  const checks = buildChecks(password);

  return (
    <ul className="mt-2 space-y-1" aria-label="Requisitos de contraseña">
      {checks.map(({ label, passed }) => (
        <li key={label} className="flex items-center gap-1.5">
          {passed ? (
            // Ítem cumplido: checkmark verde (token --success del Design System)
            <svg
              className="h-3.5 w-3.5 shrink-0 text-[var(--success)]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // Ítem pendiente: ✗ tonal
            <svg
              className="h-3.5 w-3.5 shrink-0 text-[var(--foreground)] opacity-40"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span
            className={
              passed
                ? "text-body-sm text-[var(--success)]"
                : "text-body-sm text-[var(--foreground)] opacity-50"
            }
          >
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
