import { Router, Route, Switch, Redirect } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import { MainWindow } from "@/windows/main-window";
import { GlassWindow } from "@/windows/glass-window";

/**
 * Every Tauri window loads the same index.html and is routed by its hash.
 * The Rust side opens each window at a specific hash route (see tauri.conf.json),
 * and wouter's hash location hook renders the matching component:
 *
 *   index.html#/main   -> MainWindow  (regular window)
 *   index.html#/glass  -> GlassWindow (liquid glass window)
 */
export function App() {
  return (
    <>
      {/*
        Both windows use an overlay title bar with no native draggable strip,
        so this element provides the drag region. `data-tauri-drag-region` lets
        the user move the window by dragging it (and double-click to maximize).
        Living here in the app root, it applies to every window/route.
      */}
      <div data-tauri-drag-region className="fixed inset-x-0 top-0 z-50 h-7" />
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/main" component={MainWindow} />
          <Route path="/glass" component={GlassWindow} />
          {/* Fallback: anything else lands on the main window. */}
          <Route>
            <Redirect to="/main" />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
