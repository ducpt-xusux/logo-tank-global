import { ListBoxOption, PriceSetting } from "@/helper/type";
import i18n from "@/helper/i18n";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemStore } from "@/stores/system.storage";

export const textNumber = (text: string) => {
    let regex = RegExp("[０１２３４５６７８９　]", "g");
    return text.replace(regex, function (character) {
        // Get the position of the found character in the search string.
        let index = "０１２３４５６７８９　".indexOf(character);
        // Get the corresponding character from the replace string.
        return "0123456789 ".charAt(index);
    });
};

export const getAppName = () => {
    let locale = i18n.language;
    // @ts-ignore
    return locale === "ja" ? appName : appNameEn;
};

export const processDecimalNumber = (text: string, separate?: string) => {
    let decimal = ",";
    if (!text || text.trim() === "") return "";
    if (!separate) separate = ".";
    if (separate === ",") decimal = ".";
    let output = text.split(separate),
        firstOutput = output.shift() ?? "",
        intOutput = firstOutput.replaceAll(decimal, "");
    return (
        new Intl.NumberFormat().format(parseInt(intOutput)) +
        (output.length ? "." + output.join("") : "")
    );
};

export const strToUnicodeArray = (str: string) => {
    let arr = [];
    for (let i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i));
    }
    return arr;
};

export const getAdminRoute = () => {
    return "admin";
};

export const randomString = (length?: number, type?: string) => {
    let result = "",
        characters =
            type === "number"
                ? "0123456789"
                : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        charactersLength = characters.length,
        stringLength = length ?? 10;
    for (let i = 0; i < stringLength; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }
    return result;
};

export const getRole = (role: string) => {
    if (role === "admin") return "アドミン";
    if (role === "designer") return "デザイナー";
    return "ユーザー";
};

export const currencyNumber = (
    number: number | string | undefined,
    withCurrencyText?: boolean,
): string => {
    if (number === undefined || number === null || number === "") return "0";

    const text = number.toString().replaceAll(",", "");
    const value = parseFloat(text);
    if (isNaN(value)) return "0";

    const locale = i18n.language;
    const currency = locale === "ja" ? "JPY" : locale === "vi" ? "VND" : "USD";

    if (withCurrencyText) {
        if (currency === "VND") {
            const formatted = new Intl.NumberFormat(locale, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value);
            return `${formatted} VNĐ`;
        }
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: currency === "USD" ? 2 : 0,
            maximumFractionDigits: currency === "USD" ? 2 : 0,
        }).format(value);
    }

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: locale === "en" ? 2 : 0,
        maximumFractionDigits: locale === "en" ? 2 : 0,
    }).format(value);
};

export const currencyNumberV1 = (
    number: number | string | undefined,
    withCurrencyText?: boolean,
): string => {
    if (!number) return "";
    let text = number.toString().replaceAll(",", "");
    return (
        (withCurrencyText ? "¥" : "") +
        new Intl.NumberFormat().format(Math.round(parseFloat(text)))
    );
};

export const calcPercent = (
    value1: number,
    value2: number,
    decimal?: number,
    output?: string,
): string | number => {
    if (!value1 || !value2) return "0%";
    let u1 = decimal === 1 ? 1000 : decimal === 0 ? 100 : 10000,
        u2 = decimal === 1 ? 10 : decimal === 0 ? 1 : 100;
    return output === "number"
        ? Math.round((value1 / value2) * u1) / u2
        : Math.round((value1 / value2) * u1) / u2 + "%";
};

export const loadFont = async () => {
    // @ts-ignore
    if (fontRegular && fontBold) return { fontRegular, fontBold };
    let loadedFontRegular, loadedFontBold;
    // @ts-ignore
    fontRegular = await fetch(baseUrl + "/fonts/SauceHanSansJP.ttf").then(
        (res) => res.arrayBuffer(),
    );
    // @ts-ignore
    fontBold = await fetch(baseUrl + "/fonts/SourceHanSerifJP-Bold.otf").then(
        (res) => res.arrayBuffer(),
    );
    // @ts-ignore
    return { fontRegular: fontRegular, fontBold: fontBold };
};

export const getHourOptions = (): ListBoxOption[] => {
    let result: ListBoxOption[] = [{ id: 99, value: 99, name: "選択" }],
        hour,
        minute,
        hourText;
    for (let i = 0; i <= 47; i++) {
        hour = Math.floor(i / 2);
        hourText = hour > 9 ? hour + "" : "0" + hour;
        minute = i % 2 === 1 ? "30" : "00";
        result.push({ id: i, value: i, name: hourText + ":" + minute });
    }
    return result;
};

export const getWeekday = (date: Date) => {
    let day = date.getDay();
    if (day === 0) return "日曜日";
    if (day === 1) return "月曜日";
    if (day === 2) return "火曜日";
    if (day === 3) return "水曜日";
    if (day === 4) return "木曜日";
    if (day === 5) return "金曜日";
    return "土曜日";
};

export const stringToNumber = (text: string | undefined) => {
    if (!text) return 0;
    if (text.trim() === "") return 0;
    let tmp = text.replaceAll(",", "");

    return parseInt(tmp);
};

export const convertStringToNumberOnChange = (e: any) => {
    const value = e.target.value;

    if (
        value.match(/[０-９]+/g) &&
        e.nativeEvent.inputType == "insertCompositionText"
    ) {
        return stringToNumber(textNumber(value));
    } else {
        return stringToNumber(value);
    }
};

export const classNames = (...classes: any[]) => {
    return classes.filter(Boolean).join(" ");
};

export const getLocaleLink = (link: string) => {
    let locale = i18n.language;
    if (locale === "vn") {
        locale = "vi";
    }
    return link === "/" || link === "" ? `/${locale}` : `/${locale}${link}`;
};

export const getLogoName = (logoDetail: any) => {
    if (logoDetail.logo_language && logoDetail.logo_language[i18n.language]) {
        return logoDetail.logo_language[i18n.language];
    } else {
        if (i18n.language == "en") {
            return "In preparation";
        } else if (i18n.language == "ja") {
            return logoDetail?.logo_name ? logoDetail?.logo_name : "準備中";
        } else {
            return "Đang chuẩn bị";
        }
    }
};

export const getManualPrice = () => {
    let priceSettings = useSystemStore.getState().priceSettings;
    if (!priceSettings || !priceSettings.logo_manual_price) return 0;
    if (priceSettings.logo_manual_price[i18n.language])
        return priceSettings.logo_manual_price[i18n.language];
    return priceSettings.logo_manual_price.en;
};

export const getLogoPrice = () => {
    let priceSettings = useSystemStore.getState().priceSettings;
    if (!priceSettings || !priceSettings.logo_price) return 0;
    if (priceSettings.logo_price[i18n.language])
        return priceSettings.logo_price[i18n.language];
    return priceSettings.logo_price.en;
};

export const getMotionPrice = () => {
    let priceSettings = useSystemStore.getState().priceSettings;
    if (!priceSettings || !priceSettings.logo_motion_price) return 0;
    if (priceSettings.logo_motion_price[i18n.language])
        return priceSettings.logo_motion_price[i18n.language];
    return priceSettings.logo_motion_price.en;
};

export const getEnv = () => {
    // @ts-ignore
    if (env === "local") return "local";
    return "production";
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getLocalizedName = (item: any) => {
    const locale = i18n.language;
    if (!item) return "";
    return item[`name_${locale}`] || item[`name_en`] || item.name || "";
};
