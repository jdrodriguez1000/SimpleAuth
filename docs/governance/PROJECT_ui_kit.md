# PROJECT: SimpleAuth - UI Kit & Design System (v1.1.0)

> [!IMPORTANT]
> **Creative North Star**: "The Intelligent Monolith"
> **Core Aesthetic**: Editorial, High-End, Architectural Workspace.
> **Philosophy**: Tonal Layering over Rigid Borders.

---

## 1. Palette & Surface Hierarchy (Functional Tones)

Utilizamos una escala de grises neutros y azules profundos para garantizar legibilidad y una transición perfecta entre Modo Día y Noche.

| Token | Light Mode (Hex) | Dark Mode (Hex) | Purpose |
| :--- | :--- | :--- | :--- |
| `surface` | #f9f9fe | #0c0e12 | Base background layer. |
| `surface-container-low` | #f3f3fa | #14171c | Large sidebars or background shifts. |
| `surface-container` | #ecedf6 | #1a1e24 | Main data workspaces / forms. |
| `surface-container-high` | #e6e8f1 | #22272e | Hover states / separators. |
| `surface-container-highest`| #e0e2ec | #2b313a | Interactive inputs / focused cards. |
| `primary` | #005eb6 | #5f9efb | Main CTA and Brand identity. |
| `primary-gradient` | Linear 135º (#005eb6 -> #5f9efb) | Same | Success/Primary actions. |

---

## 2. The "Atomic Design Rules" (Horizon Style)

### 2.1 The "No-Line" Rule
Está **prohibido** el uso de bordes sólidos de 1px (`border-gray-200`) para separar secciones. La delimitación debe lograrse exclusivamente mediante cambios de tono de superficie (ej. una tarjeta `surface-container-lowest` sobre un fondo `surface-container-low`).

### 2.2 Tonal Layering
La profundidad se maneja por capas táctiles, no decorativas:
1.  **Capa Base**: Pantalla completa.
2.  **Capa Layout**: Paneles laterales (Sidebars).
3.  **Capa Workspace**: Área de contenido principal.
4.  **Capa Elevada**: Modales y Tooltips (con sombras ambientales difusas).

### 2.3 Shadow Strategy (Ambient Shadows)
No usar sombras negras puras. Las sombras deben estar tintadas con el color primario:
- `box-shadow`: `0 12px 40px rgba(0, 41, 86, 0.08)` (Ligera tonalidad azul).

---

## 3. Typography (Editorial Scale)

Utilizamos un enfoque de fuente dual para equilibrar autoridad y legibilidad técnica.

*   **Display & Headlines (Manrope)**: Precisión geométrica.
    - `headline-lg`: 2.25rem (Bold).
    - `headline-md`: 1.5rem (Semibold).
*   **Body & Labels (Inter)**: Legibilidad máxima.
    - `body-md`: 0.875rem (Normal).
    - `label-sm`: 0.75rem (Semibold/Uppercase para etiquetas de formularios).

---

## 4. Components & Interactive States

### 4.1 Buttons (Editorial CTAs)
- **Primary**: Relleno con gradiente lineal a 135º. Sin bordes visibles. Radius: `0.5rem` (8px).
- **Secondary**: Sin fondo ni borde. Hover con fondo `surface-container-high`.
- **States**: `hover:scale-[0.99]` y `active:scale-[0.97]` para feedback táctil subconsciente.

### 4.2 Form Inputs (Ghost Borders)
- **Styling**: Fondo `surface-container-highest` con bordes suaves (`0.5rem`).
- **Focus State**: Borde de 2px en `primary` al 40% de opacidad. Sin "glows" pesados.

### 4.3 Navigation (Sidebar)
- **Active State**: Indicador vertical tipo "píldora" (4px ancho) en color `primary` en el borde izquierdo. El texto cambia de peso a Semibold.

---

## 5. Theme Switching Strategy (CC-001)

- **Persistence**: La elección del tema se guarda en `LocalStorage`.
- **Implementation**: Utilizar `next-themes` con estrategia de clases en Tailwind.
- **Visual Contrast**: El cambio de tema no debe ser binario (Blanco/Negro), sino un despliegue de las escalas tonales definidas en la Sección 1.
