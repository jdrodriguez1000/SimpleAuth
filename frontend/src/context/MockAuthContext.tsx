// [TSK-F-03.2] - Mock Auth Context: flag simple de autenticación para prototipo (f1_1.1_plan.md §3 B1)
// Habilita la navegación hacia AppLayout sin backend real.
// En Fase 4 este contexto se reemplazará por el provider de sesión real.

"use client";

import { createContext, useContext } from "react";

// --- Tipos del contexto ---

interface MockAuthContextValue {
  /** Siempre true en el prototipo. En Fase 4 será gestionado por el backend. */
  isMockAuthenticated: boolean;
}

// --- Creación del contexto ---

const MockAuthContext = createContext<MockAuthContextValue>({
  isMockAuthenticated: true,
});

// --- Provider ---

interface MockAuthProviderProps {
  children: React.ReactNode;
}

function MockAuthProvider({ children }: MockAuthProviderProps) {
  // Valor fijo para el prototipo: usuario siempre autenticado
  const value: MockAuthContextValue = {
    isMockAuthenticated: true,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}

// --- Hook de consumo ---

function useMockAuth(): MockAuthContextValue {
  return useContext(MockAuthContext);
}

export { MockAuthProvider, useMockAuth };
export type { MockAuthContextValue };
