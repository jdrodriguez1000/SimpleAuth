---
name: ui-design-audit
description: Protocolo técnico de auditoría de UI/UX, validación de jerarquía visual y cumplimiento del sistema de diseño pragmático.
user-invocable: false
agent: ui-consistency-manager
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---


# Protocolo de Auditoría Visual y Coherencia de Interfaz (UI/UX)
Este skill define el procedimiento técnico para certificar que la interfaz de SimpleAuth cumple con los estándares de diseño "Premium UI" definidos en CLAUDE.md. Su objetivo es eliminar la inconsistencia visual y garantizar una experiencia de usuario fluida y profesional.

## Paso 1 — Análisis de Coherencia Visual

Antes de emitir el reporte, verifica los nuevos componentes frontend creados (`app/components/`):
1.  **Colores**: ¿Se usan las variables de `tailwind.config.js`? ¿El contraste es accesible (WCAG 2.1)?
2.  **Tipografía**: ¿La jerarquía visual (h1, h2, body) es clara y armónica?
3.  **Espaciado**: ¿Se respeta el sistema de rejilla y el aire del diseño? (padding, margin, gap).
4.  **Iconografía**: ¿Los iconos (Lucide u otros) son consistentes en peso y estilo?


## Paso 2 — Auditoría de UX y Estado

Revisa los flujos de interacción:
1.  **Micro-interacciones**: ¿Tienen los botones estados de `hover`, `active` y `disabled`?
2.  **Feedback de Usuario**: ¿Cómo se muestran las alertas de éxito o error (Toasts)? ¿Son intrusivas?
3.  **Loading States**: ¿Existen esqueletos (skeletons) o spinners de calidad para acciones asíncronas?
4.  **Responsive Design**: Prueba el layout en anchos móviles (375px), tablet (768px) y desktop (1440px).


## Paso 3 — Inyección de Recomendaciones Estéticas

Si detectas un componente visualmente "básico" o con errores de UX:
1.  No modifiques el código.
2.  Redacta la **Recomendación Visual [UI-F-XX]** detallando el ajuste de clases Tailwind necesario.
3.  Reporta al **Frontend Reviewer**: "El diseño del componente [X] no cumple con el estándar premium."


## Paso 4 — Notificación y Emisión de Token de Diseño

**Opción A — Inconsistencia Detectada:**
1.  Reporte detallado de desviaciones visuales.
2.  Genera el token `.agents/tokens/consulting/ui_consistency_token.md` con estado `🚫 DISEÑO_RECHAZADO`.

**Opción B — UI Premium Certificada:**
1.  Si el diseño es de alta gama y consistente en todos los breakpoints.
2.  Genera el archivo `.agents/tokens/consulting/ui_consistency_token.md` con el siguiente contenido:

```markdown
# TOKEN: UI_CONSISTENTE_OK
- **Etapa**: [F].[E]
- **Componentes Auditados**: [lista de componentes]
- **Accesibilidad**: ✅ PASA (WCAG 2.1)
- **Responsive**: ✅ PASA (Desktop, Mobile)
- **Veredicto**: PREMIUM UI CERTIFIED
- **Fecha**: [YYYY-MM-DD]
```


## Reglas Innegociables

1.  **Cero Magic Numbers**: Prohibido usar valores arbitrarios de píxeles (ej. `w-[243px]`) si no están justificados excepcionalmente. Usar la escala de Tailwind.
2.  **Legibilidad de Contraste**: Si el texto sobre el fondo no tiene el contraste mínimo, el diseño se rechaza automáticamente.
3.  **No improvisar componentes**: Reusar componentes existentes del sistema de diseño siempre que sea posible.
4.  **Accesibilidad por favor**: Cada botón interactivo debe tener un foco (`outline`) visible por teclado.
5.  **Evitar el "Aburrimiento"**: Si la pantalla se ve como un MVP genérico de Bootstrap, solicita añadir sombras, gradientes sutiles o micro-animaciones.
6.  **Trazabilidad**: Relacionar cada reporte con un `[REQ-F-XX]` visual.
