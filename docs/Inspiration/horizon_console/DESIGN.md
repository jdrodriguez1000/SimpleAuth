# Design System Document: The Architectural Dashboard

## 1. Overview & Creative North Star
**Creative North Star: "The Intelligent Monolith"**

This design system rejects the "widget-heavy" clutter of traditional dashboards in favor of an editorial, high-end workspace. We move beyond the "template" look by treating the UI as a single, cohesive architectural space. The system utilizes **Tonal Layering** and **Asymmetric Balance** to guide the eye, replacing rigid lines with breathing room and sophisticated depth. 

The goal is to provide a sense of "Quiet Authority." Data shouldn't shout; it should be curated within a landscape of frosted surfaces and intentional whitespace.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Professional Blue" core, but its strength lies in the nuanced neutral scale.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning. 
Boundaries must be defined solely through background color shifts. For example, a `surface_container_low` section sitting on a `surface` background provides all the definition needed. If you feel the urge to draw a line, add `1.4rem` (Spacing 4) of whitespace instead.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. Each layer represents a step closer to the user:
*   **Base Layer (`surface` / `background`):** The foundation of the screen.
*   **Secondary Layout (`surface_container_low`):** Used for large sidebars or footer areas.
*   **Active Workspaces (`surface_container`):** The primary area for data tables or forms.
*   **Interactive Elements (`surface_container_highest`):** High-priority cards or "active" states.

### The "Glass & Gradient" Rule
To inject "soul" into the professional aesthetic:
*   **Glassmorphism:** Use semi-transparent `surface_container_lowest` with a `backdrop-filter: blur(20px)` for floating navigation bars or modal headers.
*   **Signature Gradients:** For primary CTAs, use a subtle linear gradient from `primary` (#005eb6) to `primary_container` (#5f9efb) at a 135-degree angle. This breaks the "flatness" of standard SaaS tools.

---

## 3. Typography
We utilize a duo-font approach to balance authority with readability.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `headline-lg` and `headline-md` for page titles. Bold weights should be used sparingly to anchor the page.
*   **Body & Labels (Inter):** The workhorse. Inter provides exceptional legibility at the `body-md` (0.875rem) level for data-heavy forms.
*   **The Editorial Scale:** Create high contrast between titles and body. A `headline-lg` title should be immediately followed by `body-sm` metadata to create a "newspaper" style hierarchy that feels curated.

---

## 4. Elevation & Depth
Depth is a functional tool, not a decoration.

*   **Tonal Layering:** Avoid shadows for static cards. Instead, place a `surface_container_lowest` card on a `surface_container` background. This creates a "soft lift" that is easier on the eyes during long work sessions.
*   **Ambient Shadows:** For floating elements (Modals/Popovers), use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(0, 41, 86, 0.08)`. Notice the shadow is tinted with the `on_primary_fixed_variant` color rather than pure black to maintain color harmony.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use `outline_variant` at **20% opacity**. It should be felt, not seen.

---

## 5. Components

### Navigation Sidebar
*   **Structure:** No vertical divider. Use a `surface_container_low` background to distinguish the sidebar from the `surface` main content.
*   **Active State:** Avoid solid boxes. Use a vertical "pill" indicator (4px wide) in `primary` color on the left edge, with the menu text shifting to `primary` weight.

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `0.5rem` (8px) corner radius.
*   **Secondary:** No fill, no border. Use `surface_container_high` as a hover state background.
*   **Tertiary:** `label-md` uppercase with `0.175rem` letter spacing for a premium feel.

### Input Fields
*   **Styling:** Avoid "boxed" looks. Use a `surface_container_highest` background with a `0.5rem` radius.
*   **Focus State:** A 2px "Ghost Border" of `primary` at 40% opacity. No heavy glows.

### Cards & Data Lists
*   **Rule:** Forbid divider lines between list items. 
*   **Execution:** Use `2rem` (Spacing 6) of vertical whitespace between rows. For data tables, use alternating row tints of `surface_container_low` and `surface` to guide the eye.

### Selection Chips
*   **Style:** Pill-shaped (`9999px`).
*   **State:** Unselected chips should match the `surface_container_high` color to blend into the background, only "popping" when selected via the `primary_container` color.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Align primary data to the left and secondary "insights" to a narrower right column to create a sophisticated, non-grid feel.
*   **Embrace Negative Space:** Use `5.5rem` (Spacing 16) for page margins. Luxury is defined by the space you don't use.
*   **Tone-on-Tone:** Use `on_surface_variant` for helper text to reduce visual noise compared to pure `on_surface`.

### Don't:
*   **Don't use 1px Dividers:** They clutter the interface and create "visual friction." Use color shifts.
*   **Don't use Pure Black Shadows:** They look "muddy." Always tint shadows with a hint of the `primary` blue.
*   **Don't Over-round:** Stick strictly to the `0.5rem` (8px) for containers. Only use `full` (9999px) for status indicators or chips.