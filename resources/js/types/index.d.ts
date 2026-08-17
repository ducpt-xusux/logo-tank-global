import { LucideIcon } from "lucide-react";
import type { Config } from "ziggy-js";
import { FormDataConvertible } from "@inertiajs/core/types/types";
import React from "react";

export interface Auth {
    user: SharedUser | null;
}

export interface SharedUser {
    id: number;
    name: string;
    email: string;
    role: string;
    two_factor_confirmed_at: string | null;
}

export interface BreadcrumbItemProps {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItemProps {
    title: string;
    url: string;
    isActive?: boolean;
    items: {
        title: string;
        url: string;
        icon?: CustomIconType;
    }[];
}

export interface SharedData {
    name: string;
    auth: Auth;
    ziggy: Config & { location: string };
    locale?: "en" | "ja" | "vi";
    sidebarOpen: boolean;
    flash: { [key: string]: string };
    [key: string]: unknown;
}

export interface ItemsProps {
    data: any[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export type ParamsProps = Record<string, FormDataConvertible>;

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    company_name: string | null;
    phone: string | null;
    address: string | null;
    address_line_1: string | null;
    postal_code: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    two_factor_secret: string | null;
    two_factor_recovery_codes: string | null;
    two_factor_confirmed_at: string | null;
}

interface ColumnMeta {
    title: string;
    icon?: string;
    filterable?: boolean;
    options?: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
}

export interface ListBoxOption {
    id: number;
    name: string;
    value: string;
    disable?: boolean;
}

export interface Field {
    name: string;
    label: string;
    placeholder?: string;
    options?: ListBoxOption[];
    type?:
        | "select"
        | "date"
        | "radio"
        | "textarea"
        | "text"
        | "month"
        | "number"
        | "password"
        | "editor"
        | "image"
        | "file";
    explain?: string;
    disabled?: boolean;
    accept?: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Taste {
    id: number;
    name_ja: string;
    reg_date: string;
    key_name: string;
    [key: string]: any;
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
    inactive: boolean;
    kept: boolean;
    logo_language: LogoLanguages;
    [key: string]: any;
}

export interface Color {
    id: number;
    key_name?: string;
    created_at?: string;
    [key: string]: any;
}
export interface Industry {
    id: number;
    state: number | null;
    order_id: number | null;
    reg_date: string | null;
    up_date?: string | null;
    reg_by?: string | null;
    up_by?: string | null;
    name?: string | null;
    key_name?: string | null;
    explain?: string | null;
    [key: string]: any;
}
export interface LogoZip {
    id: number;
    logo_id: number;
    url_zip: string;

    [key: string]: any;
}
