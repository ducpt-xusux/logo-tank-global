import { Head, usePage, router } from "@inertiajs/react";
import { useTranslation, Trans } from "react-i18next";
import { AppLayout, PublicLogo } from "@/components/public";
import { getLocaleLink } from "@/helper/utils";
import { LogoCard } from "@/components/public/logo-card";
import { Phone } from "lucide-react";
import { Button, Container } from "@/components";
import { HeroSearchBox } from "@/components";
import { Logo, SharedData, Industry, Color, Taste } from "@/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function Explore() {
    const { i18n, t } = useTranslation("common", { useSuspense: false });

    const { logos, industries, colors, tastes, filters } = usePage<
        SharedData & {
            logos?: {
                data: Logo[];
                meta?: {
                    total: number;
                    current_page: number;
                    last_page: number;
                    [key: string]: any;
                };
            };
            industries?: { data: Industry[] };
            colors?: { data: Color[] };
            tastes?: { data: Taste[] };
            filters?: {
                keyword?: string;
                industry?: string;
                alphabet?: string;
                taste?: string;
                color?: string;
            };
        }
    >().props;

    const initialPage = logos?.meta?.current_page ?? 1;
    const lastPage = logos?.meta?.last_page ?? 1;

    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [recentlyViewed, setRecentlyViewed] = useState<Logo[]>([]);

    useEffect(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);

    useEffect(() => {
        const stored = localStorage.getItem("recentlyViewedLogos");
        if (stored) {
            setRecentlyViewed(JSON.parse(stored));
        }
    }, []);

    const handleKeydown = (e: any) => {
        if (e.key === "Enter") {
            let newPage = Number(e.target.value);
            if (newPage < 1) newPage = 1;
            if (newPage > lastPage) newPage = lastPage;

            router.get(
                getLocaleLink("/explore"),
                { ...filters, page: newPage },
                { preserveState: true, preserveScroll: true }
            );
        }
    };

    return (
        <AppLayout>
            <Head title="Explore" />

            <div className="relative mx-auto w-[1920px] max-w-full overflow-hidden">
                {/* Background Banner */}
                <img
                    src="/img/explore-banner.png"
                    alt="Explore Banner"
                    className="w-full object-cover md:h-[520px]"
                />
                {/* Content Overlay */}
                <div className="absolute inset-0">
                    <Container className="relative flex h-full items-center">
                        {/* Left Text Block Box */}
                        <div className="flex w-full max-w-[731px] flex-col items-start justify-center gap-[30px] pt-[20px] pl-0 md:pt-0">
                            {/* Title */}
                            <h1 className="text-[32px] leading-20 font-bold tracking-[0.5px] text-[#474747] md:text-[40px]">
                                <Trans
                                    t={t}
                                    i18nKey="explore.heading_1"
                                    components={{
                                        ambassador: (
                                            <span className="relative z-10 mx-[-4px] inline-flex items-center justify-center bg-[url('/img/highlight-bg.svg')] bg-size-[100%_100%] bg-center bg-no-repeat px-[20px] py-[6px] font-bold text-white uppercase"></span>
                                        ),
                                        brand: (
                                            <span className="text-brand font-bold uppercase" />
                                        ),
                                    }}
                                />
                            </h1>

                            {/* Description */}
                            <p className="max-w-[650px] text-[15px] leading-[1.8] font-normal tracking-wide text-[#555]">
                                {t("explore.description")}
                            </p>

                            {/* Contact Button */}
                            <button className="mt-[10px] flex h-[54px] items-center justify-center gap-2 rounded-[8px] bg-[#F3993F] px-[32px] text-[18px] font-bold tracking-wider text-white shadow-md transition-all hover:bg-[#e08b35] hover:shadow-lg">
                                <Phone className="h-[22px] w-[22px] stroke-[2.5]" />
                                +84-37-443-1461
                            </button>
                        </div>

                        <div className="absolute right-0 bottom-0 w-[240px] md:w-[320px] lg:w-full lg:max-w-[420px]">
                            <div className="absolute top-0 left-0 z-20 w-[154px] rounded-l-[12px] rounded-tr-[12px] bg-[#F3993F] p-3 shadow-lg md:left-5 md:w-[220px] md:rounded-l-[16px] md:rounded-tr-[16px] md:p-5 lg:-left-[160px] lg:w-[200px]">
                                <p className="text-[12px] leading-snug font-bold text-white md:text-[15px] lg:text-[16px]">
                                    {t("explore.orange_box")}
                                    <img
                                        src="/img/ok-finger.svg"
                                        alt=""
                                        className="ml-1 inline-block h-6 w-6"
                                    />
                                </p>
                            </div>

                            <img
                                src="/img/the-girl.png"
                                alt=""
                                className="relative z-10 ml-5 h-auto w-full"
                            />
                            {/* White Bubble (Right) */}
                            <div className="absolute -top-[35px] -right-[10px] z-20 w-[180px] rounded-[16px] bg-white p-3 shadow-lg md:-right-[20px] md:w-[240px] md:rounded-tl-[16px] md:rounded-r-[16px] md:p-5 lg:-right-[180px] lg:w-[215px] lg:rounded-[16px]">
                                <p className="text-[12px] leading-snug font-bold text-[#F3993F] md:text-[15px] lg:text-[16px]">
                                    {t("explore.white_box")}
                                    <span className="text-[14px] md:text-[20px]">
                                        😊
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            <Container>
                <div className="text-brand mt-10 text-center text-[20px] font-medium md:mt-12 md:text-[22px] lg:mt-[49px] lg:text-[24px]">
                    {t("explore.explore_logo")}
                </div>
                <div className="mt-4 text-center text-[30px] leading-tight md:mt-5 md:text-[34px] lg:text-[36px]">
                    <Trans
                        t={t}
                        i18nKey="explore.heading_2"
                        components={{
                            ambassador: (
                                <span className="relative z-10 mx-[-4px] inline-flex items-center justify-center bg-[url('/img/highlight-bg.svg')] bg-[length:100%_100%] bg-center bg-no-repeat px-[20px] py-[6px] font-bold text-white uppercase" />
                            ),
                        }}
                    />
                </div>
                <div className="mx-auto mt-4 w-full max-w-[980px] text-center text-[15px] leading-[1.8] text-[#474747] md:text-[16px] lg:mt-4">
                    {" "}
                    <p>{t("explore.title")}</p>
                </div>

                <div className="mx-auto w-full max-w-[1238px]">
                    {/* search-box */}
                    <HeroSearchBox
                        industries={industries?.data}
                        colors={colors?.data}
                        tastes={tastes?.data}
                        initialFilters={filters}
                        className="mt-10 w-full md:mt-14 lg:mt-21"
                    />

                    <div className="z-1000 mt-8 flex w-full flex-col gap-4 text-[15px] md:mt-10 md:flex-row md:items-center md:justify-between md:text-[16px] lg:text-[16px]">
                        {/* sort by */}
                        <div className="flex items-center gap-2 text-[#474747]">
                            <span className="">{t("explore.sort_by")}</span>
                            <Select defaultValue="recommended">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={t(
                                            "explore.sort_lists.recommended",
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recommended">
                                        {t("explore.sort_lists.recommended")}
                                    </SelectItem>
                                    <SelectItem value="newest">
                                        {t("explore.sort_lists.newest")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* result */}
                        <div className="flex items-center gap-2 text-[#474747] md:shrink-0">
                            <p className="font-bold">
                                {logos?.meta?.total ?? 0}
                            </p>
                            <p>{t("explore.sort_lists.result_found")}</p>
                        </div>
                    </div>

                    {/* logo list */}
                    <div className="lg:mt-[33px]">
                        <PublicLogo initialLogos={logos?.data} />
                    </div>
                </div>

                <div className="mt-5 flex w-full flex-col items-center justify-between gap-4 border-b border-[#999999] pb-[81px] md:flex-row lg:mt-[139px]">
                    <div className="hidden flex-1 md:block"></div>
                    <Button className="flex w-full items-center justify-center bg-[#F3993F] text-white hover:bg-[#E67E00] md:max-w-[256px] lg:h-[56px]">
                        <span className="font-bold lg:text-[16px]">
                            {t("explore.load_more")}
                        </span>
                    </Button>
                    <div className="flex flex-1 items-center justify-end gap-3 text-[14px] text-[#474747] md:text-[15px] lg:text-[16px]">
                        <span className="font-medium">{t("explore.page")}</span>
                        <input
                            type="text"
                            value={currentPage}
                            className="h-[36px] w-[50px] rounded-[6px] border border-[#CCCCCC] text-center focus:border-[#F3993F] focus:ring-1 focus:ring-[#F3993F] focus:outline-none lg:h-[40px] lg:w-[60px]"
                            onChange={(e) => setCurrentPage(+e.target.value)}
                            onKeyDown={handleKeydown}
                            defaultValue={"1"}
                        />
                        <span className="font-medium text-[#8F8F8F]">
                            {t("explore.of")}{" "}
                            <span className="font-bold text-[#474747]">
                                {lastPage}
                            </span>
                        </span>
                    </div>
                </div>
                <div className="mt-[81px] md:mb-24">
                    <span className="border-brand inline-block border-b-4 pb-1 font-bold text-[#666666] md:text-[24px]">
                        <Trans
                            t={t}
                            i18nKey="explore.recentlyViewed"
                            components={{
                                span: <span className="text-brand font-bold" />,
                            }}
                        />
                    </span>
                    <div className="mt-6 md:mt-11">
                        {recentlyViewed.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                                {recentlyViewed.map((logo: Logo) => (
                                    <LogoCard
                                        key={logo.logo_id || logo.id}
                                        id={logo.logo_id || logo.id}
                                        image={logo.image}
                                        companyName={logo.companyName}
                                        logoName={logo.logoName}
                                        price=""
                                        isCompact={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                {t("explore.no_recently_viewed")}
                            </p>
                        )}
                    </div>
                </div>
            </Container>
        </AppLayout>
    );
}
