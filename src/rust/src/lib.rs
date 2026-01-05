use wasm_bindgen::prelude::*;

mod scanner;
mod patterns;
mod entropy;

use scanner::Scanner;

/// Main entry point for JavaScript.
/// Scans the provided text for secrets and returns a ScanResult.
#[wasm_bindgen]
pub fn scan(text: &str) -> Result<JsValue, JsValue> {
    // Enable better panic messages in debug mode
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();

    let result = Scanner::new().scan(text);
    serde_wasm_bindgen::to_value(&result)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

/// Returns the crate version for debugging.
#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
