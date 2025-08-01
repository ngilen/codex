use std::env;
use std::sync::LazyLock;
use std::sync::RwLock;

pub const OPENAI_COOKIE_ENV_VAR: &str = "OPENAI_COOKIE";

static OPENAI_COOKIE: LazyLock<RwLock<Option<String>>> = LazyLock::new(|| {
    let val = env::var(OPENAI_COOKIE_ENV_VAR)
        .ok()
        .and_then(|s| if s.is_empty() { None } else { Some(s) });
    RwLock::new(val)
});

pub fn get_openai_cookie() -> Option<String> {
    #![allow(clippy::unwrap_used)]
    OPENAI_COOKIE.read().unwrap().clone()
}

pub fn set_openai_cookie(value: String) {
    #![allow(clippy::unwrap_used)]
    if !value.is_empty() {
        *OPENAI_COOKIE.write().unwrap() = Some(value);
    }
}
