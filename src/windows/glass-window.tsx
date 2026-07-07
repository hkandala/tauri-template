import { useEffect } from "react";

import {
  setLiquidGlassEffect,
  isGlassSupported,
  GlassMaterialVariant,
} from "tauri-plugin-liquid-glass-api";
import { error, info } from "@tauri-apps/plugin-log";

import { WindowContent } from "@/components/window-content";

/**
 * The transparent, liquid-glass window rendered on the /glass route.
 *
 * The document stays transparent (see App.css), so the native macOS glass
 * effect applied by tauri-plugin-liquid-glass shows through. The effect targets
 * the current window automatically via Tauri's `getCurrentWindow()`.
 */
export function GlassWindow() {
  useEffect(() => {
    const apply = async () => {
      try {
        // On macOS 26+ this uses NSGlassEffectView; older macOS falls back to
        // NSVisualEffectView; other platforms are a safe no-op.
        const supported = await isGlassSupported();
        info(`liquid glass supported: ${supported}`);
        await setLiquidGlassEffect({
          cornerRadius: 16,
          variant: GlassMaterialVariant.Regular,
        });
      } catch (e) {
        error(`failed to apply liquid glass effect: ${String(e)}`);
      }
    };
    apply();
  }, []);

  return (
    <WindowContent
      title="Liquid Glass Window"
      subtitle="A transparent window with the native macOS liquid glass effect."
    />
  );
}
