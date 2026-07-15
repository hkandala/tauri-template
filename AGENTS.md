# tauri-template

A Tauri v2 desktop starter: React + TS + Vite frontend, Rust backend. Tailwind v4 + shadcn/ui, wouter routing, zustand, and a set of Tauri plugins (opener, log, store, shell, liquid-glass). See `README.md` for the full stack. Keep changes minimal and idiomatic.

## Architecture

- **One bundle, many windows, routed by hash.** Each window loads the same `index.html` at a different hash and wouter renders the match. Routes live in `src/App.tsx` (`useHashLocation`).
- **On launch only `main` opens.** It's the sole entry in `src-tauri/tauri.conf.json` `app.windows[]` (hash `index.html#/main`, `Overlay` title bar). The `glass` window is created on demand by the `open_glass_window` Rust command in `src-tauri/src/lib.rs`, invoked from `main-window.tsx`.
- **Adding a window** (keep these in sync):
  1. `src/App.tsx` → add a `<Route path="/<route>">`.
  2. `src-tauri/capabilities/default.json` → add the `label` to `windows[]`, else the window has no permissions.
  3. Open it: either add an entry to `windows[]` in `tauri.conf.json` (opens on launch) or build it on demand — copy the `open_glass_window` command, or use the JS `WebviewWindow` API (which then needs `core:webview:allow-create-webview-window` in the capability).
- **Window dragging.** Both windows use an overlay title bar (no native drag strip), so `App.tsx` renders a top `data-tauri-drag-region` strip that applies to every route. It needs `core:window:allow-start-dragging` in the capability. Don't put interactive controls inside a drag region — clicks get swallowed by the drag.
- **Dark mode + transparency.** Dark is default via `<html class="dark">` in `index.html`. `html/body` are transparent (`src/App.css`) so the glass window shows the desktop through it — so **each route must paint its own background** (see `main-window.tsx` using `bg-background`). Don't add `bg-*` to `body`.
- **Liquid glass** is applied frontend-side in `src/windows/glass-window.tsx` via `setLiquidGlassEffect()` from `tauri-plugin-liquid-glass-api`; it targets the current window automatically. It needs the window built with `transparent(true)` (see `open_glass_window`) + `macOSPrivateApi: true` (already set). Full effect is macOS 26+; older macOS falls back to vibrancy; other platforms no-op.

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
