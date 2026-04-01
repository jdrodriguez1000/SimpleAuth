---
description: Flujo de trabajo estructurado para manejar la subida del repositorio a GitHub y la creación de Pull Requests.
---

# Workflow: Git Push y PR

Sigue este flujo secuencial y sistemático cada vez que manejes publicación de código o repositorios.

## Paso 1 — Diagnóstico de Higiene y Topología
Ejecuta de inmediato estos comandos para entender el estado y la "salud" del repo:
```bash
git status
git remote -v
git branch -a
git log --oneline -5
```

**Tarea Crítica de Auditoría (Higiene):**
- Analiza la salida de `git status`. Si ves archivos que NO deberían estar en el repositorio (ej. `.env`, temporales como `temp.md`, o el blueprint original `BluePrint - Alto nivel.txt`):
  - **ACCIÓN**: Registra el archivo en el `.gitignore` y sácalo del índice con `git rm --cached [archivo]`.
- **¿Working tree sucio?** → **ALERTA Y DETENTE**. Solicita al usuario que haga commit a sus cambios pendientes antes de cualquier push.
- **¿No existe `origin`?** → Ve explícitamente al **Paso 2A**.
- **¿Ya existe `origin`?** → Ve explícitamente al **Paso 2B**.

## Paso 2A — Configuración inicial (remoto no existe)
1. Solicita explícita pero amablemente la URL: "¿Cuál es la URL de tu repositorio GitHub origin?".
2. Aplica la configuración: `git remote add origin [URL]` y lista de nuevo `git branch`.
3. Informa al usuario: "Estoy a punto de subir las ramas X y Y al remoto." y obtén una **confirmación explícita activa**.
4. Tras confirmación, ejecuta un tracking push primario: `git push -u origin main` (y para las `feat/*` activas si autorizó). Ve al Paso 3.

## Paso 2B — Push a repositorio ya configurado
Identifica la rama activa actual y su rol:
- **Si es `main` o `dev`**: Detente. Analiza los commits (`git log`). Si son estrictamente documentación (`docs:`), emite un warning informativo, y sube. Si encuentras código funcional, **BLOQUEA** e informa que esto viola la gobernanza de `CLAUDE.md`. Exige rebase local de los commits en una rama `feat/f[F]_[E]_*`.
- **Si es `feat/f[F]_[E]_*`**: Subida estándar autorizada. Invoca el update `git fetch` e informa de colisiones si hay divergencia.
- Genera el push: `git push -u origin [rama]`.

Si se subió código nuevo a una rama temporal y se asume terminada la etapa:
- Ofrece o ejecuta directamente la creación de un PR usando GitHub CLI (`gh pr create`) utilizando este cuerpo base (ESPAÑOL):
```
## Qué hace este cambio
[Descripción breve en español sobre la funcionalidad implementada]

## Cómo probarlo
- [ ] Ejecutar pytest (`pipeline/tests/`).
- [ ] Validar flujos descritos en la SPEC de la etapa.
🤖 Generado por Agente AnyLott.
```

## Paso 3 — Verificación post-push
Termina tu ciclo de ejecución verificando que GitHub efectivamente emparejó los historiales.
Verifica: `git log --oneline origin/[rama] -3`.

Cierra tu intervención con un reporte exitoso a nivel terminal:
```
✅ Push completado con éxito.
   Rama:               [nombre]
   Último commit:      [hash] [mensaje]
```
