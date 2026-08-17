import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getManualPrice, getMotionPrice } from "@/helper/utils";

export interface PackageCartItem {
    packageId: number;
    packageKey: string;
    packageName: string;
    prices: Record<string, number>;
    quantity: number;
    logoManual: boolean;
    logoMotion: boolean;
}

interface PackageCartState {
    packageCart: PackageCartItem[];
    addItem: (item: PackageCartItem) => void;
    removeItem: (packageId: number) => void;
    updateItem: (packageId: number, updates: Partial<PackageCartItem>) => void;
    clearCart: () => void;
    getItemCalculations: (
        item: PackageCartItem,
        language: string,
    ) => {
        basePrice: number;
        motionPrice: number;
        manualPrice: number;
        addonsTotal: number;
        itemTotal: number;
        tax: number;
        grandTotal: number;
    };
}

export const usePackageCartStore = create<PackageCartState>()(
    persist(
        (set, get) => ({
            packageCart: [],
            addItem: (item) =>
                set((state) => {
                    const existIdx = state.packageCart.findIndex(
                        (i) => i.packageId === item.packageId,
                    );
                    if (existIdx > -1) {
                        const updated = [...state.packageCart];
                        updated[existIdx] = item;
                        return { packageCart: updated };
                    }
                    return { packageCart: [...state.packageCart, item] };
                }),
            removeItem: (packageId) =>
                set((state) => ({
                    packageCart: state.packageCart.filter(
                        (i) => i.packageId !== packageId,
                    ),
                })),
            updateItem: (packageId, updates) =>
                set((state) => ({
                    packageCart: state.packageCart.map((i) =>
                        i.packageId === packageId ? { ...i, ...updates } : i,
                    ),
                })),
            clearCart: () => set({ packageCart: [] }),
            getItemCalculations: (item, language) => {
                const basePrice =
                    (item.prices?.[language] || 0) * item.quantity;
                const motionPrice = item.logoMotion
                    ? getMotionPrice() * item.quantity
                    : 0;
                const manualPrice = item.logoManual
                    ? getManualPrice() * item.quantity
                    : 0;

                const addonsTotal = motionPrice + manualPrice;
                const itemTotal = basePrice + addonsTotal;
                const tax = itemTotal * 0.1; // 10% tax
                const grandTotal = itemTotal + tax;

                return {
                    basePrice,
                    motionPrice,
                    manualPrice,
                    addonsTotal,
                    itemTotal,
                    tax,
                    grandTotal,
                };
            },
        }),
        {
            name: "package-cart-storage",
        },
    ),
);
