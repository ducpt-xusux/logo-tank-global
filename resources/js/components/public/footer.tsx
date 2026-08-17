import React from "react";
import { useTranslation } from "react-i18next";

import { Container } from "./container";
import { Phone } from "lucide-react";
interface PublicFooterProps {
    className?: string;
    showOrangeBanner?: boolean;
}

export function PublicFooter({
    className = "bg-white pt-20",
    showOrangeBanner = true,
}: PublicFooterProps) {
    const { i18n, t } = useTranslation("common", { useSuspense: false });

    return (
        <footer className={`max-h-[755px] ${className}`}>
            {/* Orange Banner */}
            {showOrangeBanner && (
                <div className="relative hidden w-full bg-[#F3993F] md:block">
                    <Container className="relative flex min-h-[250px] items-center md:min-h-[300px]">
                        {/* The Logotank Man */}
                        <div className="absolute bottom-0 left-0 z-10 w-50 md:left-0 md:w-[260px] lg:left-[5%] lg:w-[310px]">
                            <img
                                src="/img/footer.png"
                                alt="The Logotank Man"
                                className="h-auto w-full object-contain"
                            />
                        </div>

                        <div className="ml-auto w-full py-10 pr-4 pl-[210px] text-white md:w-2/3 md:pl-10 lg:w-[65%] lg:pl-16">
                            <div className="mb-3 flex items-center gap-3">
                                <span className="relative z-10 inline-flex items-center justify-center bg-[url('/img/highlight-red.svg')] bg-size-[100%_100%] bg-center bg-no-repeat px-[20px] py-[12px] text-lg font-bold text-white uppercase">
                                    {t("footer.contact")}
                                </span>
                                <span className="text-xl font-medium tracking-wide uppercase">
                                    {t("footer.customerSupport")}
                                </span>
                            </div>

                            <div className="mb-3 flex items-center gap-3">
                                <Phone className="h-10 w-10 fill-current text-white" />
                                <h2 className="text-4xl font-extrabold tracking-wider md:text-5xl">
                                    0120-572-254
                                </h2>
                            </div>

                            <div className="w-full">
                                <p className="mb-6 md:text-[20px]">
                                    {t("footer.businessHrs")}
                                </p>

                                <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between lg:gap-8">
                                    <a href="" className="w-full md:flex-1">
                                        <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[6px] bg-[#474747] px-4 py-3 text-[15px] font-semibold text-white shadow transition-colors hover:bg-gray-700 xl:text-[16px]">
                                            <img
                                                src="/img/gmail.png"
                                                alt=""
                                                className="h-[32px] w-[32px] object-contain"
                                            />
                                            <span>{t("footer.email")}</span>
                                        </button>
                                    </a>
                                    <a href="" className="w-full md:flex-1">
                                        <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[6px] bg-[#2563EB] px-4 py-3 text-[15px] font-semibold text-white shadow transition-colors hover:bg-blue-700 xl:text-[16px]">
                                            <img
                                                src="/img/zalo.png"
                                                alt=""
                                                className="h-[32px] w-[32px] object-contain"
                                            />
                                            <span>{t("footer.zalo")}</span>
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            )}

            <div className="bg-[#474747] pt-16 pb-6 text-white">
                <Container>
                    <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                        <div className="flex w-full flex-col items-center text-center md:w-[40%] md:items-start md:text-left">
                            <div className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold text-[#F3993F] md:justify-start">
                                <img
                                    src="/img/logo-full.svg"
                                    alt=""
                                    className="h-10 w-auto"
                                />
                            </div>
                            <p className="max-w-md text-sm leading-relaxed text-white">
                                {t("footer.introduction")}
                            </p>
                        </div>

                        <div className="flex w-full flex-col items-center md:w-[50%] md:items-end">
                            <ul className="flex flex-wrap justify-center gap-4 text-sm text-white uppercase md:justify-end md:gap-8">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-[#F3993F]"
                                    >
                                        {t("headers.homepage")}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-[#F3993F]"
                                    >
                                        {t("headers.category")}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-[#F3993F]"
                                    >
                                        BLOG
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-[#F3993F]"
                                    >
                                        {t("headers.contact_us")}
                                    </a>
                                </li>
                            </ul>

                            <div className="mt-6 flex justify-center gap-3 md:justify-end">
                                <a
                                    href="https://www.facebook.com/logotankus"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                                >
                                    <img src="/img/facebook.svg" alt="" />
                                </a>
                                <a
                                    href="https://www.instagram.com/logotankus/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="flex h-11 w-11 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                                >
                                    <img src="/img/instagram.svg" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-between border-t border-white pt-6 text-xs text-white md:flex-row">
                        <a
                            href="#"
                            className="transition-colors hover:text-[#F3993F]"
                        >
                            {t("footer.policy")}
                        </a>
                        <p className="my-4 md:my-0">
                            Copyright (C) 2024 logo-tank.net All Rights
                            Reserved.
                        </p>
                        <a
                            href="#"
                            className="transition-colors hover:text-[#F3993F]"
                        >
                            {t("footer.term")}
                        </a>
                    </div>
                </Container>
            </div>
        </footer>
    );
}
