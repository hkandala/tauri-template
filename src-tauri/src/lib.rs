use tauri::{Manager, TitleBarStyle, WebviewUrl, WebviewWindowBuilder};

/// Opens the transparent liquid glass window (or focuses it if already open).
/// Invoked from the main window's frontend via `invoke("open_glass_window")`.
#[tauri::command]
fn open_glass_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("glass") {
        window.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }

    WebviewWindowBuilder::new(&app, "glass", WebviewUrl::App("index.html#/glass".into()))
        .title("Liquid Glass")
        .inner_size(500.0, 380.0)
        .center()
        .transparent(true)
        .decorations(true)
        .title_bar_style(TitleBarStyle::Overlay)
        .hidden_title(true)
        .build()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Opens files/URLs in the OS default application.
        .plugin(tauri_plugin_opener::init())
        // Spawns and manages child processes / shell commands.
        .plugin(tauri_plugin_shell::init())
        // Persistent key/value store backed by a JSON file.
        .plugin(tauri_plugin_store::Builder::new().build())
        // Structured logging to stdout, webview console, and the log file.
        // Default to Info so the noisy TRACE logs from tao/wry are filtered out.
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .build(),
        )
        // macOS liquid glass effect (no-op on other platforms).
        .plugin(tauri_plugin_liquid_glass::init())
        .invoke_handler(tauri::generate_handler![open_glass_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
