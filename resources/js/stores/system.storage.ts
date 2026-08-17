import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PriceSetting } from "@/helper/type";

export interface CartItem {
    userId: number;
    productId: number;
    subName: string;
    mainName: string;
    logoMotion: boolean;
    logoManual: boolean;
    product: any;
}

interface SystemState {
    openConfirmPassword: boolean;
    setOpenConfirmPassword: (open: boolean) => void;
    priceSettings: PriceSetting | null;
    setPriceSettings: (settings: PriceSetting) => void;
    shoppingCart: CartItem[];
    setShoppingCart: (cart: CartItem[]) => void;
    showPromoBanner: boolean;
    setShowPromoBanner: (show: boolean) => void;
}

export const useSystemStore = create<SystemState>()(
    persist(
        (set) => ({
            openConfirmPassword: false,
            setOpenConfirmPassword: (open: boolean) =>
                set({ openConfirmPassword: open }),
            priceSettings: null,
            setPriceSettings: (settings: PriceSetting) =>
                set({ priceSettings: settings }),
            shoppingCart: [],
            setShoppingCart: (cart: CartItem[]) => set({ shoppingCart: cart }),
            showPromoBanner: true,
            setShowPromoBanner: (show: boolean) => set({ showPromoBanner: show }),
        }),
        {
            name: "system-storage",
        },
    ),
);
