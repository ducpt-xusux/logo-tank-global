import { PublicFooter } from "./footer";
import { PublicHeader } from "./header";
import { usePage } from "@inertiajs/react";
import { useSystemStore } from "@/stores/system.storage";
import { useEffect } from "react";
import { PriceSetting } from "@/helper/type";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AppLayoutProps {
    children: React.ReactNode;
    className?: string;
    footerClassName?: string;
}

export function AppLayout({
    children,
    className = "bg-white",
    footerClassName = "bg-white pt-[125px]",
}: AppLayoutProps) {
    const { priceSettings } = usePage<{ priceSettings?: PriceSetting }>().props;
    const { setPriceSettings } = useSystemStore();

    useEffect(() => {
        if (priceSettings) {
            setPriceSettings(priceSettings);
        }
    }, [priceSettings]);

    return (
        <div className={`flex min-h-dvh w-full flex-col ${className}`}>
            <PublicHeader />
            <main className="flex flex-1 flex-col">{children}</main>
            <PublicFooter className={footerClassName} />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
}
