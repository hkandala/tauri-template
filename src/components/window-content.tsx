import { openUrl } from "@tauri-apps/plugin-opener";
import { info } from "@tauri-apps/plugin-log";

import { Button } from "@/components/ui/button";

const TAURI_DOCS_URL = "https://tauri.app/";

type WindowContentProps = {
  title: string;
  subtitle: string;
};

/**
 * Shared centered content for each window: a title, a subtitle, and a button
 * that opens the Tauri docs in the user's default browser via the opener plugin.
 */
export function WindowContent({ title, subtitle }: WindowContentProps) {
  const openDocs = async () => {
    // tauri-plugin-log writes to stdout + the app log file.
    info(`opening ${TAURI_DOCS_URL}`);
    // tauri-plugin-opener launches the URL in the default browser.
    await openUrl(TAURI_DOCS_URL);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-8 text-center select-none">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Button onClick={openDocs}>Open Tauri Docs</Button>
    </div>
  );
}
