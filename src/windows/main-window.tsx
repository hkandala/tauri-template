import { invoke } from "@tauri-apps/api/core";
import { error } from "@tauri-apps/plugin-log";

import { Button } from "@/components/ui/button";
import { WindowContent } from "@/components/window-content";

/**
 * The regular (opaque) window — the only window opened on launch. It fills
 * itself with the solid theme background and offers a button that asks the
 * Rust side to open (or focus) the liquid glass window.
 */
export function MainWindow() {
  const openGlassWindow = async () => {
    try {
      await invoke("open_glass_window");
    } catch (e) {
      error(`failed to open glass window: ${String(e)}`);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <WindowContent
        title="Main Window"
        subtitle="A regular Tauri window rendered on the /main route."
        actions={
          <Button onClick={openGlassWindow}>Open Liquid Glass Window</Button>
        }
      />
    </div>
  );
}
