# tauri-template

A minimal, reusable [Tauri v2](https://tauri.app/) desktop boilerplate: **React + TypeScript + Vite** on the frontend, Rust on the backend, with Tailwind CSS + shadcn/ui, multi-window hash routing, and the native macOS **liquid glass** effect wired up.

On launch it opens **two windows**, each rendered from the same bundle by a different hash route:

- **`#/main`** — a regular (opaque) window.
- **`#/glass`** — a transparent window with the native macOS liquid glass effect.

Both show centered text and a button that opens the Tauri docs in the browser.

## Stack

### Frontend (TypeScript)

| Dependency                                                                               | Purpose                                                             | Docs                                                                             |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript                     | App scaffold (`pnpm create tauri-app`, `react-ts` template)         | [create-tauri-app](https://tauri.app/start/create-project/)                      |
| [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)                        | Styling, via the Vite plugin                                        | [Tailwind + Vite](https://tailwindcss.com/docs/installation/using-vite)          |
| [shadcn/ui](https://ui.shadcn.com/)                                                      | Component library (`new-york` style, `neutral` base, CSS variables) | [shadcn Vite guide](https://ui.shadcn.com/docs/installation/vite)                |
| [wouter](https://github.com/molefrog/wouter)                                             | Tiny router — one hash route per window                             | [hash routing](https://github.com/molefrog/wouter#customizing-the-location-hook) |
| [zustand](https://github.com/pmndrs/zustand)                                             | State management (installed; no store created yet)                  | [docs](https://zustand.docs.pmnd.rs/)                                            |
| `@tauri-apps/plugin-{opener,log,store,shell}`                                            | JS bindings for the Tauri plugins                                   | [Tauri plugins](https://tauri.app/plugin/)                                       |
| [`tauri-plugin-liquid-glass-api`](https://github.com/hkandala/tauri-plugin-liquid-glass) | JS bindings for the liquid glass effect                             | [plugin repo](https://github.com/hkandala/tauri-plugin-liquid-glass)             |

### Backend (Rust)

| Crate                                                                                | Purpose                                                                 | Docs                                                                 |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `tauri` (feature `macos-private-api`)                                                | Core; the feature enables transparent windows + private macOS APIs      | [Tauri](https://tauri.app/)                                          |
| [`tauri-plugin-opener`](https://tauri.app/plugin/opener/)                            | Open URLs / files in the default app                                    | [docs](https://tauri.app/plugin/opener/)                             |
| [`tauri-plugin-log`](https://tauri.app/plugin/logging/)                              | Logging to stdout, webview console, and file                            | [docs](https://tauri.app/plugin/logging/)                            |
| [`tauri-plugin-store`](https://tauri.app/plugin/store/)                              | Persistent JSON key/value store                                         | [docs](https://tauri.app/plugin/store/)                              |
| [`tauri-plugin-shell`](https://tauri.app/plugin/shell/)                              | Spawn shell commands / child processes                                  | [docs](https://tauri.app/plugin/shell/)                              |
| [`tauri-plugin-liquid-glass`](https://github.com/hkandala/tauri-plugin-liquid-glass) | Native macOS 26+ liquid glass (falls back to vibrancy; no-op off macOS) | [plugin repo](https://github.com/hkandala/tauri-plugin-liquid-glass) |

## How it's wired

- **Path alias** `@ -> src` is set in both `vite.config.ts` and `tsconfig.json`.
- **Tailwind v4** is enabled by the `@tailwindcss/vite` plugin; global styles + the shadcn theme tokens live in `src/App.css` (imported in `src/main.tsx`).
- **shadcn/ui** is configured via `components.json`; components go in `src/components/ui`. Add more with the CLI (see below).
- **Dark mode is the default** — `<html class="dark">` in `index.html` applies the shadcn dark tokens. The document background is kept transparent so the glass window shows through; each route paints its own background (the main window uses `bg-background`).
- **Windows + routing:** both windows are declared statically in `src-tauri/tauri.conf.json` with a hash URL (`index.html#/main`, `index.html#/glass`). `src/App.tsx` uses wouter's `useHashLocation` hook to render the matching component. To add a window: add an entry to the `windows` array, add its label to `src-tauri/capabilities/default.json`, and add a `<Route>` in `App.tsx`.
- **Rust plugins** are registered in `src-tauri/src/lib.rs`; the log plugin defaults to `Info`.
- **Capabilities:** `src-tauri/capabilities/default.json` grants both windows (`["main", "glass"]`) the default permissions for every plugin, including `liquid-glass:default`.
- **Liquid glass** is applied from the frontend in `src/windows/glass-window.tsx` via `setLiquidGlassEffect(...)`, which targets the current window automatically.
- Uses the **default Tauri app icons** from the scaffold.

## Project structure

```
├── index.html                     # <html class="dark">, mounts the app
├── components.json                # shadcn config
├── vite.config.ts                 # @ alias + tailwind plugin
├── src/
│   ├── main.tsx                   # entry; imports App.css
│   ├── App.tsx                    # wouter hash router
│   ├── App.css                    # tailwind + shadcn theme tokens
│   ├── lib/utils.ts               # cn() helper
│   ├── components/
│   │   ├── ui/button.tsx          # shadcn component
│   │   └── window-content.tsx     # shared centered text + docs button
│   └── windows/
│       ├── main-window.tsx        # /main route
│       └── glass-window.tsx       # /glass route (applies liquid glass)
└── src-tauri/
    ├── Cargo.toml                 # rust deps
    ├── tauri.conf.json            # two-window config + macOSPrivateApi
    ├── capabilities/default.json  # permissions for both windows
    └── src/lib.rs                 # plugin registration
```

## Commands

```bash
pnpm install          # install deps
pnpm tauri dev        # run the app in dev
pnpm tauri build      # build the app bundle (.app + .dmg on macOS)
pnpm build            # frontend only (tsc + vite build)
pnpm format           # prettier (frontend) + cargo fmt (rust)

# add more shadcn components
pnpm dlx shadcn@latest add <component>
```

## Requirements

- Node + pnpm, and the [Rust toolchain](https://tauri.app/start/prerequisites/).
- The full liquid glass effect needs **macOS 26+**; older macOS falls back to `NSVisualEffectView`, and non-macOS platforms treat the glass calls as safe no-ops.
