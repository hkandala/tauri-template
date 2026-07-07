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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
