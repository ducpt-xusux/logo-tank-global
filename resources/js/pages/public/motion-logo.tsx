import { AppLayout, Container, Button } from "@/components";
import { Check, Dot, Phone, ArrowRight } from "lucide-react";

import { useTranslation, Trans } from "react-i18next";
import { getLocaleLink } from "@/helper/utils";
import { Head, Link } from "@inertiajs/react";
import { Crown } from "lucide-react";
const description_lists = [
    {
        color: "#F03641",
        number: "01",
        text: "motion_logo.description_lists_texts.text1",
    },
    {
        color: "#7531CC",
        number: "02",
        text: "motion_logo.description_lists_texts.text2",
    },
    {
        color: "#48A7FF",
        number: "03",
        text: "motion_logo.description_lists_texts.text3",
    },
    {
        color: "#FF7E47",
        number: "04",
        text: "motion_logo.description_lists_texts.text4",
    },
];

export default function MotionLogo() {
    const { t } = useTranslation("common", { useSuspense: false });
    const breadcrumbs = [
        {
            title: t("breadcrumbs.home"),
            href: getLocaleLink("/"),
        },
        {
            title: t("breadcrumbs.motion_logo_service"),
        },
    ];

    return (
        <>
            <Head title="Motion Logo" />
            <AppLayout>
                <div className="w-full overflow-x-hidden">
                    <div className="flex h-12 w-full items-center bg-[#F2F4F5] text-[12px] text-[#5F6C72] md:h-[72px] md:text-[16px]">
                        <div className="mx-auto w-full max-w-[1238px] px-4">
                            <div className="flex items-center gap-2">
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <div
                                        key={`${breadcrumb.title}-${index}`}
                                        className="flex items-center gap-2"
                                    >
                                        {index > 0 && <span>{">"}</span>}
                                        {breadcrumb.href ? (
                                            <Link
                                                href={breadcrumb.href}
                                                className="hover:text-brand transition-colors"
                                            >
                                                {breadcrumb.title}
                                            </Link>
                                        ) : (
                                            <span className="text-brand font-medium">
                                                {breadcrumb.title}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="relative mb-12 flex min-h-[450px] w-full items-center overflow-hidden md:mb-36 md:h-[750px]">
                        <video
                            className="absolute inset-0 z-0 h-full w-full object-cover"
                            src="/img/3-final.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        ></video>
                        <div className="absolute inset-0 z-10 w-full bg-gradient-to-r from-white via-white/95 to-transparent md:w-[70%] lg:w-[60%]"></div>
                        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/30 to-transparent md:hidden"></div>
                        <Container className="relative z-20 w-full py-12 md:py-0">
                            <div className="max-w-[550px] space-y-4 md:space-y-6">
                                <div className="flex flex-wrap items-center gap-4">
                                    <h1 className="text-3xl leading-[1.2] font-bold tracking-tight text-gray-900 uppercase md:text-4xl md:leading-[72px]">
                                        {t("motion_logo.banner_title")}
                                    </h1>
                                    <div className="relative z-10 mx-[-4px] inline-flex h-[60px] w-[140px] items-center justify-center px-3 py-2 text-2xl font-bold text-white uppercase md:h-25 md:w-50 md:px-3 md:py-3 md:text-[40px]">
                                        <img
                                            src="/img/logo-motion-video-text-bg.png"
                                            className="absolute top-[-15px] bottom-[-6px] left-2 z-0 h-full w-full object-fill md:top-[-23px] md:bottom-[-10px] md:left-3"
                                            alt="Video Background Badge"
                                        />
                                        <span className="relative z-10">
                                            {t("motion_logo.video_plain")}
                                        </span>
                                    </div>
                                </div>
                                <h2 className="relative z-20 text-xl text-gray-800 md:text-3xl">
                                    {t("motion_logo.banner_sub_title")}
                                </h2>
                                <p className="text-sm leading-relaxed text-[#5F6C72] md:text-base">
                                    {t("motion_logo.banner_description")}
                                </p>
                                <div className="w-full pt-2 sm:w-auto sm:max-w-xs lg:max-w-1/2">
                                    <button className="bg-brand inline-flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3.5 font-bold text-white shadow-md hover:bg-[#e07512] hover:shadow-lg active:scale-98">
                                        <span>
                                            {t("motion_logo.banner_button")}
                                        </span>
                                        <ArrowRight />
                                    </button>
                                </div>
                            </div>
                        </Container>
                    </div>
                    <Container className="relative overflow-visible py-20">
                        <div className="flex flex-col items-center gap-y-4 text-center">
                            <h2 className="z-20 text-2xl font-semibold md:text-[33px]">
                                <Trans
                                    t={t}
                                    i18nKey="motion_logo.logo_animation"
                                    components={{
                                        white: (
                                            <span className="relative z-[-1] -mx-3 inline-flex items-center justify-center bg-[url('/img/highlight-bg.svg')] bg-[length:100%_100%] bg-center bg-no-repeat px-6 py-2 text-white md:px-[48px] md:py-[12px]"></span>
                                        ),
                                    }}
                                />
                            </h2>
                            <span className="text-sm leading-relaxed text-[#5F6C72] md:text-base">
                                <Trans
                                    t={t}
                                    i18nKey="motion_logo.subtitle"
                                    components={{
                                        br: <br />,
                                    }}
                                />
                            </span>
                        </div>
                        <div className="relative mx-auto mt-10 mb-20 aspect-[755/466] w-full max-w-[850px] overflow-visible px-6 select-none md:mt-16 md:mb-[200px]">
                            {/* Background decorative circles */}
                            <img
                                src="/img/orange-circle.svg"
                                className="absolute top-[-7%] left-[-5%] z-0 w-[22%]"
                                alt=""
                            />
                            <img
                                src="/img/blue-circle.svg"
                                className="absolute right-[-8%] bottom-[-16%] z-0 w-[30%]"
                                alt=""
                            />
                            <img
                                src="/img/red-circle.svg"
                                className="absolute right-[23%] bottom-[-14.5%] z-0 w-[3.5%]"
                                alt=""
                            />

                            <svg
                                width="755"
                                height="466"
                                viewBox="0 0 755 466"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="relative z-10 h-full w-full object-contain"
                            >
                                <foreignObject
                                    x="-77.0873"
                                    y="-77.0873"
                                    width="908.667"
                                    height="619.589"
                                >
                                    <div
                                        style={{
                                            backdropFilter: "blur(38.54px)",
                                            WebkitBackdropFilter:
                                                "blur(38.54px)",
                                            clipPath:
                                                "url(#bgblur_0_352_2619_clip_path)",
                                            height: "100%",
                                            width: "100%",
                                        }}
                                    ></div>
                                </foreignObject>
                                <rect
                                    data-figma-bg-blur-radius="77.0873"
                                    width="754.492"
                                    height="465.414"
                                    rx="19.2718"
                                    fill="#F4F4F4"
                                    fillOpacity="0.6"
                                />
                                <foreignObject
                                    x="-77.0873"
                                    y="-77.0873"
                                    width="908.667"
                                    height="186.936"
                                >
                                    <div
                                        style={{
                                            backdropFilter: "blur(38.54px)",
                                            WebkitBackdropFilter:
                                                "blur(38.54px)",
                                            clipPath:
                                                "url(#bgblur_1_352_2619_clip_path)",
                                            height: "100%",
                                            width: "100%",
                                        }}
                                    ></div>
                                </foreignObject>
                                <path
                                    data-figma-bg-blur-radius="77.0873"
                                    d="M0 19.2718C0 8.62829 8.62829 0 19.2718 0H735.22C745.863 0 754.492 8.62829 754.492 19.2718V32.7621H0V19.2718Z"
                                    fill="#EAEAEA"
                                    fillOpacity="0.6"
                                />
                                <circle
                                    cx="32.7842"
                                    cy="15.9112"
                                    r="6.74514"
                                    fill="#EE6767"
                                />
                                <circle
                                    cx="55.9092"
                                    cy="15.9112"
                                    r="6.74514"
                                    fill="#F7C566"
                                />
                                <circle
                                    cx="79.0352"
                                    cy="15.9112"
                                    r="6.74514"
                                    fill="#5BEB7B"
                                />
                                <defs>
                                    <clipPath
                                        id="bgblur_0_352_2619_clip_path"
                                        transform="translate(77.0873 77.0873)"
                                    >
                                        <rect
                                            width="754.492"
                                            height="465.414"
                                            rx="19.2718"
                                        />
                                    </clipPath>
                                    <clipPath
                                        id="bgblur_1_352_2619_clip_path"
                                        transform="translate(77.0873 77.0873)"
                                    >
                                        <path d="M0 19.2718C0 8.62829 8.62829 0 19.2718 0H735.22C745.863 0 754.492 8.62829 754.492 19.2718V32.7621H0V19.2718Z" />
                                    </clipPath>
                                </defs>
                            </svg>

                            <img
                                src="/img/first-company.gif"
                                className="absolute top-[20%] left-[-2%] z-20 w-[33%] cursor-pointer transition-all duration-300 hover:z-30 hover:-translate-y-2 hover:scale-105 hover:drop-shadow-2xl md:left-[-5%]"
                                alt="First Company Logo"
                            />
                            <img
                                src="/img/horitabank.gif"
                                className="absolute top-[20%] left-[33.5%] z-20 w-[33%] cursor-pointer transition-all duration-300 hover:z-30 hover:-translate-y-2 hover:scale-105 hover:drop-shadow-2xl"
                                alt="Horitabank Logo"
                            />
                            <img
                                src="/img/SK-solutions.gif"
                                className="absolute top-[20%] right-[-2%] z-20 w-[33%] cursor-pointer transition-all duration-300 hover:z-30 hover:-translate-y-2 hover:scale-105 hover:drop-shadow-2xl md:right-[-5%]"
                                alt="SK Solutions Logo"
                            />
                            <img
                                src="/img/bernard-group.gif"
                                className="absolute bottom-[-4%] left-[12%] z-20 w-[33%] cursor-pointer transition-all duration-300 hover:z-30 hover:-translate-y-2 hover:scale-105 hover:drop-shadow-2xl md:bottom-[-8%]"
                                alt="Bernard Group Logo"
                            />
                            <img
                                src="/img/kamitta-R&I.gif"
                                className="absolute right-[12%] bottom-[-4%] z-20 w-[33%] cursor-pointer transition-all duration-300 hover:z-30 hover:-translate-y-2 hover:scale-105 hover:drop-shadow-2xl md:bottom-[-8%]"
                                alt="Kamitta R&I Logo"
                            />
                        </div>
                        <div className="mb-20 grid grid-cols-1 gap-y-16 lg:mb-43 lg:grid-cols-2 lg:gap-x-36">
                            <div className="flex flex-col gap-y-3">
                                <div className="flex flex-col gap-y-3">
                                    <h4 className="text-2xl font-semibold md:text-[35px]">
                                        <Trans
                                            t={t}
                                            i18nKey="motion_logo.heading_4_title"
                                            components={{
                                                orange: (
                                                    <span className="text-brand"></span>
                                                ),
                                                br: <br />,
                                            }}
                                        />
                                    </h4>
                                </div>
                                <span className="text-lg text-[#474747] md:text-[22px]">
                                    {t("motion_logo.description")}
                                </span>
                                <div className="flex flex-col gap-y-6">
                                    {description_lists.map(
                                        (description_list, index) => (
                                            <div
                                                className="not-first-of-type:#999999 flex flex-col gap-y-3"
                                                key={index}
                                            >
                                                <div className="flex flex-row items-start gap-x-4">
                                                    <div
                                                        className="h-[50px] w-[50px] shrink-0 rounded-full md:h-[65.2px] md:w-[65.2px]"
                                                        style={{
                                                            backgroundColor:
                                                                description_list.color,
                                                        }}
                                                    >
                                                        <span className="flex h-full items-center justify-center text-base text-white md:text-[20px]">
                                                            {
                                                                description_list.number
                                                            }
                                                        </span>
                                                    </div>
                                                    <span className="pt-2 text-base md:pt-[10px] md:text-[20px]">
                                                        {t(
                                                            `${description_list.text}`,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                            <div className="relative hidden md:mx-auto md:block md:w-[60%] lg:w-full">
                                <img
                                    src="/img/logo-motion-man-image.png"
                                    className="relative z-10 w-full"
                                    alt=""
                                />
                                <div className="bg-brand absolute top-[12%] left-[-20px] z-20 w-[154px] rounded-l-[12px] rounded-tr-[12px] p-3 shadow-lg sm:left-[-40px] md:w-[220px] md:rounded-l-[16px] md:rounded-tr-[16px] md:p-5 lg:left-[-90px] lg:w-[200px]">
                                    <p className="text-[12px] leading-snug text-white md:text-[15px] lg:text-[16px]">
                                        <Trans
                                            t={t}
                                            i18nKey="motion_logo.orange_box"
                                            components={{
                                                white: (
                                                    <span className="font-bold" />
                                                ),
                                            }}
                                        />
                                        <img
                                            src="/img/ok-finger.svg"
                                            alt=""
                                            className="ml-1 inline-block h-6 w-6"
                                        />
                                    </p>
                                </div>
                                <div className="absolute right-[-12px] bottom-[-18px] z-0 lg:right-[-24px] lg:bottom-[-36px]">
                                    <img
                                        src="/img/logo-motion-pattern.png"
                                        className="h-auto w-[90px] md:w-[120px] lg:w-[170px]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mb-20 grid grid-cols-1 gap-y-24 lg:mb-50 lg:grid-cols-2 lg:gap-x-6">
                            <div className="relative mb-12 h-[320px] sm:h-[420px] lg:mb-0 lg:h-auto">
                                <div className="absolute top-[24px] left-[-20px] z-0 h-[60px] w-[60px] rounded-full bg-[#687EF3] md:h-[93px] md:w-[93px] lg:left-[-45px]"></div>
                                <div className="absolute top-[-5px] left-[14%] z-0 h-[15px] w-[15px] rounded-full bg-[#F3A268] md:h-[22px] md:w-[22px]"></div>
                                <div className="absolute bottom-[-25px] left-[0%] h-[12px] w-[12px] rounded-full bg-[#34E7A5] md:h-[18px] md:w-[18px]"></div>
                                <div className="absolute right-[18%] bottom-[-30px] h-[12px] w-[12px] rounded-full bg-[#F3538C] md:bottom-[-50px] md:h-[18px] md:w-[18px]"></div>
                                <div className="absolute right-[10px] bottom-[-14px] z-40 flex items-center justify-center rounded-2xl bg-[#fff] shadow-lg sm:right-[40px] lg:right-[120px]">
                                    <div className="flex items-center gap-x-2 px-3 py-2 md:gap-x-3 md:py-4 md:pr-3 md:pl-4">
                                        <img src="/img/logo-motion-paper-airline.png" />
                                        <span className="text-brand text-[10px] font-semibold sm:text-[12px] md:text-[18px]">
                                            <Trans
                                                t={t}
                                                i18nKey="motion_logo.send_request_to_us"
                                                components={{
                                                    br: <br />,
                                                }}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute top-[6%] left-1/2 z-20 flex w-[80%] max-w-[380px] -translate-x-1/2 items-center justify-center lg:left-0 lg:w-auto lg:max-w-none lg:translate-x-0">
                                    <img
                                        src="/img/logo-motion-girl-bg.png"
                                        className="h-auto w-full lg:h-auto lg:w-auto"
                                        alt=""
                                    />
                                </div>
                                <div className="absolute top-[-16%] left-1/2 z-30 w-[80%] max-w-[380px] -translate-x-1/2 lg:left-0 lg:w-auto lg:max-w-none lg:translate-x-0">
                                    <img
                                        src="/img/logo-motion-girl-image.png"
                                        className="h-auto w-full lg:h-auto lg:w-auto"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-6">
                                <div className="bg-brand flex items-center justify-center gap-x-3 rounded-sm px-4 py-1.5 md:h-10 md:py-0 lg:w-full lg:max-w-[26%]">
                                    <Crown className="text-white" size={20} />
                                    <span className="text-sm font-semibold text-white">
                                        {t("motion_logo.recommended")}
                                    </span>
                                </div>
                                <span className="text-2xl leading-tight font-semibold text-[#333] md:text-[35px] md:leading-[1.6]">
                                    {t("motion_logo.logo_animation_pricing")}
                                </span>
                                <span className="text-brand text-2xl font-bold tracking-[-0.43px] md:text-[35px]">
                                    {t("motion_logo.logo_motion_price")}
                                </span>
                                <div className="flex flex-col gap-y-3">
                                    <span className="text-lg font-semibold tracking-[-0.43px]">
                                        {t("motion_logo.delivery_video_format")}
                                    </span>
                                    <div className="flex flex-row gap-x-2">
                                        <div>
                                            <span className="bg-brand mt-[3px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-white">
                                                <Check className="h-3 w-3 stroke-3" />
                                            </span>
                                        </div>
                                        <span className="text-lg">
                                            {t("motion_logo.video_format")}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full sm:max-w-xs lg:max-w-1/2">
                                    <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8A1E] px-8 py-3.5 font-bold text-white shadow-md transition-all hover:bg-[#e07512] hover:shadow-lg">
                                        <span>{t("contact_us.buy_now")}</span>
                                    </button>
                                </div>
                                <div className="">
                                    <div className="mt-2 flex max-w-[613px] flex-col gap-y-1 text-sm leading-relaxed text-[#474747] md:text-base">
                                        <p>{t("motion_logo.buy_note_1")}</p>
                                        <p>
                                            <Trans
                                                t={t}
                                                i18nKey="motion_logo.buy_note_2"
                                                components={{
                                                    br: <br />,
                                                }}
                                            />
                                        </p>
                                        <p>{t("motion_logo.buy_note_3")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-y-6 text-center">
                            <h2 className="z-20 text-2xl font-semibold capitalize md:text-[33px]">
                                <Trans
                                    t={t}
                                    i18nKey="motion_logo.explore_logo_animation"
                                    components={{
                                        white: (
                                            <span className="relative z-[-1] -mx-3 inline-flex items-center justify-center bg-[url('/img/highlight-bg.svg')] bg-[length:100%_100%] bg-center bg-no-repeat px-6 py-2 text-white md:px-[48px] md:py-[12px]"></span>
                                        ),
                                    }}
                                />
                            </h2>
                            <span className="text-sm leading-relaxed text-[#5F6C72] md:text-base">
                                <Trans
                                    t={t}
                                    i18nKey="motion_logo.subtitle2"
                                    components={{
                                        br: <br />,
                                    }}
                                />
                            </span>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src="/img/logo-motion-miyamura.gif"
                                        className="mx-auto h-auto w-full max-w-[280px] transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src="/img/logo-motion-sakai-dental-clinic.gif"
                                        className="mx-auto h-auto w-full max-w-[280px] transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src="/img/logo-motion-plus-one.gif"
                                        className="mx-auto h-auto w-full max-w-[280px] transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src="/img/logo-motion-noguchi-sho-ten.gif"
                                        className="mx-auto h-auto w-full max-w-[280px] transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src="/img/logo-motion-terraplus.gif"
                                        className="mx-auto h-auto w-full max-w-[280px] transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src="/img/logo-motion-fish.gif"
                                        className="mx-auto h-auto w-full max-w-[280px] transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src="/img/logo-motion-tower.gif"
                                        className="mx-auto h-auto w-full max-w-[280px] transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src="/img/logo-motion-hari.gif"
                                        className="mx-auto h-auto w-full max-w-[280px] transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src="/img/logo-motion-kgc.gif"
                                        className="mx-auto h-auto w-full max-w-[280px] transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </AppLayout>
        </>
    );
}
