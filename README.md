# tauri-template

A reusable, cross-platform desktop app starter built on **[Tauri 2](https://tauri.app/) + Rust** with a **React + Vite + TypeScript** frontend, styled with **Tailwind CSS v4 + shadcn/ui**, and managed with **pnpm**. Clone it, rename it, and start building.

It ships a small but complete example: multi-window hash routing, a Rust command invoked from the UI, persistent storage, structured logging, and the native macOS **liquid glass** effect — all wired up and ready to extend.

## Features

- **Tauri 2** desktop shell with a Rust backend (`src-tauri/`).
- **React 19 + Vite 7 + TypeScript** frontend with the `@ → src` path alias and strict type-checking.
- **Tailwind CSS v4** (via `@tailwindcss/vite`) and **shadcn/ui** (new-york style, `neutral` base, dark mode by default).
- **Multi-window, one bundle** — every window loads the same `index.html` and is routed by hash with [wouter](https://github.com/molefrog/wouter).
- **[zustand](https://github.com/pmndrs/zustand)** for state management (installed, ready to use).
- Preconfigured Tauri plugins: `opener`, `log`, `store`, `shell`, and [`liquid-glass`](https://github.com/hkandala/tauri-plugin-liquid-glass).
- Example windows: an opaque **main** window and an on-demand transparent **liquid glass** window.
- `prettier` + `cargo fmt` formatting and `pnpm` scripts for the common workflows.

## Prerequisites

- **Rust toolchain** — install via [rustup](https://rustup.rs/).
- **Node.js 20+** and **pnpm** (`npm i -g pnpm`).
- **Tauri system dependencies** for your OS — see the [Tauri prerequisites](https://tauri.app/start/prerequisites/) (Xcode Command Line Tools on macOS, WebView2 + C++ build tools on Windows, `webkit2gtk` on Linux).

## Quick start

```bash
pnpm install          # install frontend deps (Rust crates build on first run)
pnpm tauri dev        # run the app in development with hot reload
pnpm tauri build      # build a production bundle (.app + .dmg on macOS)
```

Other useful scripts:

```bash
pnpm build            # frontend only: tsc (strict) + vite build
pnpm format           # prettier (frontend) + cargo fmt (rust)
pnpm format:check     # prettier check without writing
pnpm update-deps      # update pnpm + cargo dependencies

pnpm dlx shadcn@latest add <component>   # add a shadcn/ui component
```

## Project structure

```
├── index.html                     # <html class="dark">, mounts the app
├── components.json                # shadcn config
├── vite.config.ts                 # @ alias + tailwind plugin
├── src/
│   ├── main.tsx                   # entry; imports App.css
│   ├── App.tsx                    # wouter hash router + window drag region
│   ├── App.css                    # tailwind + shadcn theme tokens
│   ├── lib/utils.ts               # cn() helper
│   ├── components/
│   │   ├── ui/button.tsx          # shadcn component
│   │   └── window-content.tsx     # shared centered content
│   └── windows/
│       ├── main-window.tsx        # /main route
│       └── glass-window.tsx       # /glass route (applies liquid glass)
└── src-tauri/
    ├── Cargo.toml                 # rust deps
    ├── tauri.conf.json            # window config + macOSPrivateApi
    ├── capabilities/default.json  # plugin permissions per window
    └── src/lib.rs                 # plugin registration + commands
```

## How it works

- **One bundle, many windows, routed by hash.** Each window loads the same `index.html` at a different hash; `src/App.tsx` uses wouter's `useHashLocation` to render the match (`#/main` → `MainWindow`, `#/glass` → `GlassWindow`).
- **On launch only `main` opens** (declared in `src-tauri/tauri.conf.json`). The glass window is created on demand by the `open_glass_window` Rust command in `src-tauri/src/lib.rs`, invoked from the UI via `invoke("open_glass_window")`.
- **Overlay title bars + dragging.** Both windows hide the native title bar, so `App.tsx` renders a top `data-tauri-drag-region` strip (which needs `core:window:allow-start-dragging` in the capability).
- **Dark mode + transparency.** Dark is the default via `<html class="dark">`; `html`/`body` are kept transparent so the glass window shows the desktop through it — so each route paints its own background.
- **Capabilities.** `src-tauri/capabilities/default.json` grants both windows the default permissions for every plugin.

### Adding a window

1. Add a `<Route path="/<route>">` in `src/App.tsx`.
2. Add the window's `label` to `windows[]` in `src-tauri/capabilities/default.json` (otherwise it has no permissions).
3. Open it — either declare it in `app.windows[]` in `tauri.conf.json` (opens on launch) or build it on demand (copy the `open_glass_window` command).

### Adding a plugin

Register the Rust plugin in `src-tauri/src/lib.rs` and add its `<plugin>:default` (or a more specific) permission to `src-tauri/capabilities/default.json`.

## Use it as a template

1. Click **Use this template** on GitHub (or clone and reinitialize git).
2. Rename the project — search and replace `tauri-template`:
   - `name` in `package.json`
   - `package.name` and `lib.name` (`tauri_template_lib`) in `src-tauri/Cargo.toml`
   - `productName` and `identifier` (`com.hkandala.tauri-template`) in `src-tauri/tauri.conf.json`
   - `<title>` in `index.html`, plus the headings in `AGENTS.md` and this README
3. Replace the icons in `src-tauri/icons/` (regenerate with `pnpm tauri icon <path-to-png>`).
4. Remove the example `glass` window if you don't need it.

## Notes

- The full **liquid glass** effect targets **macOS 26+**; older macOS falls back to `NSVisualEffectView` vibrancy, and non-macOS platforms treat the glass calls as safe no-ops. Everything else is cross-platform.
- `AGENTS.md` documents the architecture and conventions for AI coding agents working in the repo.
