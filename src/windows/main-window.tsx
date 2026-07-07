import { WindowContent } from "@/components/window-content";

/**
 * The regular (opaque) window. It fills itself with the solid theme background.
 */
export function MainWindow() {
  return (
    <div className="bg-background text-foreground">
      <WindowContent
        title="Main Window"
        subtitle="A regular Tauri window rendered on the /main route."
      />
    </div>
  );
}
