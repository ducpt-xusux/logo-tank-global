import { Trans, useTranslation } from "react-i18next";
import { Container } from "./container";
import { HeroSearchBox } from "./hero-search-box";
import { Industry, Color, Taste } from "@/types";

export function HeroBanner({
    industries,
    colors,
    tastes,
}: {
    industries?: Industry[];
    colors?: Color[];
    tastes?: Taste[];
}) {
    const { t } = useTranslation("common", { useSuspense: false });

    return (
        <>
            <Container className="relative z-10">
                {/* Banner wrapper */}
                <div className="relative">
                    {/* Hero-Banner PNG*/}
                    <img
                        src="/img/top/banner.png"
                        alt="Homepage Banner"
                        className="w-full"
                    />
                    <div className="absolute top-4 left-4 z-20 md:top-[23px] md:left-[67px]">
                        <div className="max-w-[200px] md:max-w-[334px]">
                            <h1 className="flex flex-col gap-2">
                                <span className="text-xl text-[#C86001] md:text-4xl">
                                    {t("home.bannerTitle1")}
                                </span>
                                <span className="leading-tight font-bold text-white uppercase md:mt-3 md:text-5xl lg:text-[55px]">
                                    {t("home.bannerTitle2")}
                                </span>
                            </h1>
                        </div>

                        {/* Stats */}
                        <div className="mt-22 hidden flex-row items-center gap-6 lg:flex">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">
                                    {t("home.stats.transactions.value")}
                                </span>
                                <span className="text-xs text-white/80">
                                    {t("home.stats.transactions.label")}
                                </span>
                            </div>
                            <div className="h-8 w-px bg-white/40"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">
                                    {t("home.stats.partners.value")}
                                </span>
                                <span className="text-xs text-white/80">
                                    {t("home.stats.partners.label")}
                                </span>
                            </div>
                            <div className="h-8 w-px bg-white/40"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">
                                    {t("home.stats.sold.value")}
                                </span>
                                <span className="text-xs text-white/80">
                                    {t("home.stats.sold.label")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <HeroSearchBox
                        industries={industries}
                        colors={colors}
                        tastes={tastes}
                        className="md:absolute md:bottom-[-35px] md:left-1/2 md:w-full md:max-w-[1128px] md:-translate-x-1/2 md:translate-y-1/2"
                    />
                </div>
                <p className="px-4 pt-[90px] pb-12 text-center text-base md:px-0 md:pt-[220px] md:pb-[100px] md:text-3xl md:whitespace-nowrap">
                    <Trans
                        t={t}
                        i18nKey="home.intro1"
                        components={{
                            logo: <span className="text-brand font-bold" />,
                            brand: <span className="text-brand font-bold" />,
                        }}
                    />
                </p>
            </Container>
        </>
    );
}
