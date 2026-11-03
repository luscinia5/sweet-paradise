// Translations live in locales/<lang>.json. Elements opt in with:
//   data-i18n="page.key"                      -> sets the element's text
//   data-i18n-attr="attr:page.key;attr2:key"  -> sets attributes (alt, aria-label, content...)
// The English text is also written in the HTML as a fallback.
// To add a language: add its code to SUPPORTED, create locales/<code>.json,
// and add a button with data-lang="<code>" to the .lang-switch nav.
(() => {
  const SUPPORTED = ["en", "es"];
  const DEFAULT_LANG = "en";
  const STORAGE_KEY = "lang";

  let dict = {};
  let fallback = {};
  let currentLang = DEFAULT_LANG;

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }

  function store(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* private mode etc. */ }
  }

  function pickLanguage() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    const candidates = [fromUrl, readStored(), ...(navigator.languages || [navigator.language])];
    for (const code of candidates) {
      const base = (code || "").toLowerCase().split("-")[0];
      if (SUPPORTED.includes(base)) return base;
    }
    return DEFAULT_LANG;
  }

  async function load(lang) {
    try {
      const res = await fetch(`locales/${lang}.json`);
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch (err) {
      console.warn(`Could not load locales/${lang}.json`, err);
      return {};
    }
  }

  const lookup = (obj, path) =>
    path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

  function t(key) {
    return lookup(dict, key) ?? lookup(fallback, key);
  }

  function apply(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const text = t(el.dataset.i18n);
      if (text != null) el.textContent = text;
    });

    root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const i = pair.indexOf(":");
        const text = t(pair.slice(i + 1).trim());
        if (text != null) el.setAttribute(pair.slice(0, i).trim(), text);
      });
    });
  }

  async function setLanguage(lang, { persist = true } = {}) {
    dict = lang === DEFAULT_LANG ? fallback : await load(lang);
    currentLang = lang;
    document.documentElement.lang = lang;
    if (persist) store(lang);
    apply();
    document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
  }

  window.i18n = { t, apply, get lang() { return currentLang; } };

  const domReady = document.readyState === "loading"
    ? new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve))
    : Promise.resolve();

  async function init() {
    // wait for the DOM (and menu.js, which builds the cards) before translating
    await domReady;
    fallback = await load(DEFAULT_LANG);

    document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
    });
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    await setLanguage(pickLanguage(), { persist: false });
    document.documentElement.classList.remove("i18n-pending");
  }

  init();
})();
