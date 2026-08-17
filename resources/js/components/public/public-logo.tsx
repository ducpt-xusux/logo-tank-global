import { useTranslation } from "react-i18next";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";
import { LogoCard } from "./logo-card";
import SignIn from "@/components/user/sign-in";
import { Logo, SharedData } from "@/types";

interface PublicLogoProps {
    initialLogos?: Logo[] | { data?: Logo[] } | null;
}

const normalizeLogos = (value: PublicLogoProps["initialLogos"]): Logo[] => {
    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.data)) {
        return value.data;
    }

    return [];
};

const getLogoImage = (logo: Logo): string => {
    const candidates = [logo.src, logo.url_img_two];
    const image = candidates.find((item) => {
        if (typeof item !== "string") {
            return false;
        }

        const normalized = item.trim().toLowerCase();
        return normalized !== "" && normalized !== "null";
    });

    return image ?? "/img/default.png";
};

export function PublicLogo({ initialLogos }: PublicLogoProps) {
    const { t } = useTranslation("common", { useSuspense: false });
    const { auth } = usePage<SharedData>().props;
    const normalizedInitialLogos = useMemo(
        () => normalizeLogos(initialLogos),
        [initialLogos],
    );

    const [logos, setLogos] = useState<Logo[]>(normalizedInitialLogos);
    const [showSignIn, setShowSignIn] = useState(false);

    useEffect(() => {
        setLogos(normalizedInitialLogos);
    }, [normalizedInitialLogos]);

    useEffect(() => {
        // When navigating back via browser history, Inertia might restore from history cache.
        // We listen to the browser's popstate event to know when the user hit Back/Forward.
        // If they did, we silently ask the server for fresh 'logos' data so the Like button is accurate.
        const handlePopState = () => {
            router.reload({ only: ["logos"] });
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const handleFavorite = (logoId: number, isLiked: boolean) => {
        if (!auth.user) {
            setShowSignIn(true);
            return;
        }

        const previousLogos = logos;
        const newLogos = logos.map((item) => {
            if (item.logo_id === logoId) {
                return {
                    ...item,
                    is_like: isLiked ? 1 : 0,
                    favorites_count: Math.max(
                        0,
                        item.favorites_count + (isLiked === true ? 1 : -1),
                    ),
                };
            }
            return item;
        });

        setLogos(newLogos);

        router.post(
            `/logo/${logoId}/favorite`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    setLogos(previousLogos);
                },
            },
        );
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {logos.map((logo) => (
                    <LogoCard
                        key={logo.logo_id}
                        id={logo.logo_id}
                        image={getLogoImage(logo)}
                        companyName={logo.reg_by || "company name"}
                        logoName={logo.logo_name || "Logo Tank"}
                        price={logo.price}
                        likes={logo.favorites_count || 0}
                        isLiked={logo.is_like === 1}
                        onLike={handleFavorite}
                    />
                ))}
            </div>
            <div className="z-101">
                <SignIn open={showSignIn} setOpenLogin={setShowSignIn} />
            </div>
        </>
    );
}
