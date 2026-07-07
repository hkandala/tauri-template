# AGENTS.md

Guidance for AI agents working in this repo. Keep changes minimal and idiomatic — this is a boilerplate.

## What this is

A Tauri v2 desktop boilerplate: React + TS + Vite frontend, Rust backend. Tailwind v4 + shadcn/ui, wouter routing, zustand, and a set of Tauri plugins (opener, log, store, shell, liquid-glass). See `README.md` for the full stack.

## Architecture you must know

- **One bundle, many windows, routed by hash.** Each window loads the same `index.html` at a different hash and wouter renders the match. Windows are declared statically in `src-tauri/tauri.conf.json` (`app.windows[]`, each with `label` + `url: "index.html#/<route>"`). Routes live in `src/App.tsx` (`useHashLocation`).
- **Adding a window requires THREE edits** (keep them in sync):
  1. `src-tauri/tauri.conf.json` → new entry in `windows[]` with a unique `label` + hash `url`.
  2. `src-tauri/capabilities/default.json` → add the `label` to `windows[]`, else the window has no permissions.
  3. `src/App.tsx` → add a `<Route path="/<route>">`.
- **Dark mode + transparency.** Dark is default via `<html class="dark">` in `index.html`. `html/body` are transparent (`src/App.css`) so the glass window shows the desktop through it — so **each route must paint its own background** (see `main-window.tsx` using `bg-background`). Don't add `bg-*` to `body`.
- **Liquid glass** is applied frontend-side in `src/windows/glass-window.tsx` via `setLiquidGlassEffect()` from `tauri-plugin-liquid-glass-api`; it targets the current window automatically. It needs `transparent: true` on the window (config) + `macOSPrivateApi: true` (already set). Full effect is macOS 26+; older macOS falls back to vibrancy; other platforms no-op.

## Conventions

- Import via the `@` alias (`@/components/...`, `@/lib/utils`), not relative paths.
- Add UI components with the CLI: `pnpm dlx shadcn@latest add <component>` (config in `components.json`, output in `src/components/ui`).
  - Note: the shadcn CLI's `-b` flag now means the component library (`radix`/`base`), not base color. This repo's theme is committed in `src/App.css`, so `add` just needs `components.json` — no re-init required.
- Merge classes with `cn()` from `@/lib/utils`.
- Rust plugins are registered in `src-tauri/src/lib.rs`. A new plugin also needs its `<plugin>:default` (or specific) permission added to `capabilities/default.json`.
- zustand is installed but unused — create stores under `src/store/` when needed.

## Workflow

- Dev: `pnpm tauri dev`. Full build: `pnpm tauri build` (outputs `.app` + `.dmg` under `src-tauri/target/release/bundle/`).
- Always run `pnpm format` before finishing (prettier + `cargo fmt`).
- Frontend typecheck/build: `pnpm build` (runs `tsc` — strict, with `noUnusedLocals`/`noUnusedParameters`, so no dead vars).
- To verify runtime behavior without a GUI, run the built binary briefly and grep its stdout — `tauri-plugin-log` prints `INFO`+ there (e.g. the glass window logs `liquid glass supported: <bool>`).

## Gotchas

- This targets macOS (private API + glass). It builds/runs elsewhere but glass is a no-op and transparency support varies.
- Keep the log level (`Info`) in `lib.rs` — `Trace`/`Debug` floods stdout with tao/wry internals.
