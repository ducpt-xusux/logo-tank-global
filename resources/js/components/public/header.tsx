import { useTranslation } from "react-i18next";
import { useSystemStore } from "@/stores/system.storage";
import { Link } from "@inertiajs/react";
import { MoveRight, X } from "lucide-react";
import { PublicHeaderToolbar } from "./public-header-toolbar";

export function PublicHeader() {
    const { i18n, t } = useTranslation("common", { useSuspense: false });
    const { showPromoBanner, setShowPromoBanner } = useSystemStore();
    const handleCloseX = () => {
        setShowPromoBanner(false);
    };
    return (
        <header className="sticky top-0 z-[101] w-full bg-white shadow-sm">
            {showPromoBanner && (
                <div className="relative mx-auto hidden max-w-[1920px] items-center justify-center bg-[#474747] py-3 md:flex">
                    <p className="flex items-center justify-center px-2 text-white">
                        <img
                            src="/img/image.png"
                            alt=""
                            className="mr-1 h-4 w-4 shrink-0"
                        />

                        <span className="mx-1">
                            {t("headers.introduction1")}
                        </span>

                        <Link
                            href=""
                            className="inline-flex items-center gap-1 font-semibold text-[#FFAB00] underline decoration-[#FFAB00] underline-offset-2 hover:opacity-90"
                        >
                            <span>{t("headers.introduction2")}</span>
                            <MoveRight className="h-4 w-4" />
                        </Link>
                    </p>

                    <X
                        className="absolute right-4 cursor-pointer text-white"
                        size={24}
                        onClick={handleCloseX}
                    />
                </div>
            )}
            <div className="w-full bg-white">
                <PublicHeaderToolbar />
            </div>
        </header>
    );
}
