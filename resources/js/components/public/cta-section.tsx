import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { Copyright } from "lucide-react";
import { TtIcon, HqIcon } from "@/components/icon";
import { Link } from "@inertiajs/react";
import { getLocaleLink } from "@/helper/utils";
export function CtaSection() {
    const { t } = useTranslation("common", { useSuspense: false });
    const fields = [
        {
            icon: <HqIcon className="h-6 w-6" />,
            text: t("home.cta.hightQualityFiles"),
        },
        {
            icon: <TtIcon className="h-6 w-6" />,
            text: t("home.cta.Typography_Font_files_included"),
        },
        {
            icon: <Copyright className="text-brand" />,
            text: t("home.cta.copyrightOwnership"),
        },
    ];
    const handleRegisterClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.location.href = `${getLocaleLink("/")}?show_login=true`;
    };
    return (
        <>
            <div className="bg-brand relative mt-16 w-full overflow-hidden md:mt-24 lg:mt-32">
                {/* Squiggle Line */}
                <img
                    src="/img/squiggle-line.png"
                    alt=""
                    className="pointer-events-none absolute top-0 right-0 z-0 h-full w-[80%] max-w-[390px] opacity-30 md:w-[60%] lg:opacity-100"
                />
                <Container className="relative z-10">
                    <div className="flex flex-col items-center md:flex-row md:items-stretch">
                        {/* The man image */}
                        <div className="flex w-full shrink-0 justify-center self-end pt-8 md:w-5/12 md:justify-start">
                            <img
                                src="/img/cta-section.png"
                                alt="The man image"
                                className="h-auto w-3/4 max-w-[300px] object-contain object-bottom md:w-full md:max-w-[450px]"
                            />
                        </div>

                        {/* Text and Button */}
                        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center md:items-start md:py-16 md:pl-6 md:text-left lg:py-18 lg:pl-10">
                            <h2 className="text-2xl leading-tight text-white md:text-3xl lg:text-4xl">
                                <Trans
                                    t={t}
                                    i18nKey="home.cta.title_1"
                                    components={{
                                        highlight: (
                                            <span className="font-bold text-white" />
                                        ),
                                    }}
                                />
                            </h2>
                            <p className="sm: mt-3 text-2xl text-white/90 md:mt-5 md:text-lg lg:text-4xl">
                                <Trans
                                    t={t}
                                    i18nKey="home.cta.title_2"
                                    components={{
                                        highlight: (
                                            <span className="font-bold text-white" />
                                        ),
                                    }}
                                />
                            </p>
                            <div className="mt-6 md:mt-8 lg:mt-10">
                                <Button
                                    // onClick={handleRegisterClick}
                                    className="h-[44px] rounded-full bg-[#FFC224] px-8 text-sm font-semibold text-[#161439] transition-transform hover:bg-[#d1a128] sm:text-base md:h-[56px] md:px-10 md:text-lg lg:h-[60px] lg:px-12 lg:text-xl"
                                >
                                    {t("home.cta.button")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="relative z-10">
                <div className="mt-30 flex w-full flex-row flex-nowrap justify-between gap-x-20 md:mt-47">
                    <div className="max-w-[613px]">
                        <img src="/img/image_brand1.png" alt="" />
                    </div>
                    <div className="mt-30">
                        <h2 className="text-2xl leading-tight md:text-4xl">
                            <Trans
                                t={t}
                                i18nKey="home.cta.over_30000"
                                components={{
                                    black: (
                                        <span className="font-bold text-[#474747]" />
                                    ),
                                    yellow: (
                                        <span className="text-brand font-bold" />
                                    ),
                                }}
                            />
                        </h2>
                        <p className="mt-6 max-w-[541px] text-justify text-lg leading-relaxed tracking-wide">
                            {t("home.cta.description")}
                        </p>
                    </div>
                </div>
                <div className="mt-47 flex flex-row">
                    <div className="w-full">
                        <h2 className="text-2xl leading-tight md:text-4xl">
                            <Trans
                                t={t}
                                i18nKey="home.cta.build_brand"
                                components={{
                                    black: (
                                        <span className="font-bold text-[#474747]" />
                                    ),
                                    yellow: (
                                        <span className="text-brand font-bold" />
                                    ),
                                }}
                            />
                        </h2>
                        <p className="mt-6 max-w-[541px] text-justify text-lg leading-relaxed tracking-wide">
                            {t("home.cta.description_2")}
                        </p>
                        <div className="mt-11 flex flex-col gap-y-6">
                            {fields.map((field, index) => (
                                <div className="flex flex-row gap-4">
                                    <div
                                        key={index}
                                        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE7D1]"
                                    >
                                        {field.icon}
                                    </div>
                                    <span className="flex flex-row items-center text-xl">
                                        {field.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="max-w-[613px]">
                        <img src="/img/image_brand2.png" />
                    </div>
                </div>
            </Container>

            {/* Grey Area */}
            <div className="z-10 w-full bg-[#F5F5F5] text-center">
                <Container className="mt-24">
                    <div className="">
                        <h2 className="text-brand text-5xl font-bold">
                            {t("home.cta.whQuestion")}
                        </h2>
                        <p className="mt-2 text-2xl leading-[63px]">
                            {t("home.cta.sub_title")}
                        </p>
                    </div>
                    <div className="mt-23">
                        <div className="grid gap-x-6 gap-y-26 md:grid-cols-3">
                            <div className="flex flex-col rounded-lg bg-white shadow-2xl">
                                <div className="flex h-[235px] items-center justify-center rounded-t-lg bg-[#FF8D26]/20 p-6">
                                    <img
                                        src="/img/Group_1255.svg"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="p-6 text-left">
                                    <h3 className="text-xl font-bold text-[#000000]">
                                        {t("home.cta.social.title")}
                                    </h3>
                                    <p className="mt-3 text-sm text-[#000000]">
                                        {t("home.cta.social.description")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col rounded-lg bg-white shadow-2xl">
                                <div className="flex h-[235px] items-center justify-center rounded-t-lg bg-[#EFEEEC] p-6">
                                    <img
                                        src="/img/software_app.svg"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="p-6 text-left">
                                    <h3 className="text-xl font-bold text-[#000000]">
                                        {t("home.cta.softwareAndApp.title")}
                                    </h3>
                                    <p className="mt-3 text-sm text-[#000000]">
                                        {t(
                                            "home.cta.softwareAndApp.description",
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col rounded-lg bg-white shadow-2xl">
                                <div className="flex h-[235px] flex-row items-center justify-center rounded-t-lg">
                                    <img
                                        src="/img/business.png"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="p-6 text-left">
                                    <h3 className="text-xl font-bold text-[#000000]">
                                        {t("home.cta.business.title")}
                                    </h3>
                                    <p className="mt-3 text-sm text-[#000000]">
                                        {t("home.cta.business.description")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col rounded-lg bg-white shadow-2xl">
                                <div className="flex h-[235px] flex-row items-center justify-center rounded-t-lg">
                                    <img
                                        src="/img/companyOrganization.png"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="p-6 text-left">
                                    <h3 className="text-xl font-bold text-[#000000]">
                                        {t(
                                            "home.cta.companyOrganization.title",
                                        )}
                                    </h3>
                                    <p className="mt-3 text-sm text-[#000000]">
                                        {t(
                                            "home.cta.companyOrganization.description",
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col rounded-lg bg-white shadow-2xl">
                                <div className="flex h-[235px] flex-row items-center justify-center rounded-t-lg">
                                    <img
                                        src="/img/brandSymbol.png"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="p-6 text-left">
                                    <h3 className="text-xl font-bold text-[#000000]">
                                        {t("home.cta.brandSymbol.title")}
                                    </h3>
                                    <p className="mt-3 text-sm text-[#000000]">
                                        {t("home.cta.brandSymbol.description")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col rounded-lg bg-white shadow-2xl">
                                <div className="flex h-[235px] flex-row items-center justify-center rounded-t-lg">
                                    <img
                                        src="/img/web-blog.png"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="p-6 text-left">
                                    <h3 className="text-xl font-bold text-[#000000]">
                                        {t("home.cta.webBlog.title")}
                                    </h3>
                                    <p className="mt-3 text-sm text-[#000000]">
                                        {t("home.cta.webBlog.description")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-11 flex w-full flex-row justify-center">
                        <Button className="h-[40] cursor-pointer rounded-[4px] bg-[#474747] px-8 text-base text-white hover:bg-[#5b5858]">
                            <Link href={getLocaleLink("/explore")}>
                                {t("home.loadMore")}
                            </Link>
                        </Button>
                    </div>
                </Container>
            </div>
        </>
    );
}
