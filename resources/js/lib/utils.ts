import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { router } from "@inertiajs/react";
import { ListBoxOption } from "@/types";
import i18n from '@/helper/i18n';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getUserRole() {
    return [
        {
            label: "ユーザー",
            value: "1",
        },
        {
            label: "マネジャー",
            value: "2",
        },
        {
            label: "アドミン",
            value: "6",
        },
    ];
}

export function getPostStatus() {
    return [
        {
            label: "公開",
            value: "1",
        },
        {
            label: "非公開",
            value: "2",
        },
    ];
}

export function getRoleOptions(): ListBoxOption[] {
    return [
        {
            id: 1,
            name: "ユーザー",
            value: "1",
        },
        {
            id: 2,
            name: "マネジャー",
            value: "2",
        },
        {
            id: 3,
            name: "アドミン",
            value: "6",
        },
    ];
}

export function getPostStatusOptions(): ListBoxOption[] {
    return [
        {
            id: 1,
            name: "公開",
            value: "1",
        },
        {
            id: 2,
            name: "非公開",
            value: "2",
        },
    ];
}

export function getPerPage(): number[] {
    return [20, 50, 100, 150, 200];
}

export const goBack = () => {
    window.history.back();
    setTimeout(() => {
        router.reload();
    }, 100);
};

export function getRouteParams(model: string): string {
    return model.replace(/-/g, "_");
}

export function objectToFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
        // Nếu là boolean, convert thành '1' hoặc '0'
        if (typeof value === "boolean") {
            formData.append(key, value ? "1" : "0");
        }
        // Nếu là số hoặc chuỗi, thêm trực tiếp
        else if (typeof value === "string" || typeof value === "number") {
            formData.append(key, value.toString());
        }
        // Nếu là file
        else if (value instanceof File) {
            formData.append(key, value);
        }
        // Nếu là null/undefined, có thể bỏ qua hoặc xử lý tùy ý
        else if (value === null || value === undefined) {
            // formData.append(key, ''); // nếu muốn gửi rỗng
        }
        // Nếu là object con (nested), bạn cần serialize nếu backend không hỗ trợ nested
        else {
            // Chuyển thành JSON string nếu cần
            formData.append(key, JSON.stringify(value));
        }
    });

    return formData;
}


