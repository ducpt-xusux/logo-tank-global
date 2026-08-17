import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ja from "../locales/ja";
import en from "../locales/en";
import vi from "../locales/vi";

export const resources = {
    en: { common: en },
    vi: { common: vi },
    ja: { common: ja },
} as const;

const convertDetect = (lng: string) => {
    if (lng.includes("vi")) {
        return "vi";
    }

    if (lng.includes("ja")) {
        return "ja";
    }

    return "en";
};

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        detection: {
            order: ["path", "htmlTag", "navigator"],
            lookupFromPathIndex: 0,
            convertDetectedLanguage: (lng) => convertDetect(lng),
        },
        fallbackLng: "en",
        resources,
    });

export default i18n;
