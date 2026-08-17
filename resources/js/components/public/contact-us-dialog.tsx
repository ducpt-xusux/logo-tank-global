import { useState, useEffect, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { usePage, useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import { SharedData } from "@/types";
import {
    Palette,
    BadgeCheck,
    Info,
    ShoppingCart,
    Minus,
    Plus,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components";
import { getManualPrice, getMotionPrice, currencyNumber } from "@/helper/utils";
import { usePackageCartStore } from "@/stores/package-cart.storage";

const PLAN_TYPES = {
    STANDARD: "standard",
    PROFESSIONAL: "professional",
    PREMIUM: "premium",
} as const;

type PlanType = (typeof PLAN_TYPES)[keyof typeof PLAN_TYPES];

const planGiftsImages: Record<PlanType, Record<string, string[]>> = {
    [PLAN_TYPES.STANDARD]: {
        item_3: ["/img/contact_us_letter_header_form.png"],
        item_4: ["/img/gift_card_1.png", "/img/gift_card_2.png"],
    },
    [PLAN_TYPES.PROFESSIONAL]: {
        item_4: ["/img/gift_card_1.png", "/img/gift_card_2.png"],
        item_5: ["/img/contact_us_letter_form.png"],
        item_6: ["/img/contact_us_letter_header_form.png"],
        item_7: [
            "/img/contact_us_office_bag_1.png",
            "/img/contact_us_office_bag_2.png",
        ],
    },
    [PLAN_TYPES.PREMIUM]: {
        item_4: ["/img/gift_card_1.png", "/img/gift_card_2.png"],
        item_5: ["/img/contact_us_letter_form.png"],
        item_6: ["/img/contact_us_letter_header_form.png"],
        item_7: [
            "/img/contact_us_office_bag_1.png",
            "/img/contact_us_office_bag_2.png",
        ],
        item_8: ["/img/contact_us_intro_logo.mp4"],
    },
} as const;

const planKeyMap: Record<string, PlanType> = {
    plan_1: PLAN_TYPES.STANDARD,
    plan_2: PLAN_TYPES.PROFESSIONAL,
    plan_3: PLAN_TYPES.PREMIUM,
};

interface ContactUsDialogType {
    open?: boolean;
    setOpenContactUs?: (state: boolean) => void;
    selectedPlan?: string;
}

export function ContactUsDialog({
    open,
    setOpenContactUs,
    selectedPlan,
}: ContactUsDialogType) {
    const { t, i18n } = useTranslation("common", { useSuspense: false });
    const { packages, auth } = usePage<SharedData>().props as any;
    const [activeTab, setActiveTab] = useState<"info" | "gift">("info");

    const { data, setData, post, processing, reset, transform } = useForm({
        package_id: null as number | null,
        quantity: 1,
        logoManual: "none",
        logoMotion: "none",
    });

    const isPremiumPlan = useMemo(
        () =>
            selectedPlan === "plan_1" ||
            selectedPlan === "plan_2" ||
            selectedPlan === "plan_3",
        [selectedPlan],
    );

    const currentPackage = useMemo(() => {
        if (!selectedPlan || !packages?.full_design) return null;
        return packages.full_design.find((p: any) => p.key === selectedPlan);
    }, [selectedPlan, packages]);

    const planKey = useMemo(() => {
        return planKeyMap[selectedPlan || ""] || "standard";
    }, [selectedPlan]);

    const giftImages = useMemo(() => {
        return (
            planGiftsImages[planKey as keyof typeof planGiftsImages] ||
            planGiftsImages.standard
        );
    }, [planKey]);

    useEffect(() => {
        if (open) {
            if (currentPackage) {
                setData("package_id", currentPackage.id);
            }
        } else {
            reset();
            setActiveTab("info");
        }
    }, [open, currentPackage]);

    const logoManualOption = [
        { label: t("logoDetail.no_thank"), value: "none" },
        {
            label: `${t("logoDetail.logo_manual_option")} + ${currencyNumber(getManualPrice(), true)}`,
            value: "manual_pdf",
        },
    ];

    const logoMotionOptions = [
        { label: t("logoDetail.no_thank"), value: "none" },
        {
            label: `${t("logoDetail.motion_logo_option")} + ${currencyNumber(getMotionPrice(), true)}`,
            value: "motion",
        },
    ];

    const formFieldsConfig = [
        {
            id: "logoManual",
            options: logoManualOption,
        },
        {
            id: "logoMotion",
            options: logoMotionOptions,
        },
    ] as const;

    transform((data) => ({
        items: [
            {
                package_id: data.package_id,
                quantity: data.quantity,
                logoManual: data.logoManual === "manual_pdf",
                logoMotion: data.logoMotion === "motion",
            },
        ],
        type: "package",
    }));

    const processData: any = t("contact_us.dialog.process", {
        returnObjects: true,
    });

    const totalPrice = useMemo(() => {
        const basePrice = currentPackage?.prices?.[i18n.language] || 0;
        let additionalPrice = 0;

        if (data.logoManual === "manual_pdf") {
            additionalPrice += getManualPrice();
        }
        if (data.logoMotion === "motion") {
            additionalPrice += getMotionPrice();
        }

        return (basePrice + additionalPrice) * data.quantity;
    }, [
        currentPackage,
        i18n.language,
        data.logoManual,
        data.logoMotion,
        data.quantity,
    ]);

    const { addItem } = usePackageCartStore();

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!data.package_id || !currentPackage) return;

        addItem({
            packageId: data.package_id,
            packageKey: currentPackage.key,
            packageName:
                t(`contact_us.dialog.title_${selectedPlan}`) ||
                selectedPlan ||
                "",
            prices: currentPackage.prices,
            quantity: data.quantity,
            logoManual: data.logoManual === "manual_pdf",
            logoMotion: data.logoMotion === "motion",
        });

        toast.success(t("logoDetail.add_to_cart") || "Added to cart");

        setOpenContactUs?.(false);
    };
    return (
        <Dialog open={open} onOpenChange={setOpenContactUs}>
            <DialogContent className="top-[50%] w-[94%] bg-white p-0 sm:max-w-lg md:top-[55%] md:w-full md:max-w-[1113px]">
                <div className="mx-auto mt-4 flex h-[85vh] w-full max-w-[860px] flex-col md:mt-10 md:h-[75vh]">
                    <DialogHeader className="relative shrink-0 px-6 py-6 pb-2">
                        <DialogTitle className="text-brand z-10 pr-10 text-left text-2xl leading-tight font-bold wrap-break-word uppercase md:text-[36px] lg:text-[32px]">
                            {t("contact_us.dialog.title_common")}
                            <br />(
                            {t(`contact_us.dialog.title_${selectedPlan}`)})
                        </DialogTitle>
                        <img
                            src="/img/pen_girl.png"
                            alt=""
                            className="absolute right-0 bottom-4 block h-[80px] object-contain md:right-[-30px] md:bottom-15 md:h-[120px]"
                        />
                        <img src="/img/draw-line.png" alt="" />
                    </DialogHeader>

                    <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                        <div className="space-y-4">
                            <div className="mb-4 flex flex-row items-center gap-2">
                                <span className="text-xl font-bold text-[#474747]">
                                    {processData.title}
                                </span>
                                <Palette className="h-6 w-6 text-[#FF6A00]" />
                            </div>

                            {processData.steps?.map(
                                (step: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="mb-6 flex flex-col gap-2"
                                    >
                                        <span className="text-base font-bold text-black">
                                            {step.heading}
                                        </span>
                                        {step.desc && (
                                            <span
                                                className="text-base text-black"
                                                dangerouslySetInnerHTML={{
                                                    __html: step.desc,
                                                }}
                                            />
                                        )}
                                        {step.bullets &&
                                            step.bullets.map(
                                                (bullet: string, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="flex flex-row items-start gap-2"
                                                    >
                                                        <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                                                        <span className="text-base text-black">
                                                            {bullet}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                    </div>
                                ),
                            )}

                            {processData.additional_services_title && (
                                <div className="mb-6 flex flex-col gap-2">
                                    <p className="text-base font-bold text-black">
                                        {processData.additional_services_title}
                                    </p>
                                    {processData.additional_services?.map(
                                        (service: string, index: number) => (
                                            <div
                                                key={index}
                                                className="flex flex-row items-start gap-2"
                                            >
                                                <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                                                <span
                                                    className="text-base text-black"
                                                    dangerouslySetInnerHTML={{
                                                        __html: service,
                                                    }}
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}

                            <div className="mt-6">
                                {isPremiumPlan && (
                                    <div className="mb-6 flex w-full">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("info")}
                                            className={`flex-1 border-b-2 py-3 text-center text-[13px] font-bold uppercase transition-colors ${
                                                activeTab === "info"
                                                    ? "border-[#FF8D26] text-black"
                                                    : "border-gray-200 text-gray-400 hover:text-black"
                                            }`}
                                        >
                                            {t(
                                                "contact_us.dialog.gift.title_1",
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("gift")}
                                            className={`flex-1 border-b-2 py-3 text-center text-[13px] font-bold uppercase transition-colors ${
                                                activeTab === "gift"
                                                    ? "border-[#FF8D26] text-black"
                                                    : "border-gray-200 text-gray-400 hover:text-black"
                                            }`}
                                        >
                                            {t(
                                                "contact_us.dialog.gift.title_2",
                                            )}
                                        </button>
                                    </div>
                                )}

                                <div
                                    className={
                                        isPremiumPlan && activeTab !== "info"
                                            ? "hidden"
                                            : "block"
                                    }
                                >
                                    <div className="flex items-center gap-x-2 bg-white">
                                        <p className="text-xl font-bold text-black">
                                            {t(
                                                "contact_us.dialog.process.form.title",
                                            )}
                                        </p>
                                        <BadgeCheck className="h-[26px] w-[26px] fill-[#FF8D26] stroke-white" />
                                    </div>
                                </div>

                                <div
                                    className={
                                        isPremiumPlan && activeTab !== "info"
                                            ? "hidden"
                                            : "block"
                                    }
                                >
                                    {processData?.form?.fields?.map(
                                        (field: any, index: number) => {
                                            const config =
                                                formFieldsConfig[index];
                                            if (!config) return null;

                                            return (
                                                <div
                                                    key={config.id}
                                                    className="mt-5 flex flex-col gap-2 bg-white"
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-base text-black">
                                                            {field.label}
                                                        </span>
                                                        {field.info && (
                                                            <Info className="h-[19px] w-[19px] text-[#D74B3A]" />
                                                        )}
                                                    </div>
                                                    <Select
                                                        value={data[config.id]}
                                                        onValueChange={(val) =>
                                                            setData(
                                                                config.id,
                                                                val,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-12 w-full rounded-none border-gray-300 bg-white text-[13px] text-gray-400 shadow-none">
                                                            <SelectValue
                                                                placeholder={
                                                                    field.placeholder
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {config.options.map(
                                                                (
                                                                    opt: any,
                                                                    optIdx: number,
                                                                ) => (
                                                                    <SelectItem
                                                                        key={
                                                                            optIdx
                                                                        }
                                                                        value={
                                                                            opt.value
                                                                        }
                                                                    >
                                                                        {
                                                                            opt.label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>

                                {isPremiumPlan && (
                                    <div
                                        className={
                                            activeTab === "gift"
                                                ? "block"
                                                : "hidden"
                                        }
                                    >
                                        <div className="min-h-[250px] space-y-5 pt-8 md:space-y-7">
                                            <div className="flex flex-col gap-6 pb-4">
                                                <div className="flex items-center gap-x-2 bg-white">
                                                    <p className="text-lg font-bold text-black md:text-xl!">
                                                        {t(
                                                            `contact_us.dialog.gift.${planKey}.heading`,
                                                        )}
                                                    </p>
                                                    <BadgeCheck className="h-5 w-5 fill-[#FF8D26] stroke-white md:h-[26px] md:w-[26px]" />
                                                </div>

                                                <div className="grid grid-cols-[86px_1fr] text-sm font-semibold text-black md:text-base">
                                                    <span>
                                                        {t(
                                                            `contact_us.dialog.gift.${planKey}.item_1_label`,
                                                        )}
                                                    </span>
                                                    <span>
                                                        <Trans
                                                            t={t}
                                                            i18nKey={`contact_us.dialog.gift.${planKey}.item_1_value`}
                                                            components={{
                                                                br: <br />,
                                                            }}
                                                        />
                                                    </span>
                                                </div>

                                                <p className="text-sm font-semibold text-black md:text-base">
                                                    <Trans
                                                        t={t}
                                                        i18nKey={`contact_us.dialog.gift.${planKey}.item_2`}
                                                        components={{
                                                            highlight: (
                                                                <span className="text-[#D74B3A]" />
                                                            ),
                                                        }}
                                                    />
                                                </p>

                                                {!giftImages.hasOwnProperty(
                                                    "item_3",
                                                ) && (
                                                    <p className="text-sm font-semibold text-black md:text-base">
                                                        <Trans
                                                            t={t}
                                                            i18nKey={`contact_us.dialog.gift.${planKey}.item_3`}
                                                            components={{
                                                                highlight: (
                                                                    <span className="text-[#D74B3A]" />
                                                                ),
                                                            }}
                                                        />
                                                    </p>
                                                )}

                                                {Object.entries(giftImages).map(
                                                    ([itemKey, imgSrcs]) => (
                                                        <div
                                                            key={itemKey}
                                                            className="flex flex-col gap-y-4"
                                                        >
                                                            <p className="text-sm font-semibold text-black md:text-base">
                                                                {t(
                                                                    `contact_us.dialog.gift.${planKey}.${itemKey}`,
                                                                )}
                                                            </p>
                                                            <div
                                                                className={`flex flex-col gap-4 sm:flex-row sm:gap-6 ${itemKey === "item_7"}`}
                                                            >
                                                                {imgSrcs.map(
                                                                    (
                                                                        imgSrc,
                                                                        idx,
                                                                    ) => {
                                                                        const isVideo =
                                                                            imgSrc.endsWith(
                                                                                ".mp4",
                                                                            );
                                                                        return isVideo ? (
                                                                            <video
                                                                                src={
                                                                                    imgSrc
                                                                                }
                                                                                className="h-auto w-full max-w-[500px]"
                                                                                autoPlay
                                                                                loop
                                                                                muted
                                                                                playsInline
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                src={
                                                                                    imgSrc
                                                                                }
                                                                                alt=""
                                                                                className={`h-auto w-full sm:w-[200px] md:w-[268px] ${itemKey === "item_7" ? "shrink-0" : ""}`}
                                                                                onError={(
                                                                                    e,
                                                                                ) => {
                                                                                    e.currentTarget.style.display =
                                                                                        "none";
                                                                                }}
                                                                            />
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="px-auto mt-8 w-full space-y-10 border-t border-[#474747] pt-6 pb-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Left Side: Status and Price */}
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-600">
                                                {t("contact_us.status")}{" "}
                                                <span className="font-semibold text-[#2DB224]">
                                                    {t("contact_us.in_stock")}
                                                </span>
                                            </p>
                                            <div className="flex flex-col gap-1 xl:flex-row xl:items-end">
                                                <h5 className="text-brand text-[28px] leading-none font-bold">
                                                    {currencyNumber(
                                                        totalPrice,
                                                        true,
                                                    )}
                                                </h5>
                                                <span className="pb-1 text-sm text-gray-500">
                                                    ( {t("logoDetail.with_tax")}{" "}
                                                    )
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Side: Quantity and Add to Cart */}
                                        <div className="flex flex-col items-end gap-3">
                                            {/* Quantity Input */}
                                            <div className="flex h-12 w-[140px] items-center justify-between rounded-md border border-[#34ACE0] bg-white px-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "quantity",
                                                            Math.max(
                                                                1,
                                                                data.quantity -
                                                                    1,
                                                            ),
                                                        )
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-sm text-gray-600 hover:bg-gray-100 hover:text-black"
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={data.quantity}
                                                    onChange={(e) =>
                                                        setData(
                                                            "quantity",
                                                            Math.max(
                                                                1,
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 1,
                                                            ),
                                                        )
                                                    }
                                                    className="w-12 border-none text-center text-[15px] font-medium text-gray-800 outline-none focus:ring-0"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "quantity",
                                                            data.quantity + 1,
                                                        )
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-sm text-gray-600 hover:bg-gray-100 hover:text-black"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <div className="grid grid-cols-[minmax(0,1fr)_310px]">
                                        <div className=""></div>
                                        <button
                                            type="submit"
                                            className="bg-brand flex h-[56px] w-full items-center justify-center gap-2 rounded-md font-bold text-white uppercase shadow-sm transition hover:bg-[#e67e22] md:max-w-[310px]"
                                            disabled={processing}
                                            onClick={() => handleSubmit()}
                                        >
                                            {t("contact_us.buy_now")}{" "}
                                            <ShoppingCart size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
