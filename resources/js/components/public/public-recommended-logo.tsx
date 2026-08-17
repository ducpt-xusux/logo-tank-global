import { usePage } from "@inertiajs/react";
import { useTranslation, Trans } from "react-i18next";
import { Logo, SharedData } from "@/types";
import { LogoCard } from "./logo-card";
import { currencyNumber, getLogoPrice } from "@/helper/utils";
import { ImageSlider } from "./image-slider";

export default function PublicRecommendedLogo() {
    const { t, i18n } = useTranslation("common", { useSuspense: false });
    const { logosRecommended } = usePage<
        SharedData & { logosRecommended?: { data: any[] } }
    >().props;

    if (!logosRecommended || logosRecommended.data.length === 0) return null;

    const getLogoName = (logo: any) => {
        if (i18n.language === "vi")
            return logo.logo_language?.vi || logo.logo_name;
        if (i18n.language === "ja")
            return logo.logo_language?.ja || logo.logo_name;
        return logo.logo_language?.en || logo.logo_name;
    };

    const logoCards = logosRecommended.data.map((logo: Logo) => (
        <LogoCard
            key={logo.logo_id}
            id={logo.logo_id}
            image={logo.src || logo.url_img_two || "/img/default.png"}
            companyName={`No.${String(logo.logo_id).padStart(5, "0")}`}
            logoName={getLogoName(logo)}
            price={currencyNumber(getLogoPrice(), true)}
            isLiked={logo.is_like === 1}
            likes={logo.favorites_count ?? 0}
            isCompact={false}
        />
    ));

    return (
        <div className="mx-auto w-full max-w-[1238px] lg:mt-8">
            <h2 className="border-b border-[#EDEDED] text-[16px] font-semibold uppercase sm:text-xl lg:pb-5">
                <span className="border-brand border-b-3 lg:pb-5">
                    <Trans
                        t={t}
                        i18nKey="logoDetail.recommended_logo"
                        components={{
                            logo: <span className="text-brand font-bold" />,
                        }}
                    />
                </span>
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 px-4 sm:hidden">
                {logoCards}
            </div>

            <div className="mt-8 hidden px-4 sm:block">
                <ImageSlider
                    items={logoCards}
                    visibleItems={4}
                    gap={6}
                    arrowStyle="orange"
                    className="w-full"
                />
            </div>
        </div>
    );
}
