import React, { ReactElement } from "react";

export type IsOverEval = (
    testString: string,
    fontSize: number,
    characterSpacing: number,
    boxWidth: number,
) => boolean;

export interface PDFSchema {
    type: "text" | "line" | "image";
    position?: {
        x: number;
        y: number;
    };
    width?: number;
    height?: number;
    alignment?: "left" | "center" | "right";
    fontSize?: number;
    characterSpacing?: number;
    lineHeight?: number;
    backgroundColor?: string;
    fontWeight?: "regular" | "bold";
    start?: {
        x: number;
        y: number;
    };
    end?: {
        x: number;
        y: number;
    };
    thickness?: number;
    opacity?: number;
    dashArray?: Array<number>;
    link?: string;
}

export interface PDFSchemas {
    [key: string]: PDFSchema;
}

export interface System {
    menu: string;
    openMenu: boolean;
    openMobileMenu: boolean;
    openSignInForm: boolean;
    openSignUpForm: boolean;
    openPaymentMethod: boolean;
    loading: boolean;
    designers: Designer[];
    priceSettings: PriceSetting;
    shoppingCart: ShoppingCartTypes[];
    prepareOrderData: {
        paymentMethod: { id: number; name: string };
        cart: ShoppingCartTypes[];
    };
    order: Order;
    conditions: {
        u_keyword?: string;
        keyword?: string;
        industry?: any;
        alphabet?: any;
        genre?: any;
        type?: any;
        sold_out?: string;
    };
    industries: MasterDataResponseTypes[];
    colors: MasterDataResponseTypes[];
    tastes: MasterDataResponseTypes[];
    alphabets: MasterDataResponseTypes[];
    favoriteCount: number;
    doSearch: boolean;
    page_logo_admin: number;
    totalAmount: number;
}

export interface RecentlyState {
    recentlyViewedLogos: string[];
    keywordRecently: string[];
}

export interface MasterDataResponseTypes {
    id?: number;
    key_name?: string | null;
    name?: string;
    name_vi?: string;
    name_en?: string;
    reg_by?: string;
}

export interface ShoppingCartTypes {
    userId?: number;
    productId: number;
    subName: string;
    mainName: string;
    logoMotion: boolean;
    logoManual: boolean;
    product?: Logo;
}

export interface CustomRouteProps {
    title: string;
    path: string;
    auth?: boolean;
    admin?: boolean;
    component: () => ReactElement;
    manage?: boolean;
}

export interface SystemActionTypes {
    type: string;
    menu: string;
    openMenu: boolean;
    openMobileMenu: boolean;
    openSignInForm: boolean;
    openSignUpForm: boolean;
    openPaymentMethod: boolean;
    loading: boolean;
    designers: Designer[];
    priceSettings: PriceSetting;
    shoppingCart: ShoppingCartTypes[];
    prepareOrderData: {
        paymentMethod: { id: number; name: string };
        cart: ShoppingCartTypes[];
    };
    order: Order;
    conditions: {
        u_keyword?: string;
        keyword?: string;
        industry?: any;
        alphabet?: any;
        genre?: any;
        type?: any;
        sold_out?: string;
    };
    industries: MasterDataResponseTypes[];
    colors: MasterDataResponseTypes[];
    tastes: MasterDataResponseTypes[];
    alphabets: MasterDataResponseTypes[];
    favoriteCount: number;
    doSearch: boolean;
    page_logo_admin: number;
    totalAmount: number;
}

export interface PriceSetting {
    cancellation_fee: {
        [key: string]: number;
    };
    logo_motion_price: {
        [key: string]: number;
    };
    logo_price: {
        [key: string]: number;
    };
    logo_manual_price: {
        [key: string]: number;
    };
    tax: {
        [key: string]: number;
    };
}

export interface LogoDetailTypes {
    alphabets: [];
    colors: [];
    industries: [];
    keywords: string[];
    logo_d_id: null;
    logo_explain: string;
    logo_id: number;
    logo_name: string;
    reg_by: string;
    src: string;
    state: number;
    tank_count: number;
    tank_num: number;
    tank_num_logo_tank_jp: number;
    favorites_count: number;
    logo_language: LogoLanguages;
    tastes: [];
    is_like: boolean;
    inactive: boolean;
    kept: boolean;
    is_user_kept: boolean;
    up_by: string;
    url_img_two: string;
}

export interface LogoLanguages {
    id: number;
    logo_id: number;
    en: string;
    vi: string;
    ja: string;
    created_at: string;
    updated_at: string;
    create_by: string;
    [key: string]: string | number;
}

export interface CustomSliderMethods {
    goToSlide: (index: number) => void;
}

export interface SearchConditionTypes {
    logo_id?: string | number;
    state?: string | number;
    reg_by?: string | number;
    logo_name?: string;
    logo_ids?: (string | bigint | number)[];
    keyword?: string;
    industry?: string | number;
    color?: string | number;
    taste?: string | number;
    alphabet?: string | number;
    sold_out?: string | number;
}
export interface Auth {
    loggedIn: boolean;
    user?: AuthUser;
}

export interface AuthUser {
    access_token: string;
    detail: User;
    expires_in: number;
    token_type: string;
}

export interface LocationState {
    from: {
        pathname: string;
    };
    detail_id: string;
}

export interface CommonData {
    units: ListBoxOption[];
    merchants: ListBoxOption[];
    vendors: ListBoxOption[];
}

export interface Field {
    name: string;
    validateOptions?: any;
    defaultValue: string | number;
    label: string;
    placeholder?: string;
    options?: ListBoxOption[];
    type?: string;
    full?: boolean;
}

export interface ListBoxOption {
    id: number;
    name: string;
    value: string | number;
    disable?: boolean;
}
export interface Profile {
    id: bigint;
    email: string;
    name1: string;
    name2: string;
    name3: string;
    name4: string;
    role: string;
    company: string;
    zip: string;
    tel: string;
    fax: string;
    pref: string;
    address1: string;
    address2: string;
    address3: string;
    reg_date: string;
    past_work: number;
}

export interface Alphabets {
    alphabet_id: number;
    name: string;
}

export interface TableHeadField {
    name: string;
    title: string;
    noSort?: boolean;
    col?: number;
}

export interface User {
    id?: number;
    email?: string;
    first_login?: number;
    first_name?: string;
    last_name?: string;
    name?: string;
    name_kana?: string;
    picture?: string;
    stamp?: string;
    role: string;
    phone?: string;
    postal_code?: string | number;
    address_line_1?: string;
    address_line_2?: string;
    company_name?: string;
    phone_number?: string;
    email_verified_at?: string;
    created_at?: string;
    password?: string;
    new_password?: string;
    confirm_password?: string;
}

export interface Logo {
    id: number;
    logo_id: number;
    state: number;
    reg_by: string;
    up_by: string;
    logo_name: string;
    logo_explain: string;
    tank_num: number;
    src: string;
    logo_d_id: string;
    tank_count: number;
    colors?: Color[];
    industries?: Industry[];
    tastes?: Taste[];
    keywords?: string[];
    alphabets?: any[];
    url_img_two: string;
    favorites_count: number;
    is_like: number;
    is_user_kept: boolean;
    tank_num_logo_tank_jp: number;
    inactive: boolean; // checking a logo is active or not
    kept: boolean; // checking a logo is kept or not
    logo_language: LogoLanguages;
    logo_images?: LogoImage[];
}

export interface LogoImage {
    id: number;
    logo_id: number;
    file_name: string;
    file_path: string;
    sort_order: number;
    url: string;
    created_at?: string;
    updated_at?: string;
}
export interface Color {
    id: number;
    key_name?: string;
    created_at?: string;
    [key: string]: string | number | undefined;
}

export interface Industry {
    id: number;
    name_ja: string;
    order_id: number;
    reg_date: string;
    key_name: string;
}

export interface Language {
    logo_id: number;
    create_by: string;
    vi: string;
    en: string;
    ja: string;
}
export interface Taste {
    id: number;
    name_ja: string;
    reg_date: string;
    key_name: string;
}

export interface Designer {
    id: number;
    name: string;
    value?: string;
}

export interface FilterState {
    keyword?: string;
    role?: number | string;
    status?: string;
    [key: string]: any;
}

export interface PasswordReset {
    email: string;
    token?: string;
    password: string;
    confirmation_password?: string;
}

export interface Log {
    value: any;
    id: bigint;
    logo_id: bigint;
    user_id: bigint;
    user: User;
    logo: Logo;
}

export interface Order {
    id?: number;
    user_id?: number;
    price?: number;
    tax?: number;
    commission?: number;
    tax_rate?: number;
    type?: number;
    status?: number;
    payment_status?: number;
    payment_date?: string;
    payment_type?: number;
    payment_intent?: string;
    payment_intent_client_secret?: string;
    purchase_date?: string;
    sub_total?: string;
    total_amount?: string;
    invoice_num?: string;
    delivery_address?: string;
    postal_code?: number;
    delivery_date?: number;
    currency?: string;
}

export interface Zip {
    id?: number;
    logo_id?: number;
    url_zip?: string;
}

export interface KeyWord {
    id?: number;
    keyword?: string;
    keyword_language?: {
        ja?: string;
        vi?: string;
        en?: string;
    };
    name_ja?: string;
    name_vi?: string;
    name_en?: string;
    [key: string]: any;
}
export interface AddressSearch {
    id?: number;
    address_ip?: string;
}
export interface OptionSelectTypes {
    id: number;
    name: string | number;
    value: string | number;
    disabled?: boolean;
}

export interface PublicLogoTankProps {
    logoId: number;
    imageUrl: string;
    explain: string;
    isKeep?: boolean;
    favoriteCount?: number;
    unFavorite?: Function;
    keep?: Function;
    keepDate?: any;
    leftKeptLogo?: Function;
    inactive?: boolean;
    counter?: number;
    name?: string;
}

export interface DataReducerProps {
    contactData: {} | null;
    quoteData: {} | null;
}

export interface PaymentMethod {
    id: number;
    name: string | React.JSX.Element;
    short_name: string;
    active: boolean;
    icon: string | React.JSX.Element;
}

export interface RouteProps {
    title: string;
    path: string;
    auth?: boolean;
    component: () => ReactElement;
}
