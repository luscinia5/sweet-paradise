// All visible text lives here. The English text is also written in index.html
// so the page works without JavaScript. To add a language, add an entry below
// (e.g. `es`) and it will be picked up from the browser language or ?lang=es.
const translations = {
  en: {
    headline: "Opening Soon",
    follow: "Follow us",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
  },
};

const DEFAULT_LANG = "en";

function pickLanguage() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  const candidates = [fromUrl, ...(navigator.languages || [navigator.language])];
  for (const code of candidates) {
    const base = (code || "").toLowerCase().split("-")[0];
    if (translations[base]) return base;
  }
  return DEFAULT_LANG;
}

function applyLanguage(lang) {
  const dict = translations[lang];
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const text = dict[el.dataset.i18n];
    if (text) el.textContent = text;
  });

  // data-i18n-attr="attribute:key"
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const [attr, key] = el.dataset.i18nAttr.split(":");
    if (dict[key]) el.setAttribute(attr, dict[key]);
  });
}

applyLanguage(pickLanguage());
document.getElementById("year").textContent = new Date().getFullYear();
