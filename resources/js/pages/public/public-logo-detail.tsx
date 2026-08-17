import { useState, useMemo, FormEventHandler } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Head, usePage, router } from "@inertiajs/react";
import { SharedData, Logo } from "@/types";
import { Heart, ShoppingCart, Dot } from "lucide-react";
import { AppLayout, Container } from "@/components";
import { ImageSlider } from "@/components/public";
import PublicRecommendedLogo from "@/components/public/public-recommended-logo";
import LogoDetailTabs from "@/components/public/logo-detail-tabs";
import { Button } from "@/components";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import SignIn from "@/components/user/sign-in";
import {
    getManualPrice,
    getLogoPrice,
    getMotionPrice,
    currencyNumber,
    stringToNumber,
} from "@/helper/utils";
import { useSystemStore } from "@/stores";
import { toast } from "react-toastify";

type LogoOptionType = {
    id:
        | "plan"
        | "shipping"
        | "logo_manual"
        | "sub_text"
        | "main_text"
        | "animation";
    label: string;
    type: "select" | "text";
    options?: string[];
    placeholder?: string;
    helpText: string;
    value?: string;
};

export default function PublicLogoDetail() {
    const { i18n, t } = useTranslation("common", { useSuspense: false });
    const [showSignIn, setShowSignIn] = useState(false);
    const { logo, auth } = usePage<SharedData & { logo?: any }>().props;
    const guideText = (key: "guide_1" | "guide_2" | "guide_3" | "guide_4") =>
        t(`logoDetail.${key}`, {
            defaultValue: t(`logo_detail.${key}`),
        });
    // Form states
    const [selectedManual, setSelectedManual] = useState<boolean>(false);
    const [selectedMotion, setSelectedMotion] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        plan: "",
        shipping: "",
        sub_text: "",
        main_text: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const logoManualOption = [
        { id: 1, name: t("logoDetail.no_thank"), value: 0 },
        {
            id: 2,
            name: `${t("logoDetail.logo_manual_option")} + ${currencyNumber(getManualPrice(), true)}`,
            value: getManualPrice(),
        },
    ];

    const logoMotionOptions = [
        t("logoDetail.no_thank"),
        `${t("logoDetail.motion_logo_option")} + ${currencyNumber(getMotionPrice(), true)}`,
    ];

    const totalPrice = useMemo(() => {
        const basePrice = stringToNumber(getLogoPrice().toString());
        const manualPrice = selectedManual
            ? stringToNumber(getManualPrice().toString())
            : 0;
        const motionPrice = selectedMotion
            ? stringToNumber(getMotionPrice().toString())
            : 0;
        return basePrice + manualPrice + motionPrice;
    }, [selectedManual, selectedMotion, i18n.language]);

    const logoOption: LogoOptionType[] = [
        {
            id: "logo_manual",
            label: t("logoDetail.logo_manual"),
            type: "select",
            options: logoManualOption.map((opt) => opt.name),
            helpText: guideText("guide_3"),
        },
        {
            id: "sub_text",
            label: t("logoDetail.sub_text"),
            type: "text",
            placeholder: `${t("logoDetail.place_holder")}...`,
            helpText: guideText("guide_1"),
        },
        {
            id: "main_text",
            label: t("logoDetail.main_text"),
            type: "text",
            placeholder: `${t("logoDetail.place_holder")}...`,
            helpText: guideText("guide_2"),
        },
        {
            id: "animation",
            label: t("logoDetail.animation"),
            type: "select",
            options: logoMotionOptions,
            helpText: guideText("guide_4"),
        },
    ];
    const logoData = logo?.data || logo;
    const { shoppingCart, setShoppingCart } = useSystemStore();
    const localizedLogoName =
        (i18n.language === "vi"
            ? logoData?.logo_language?.vi
            : i18n.language === "ja"
              ? logoData?.logo_language?.ja
              : logoData?.logo_language?.en) || logoData?.logo_name;

    const handleAddToCart: FormEventHandler = (e) => {
        e.preventDefault();

        if (logoData?.inactive) return;
        if (logoData?.kept && logoData?.is_user_kept === false) return;

        let newErrors: { [key: string]: string } = {};
        if (!formData.main_text.trim()) {
            newErrors.main_text =
                t("logoDetail.require_text") || "メインネームは必須です";
        }
        if (!formData.sub_text.trim()) {
            newErrors.sub_text =
                t("logoDetail.require_text") || "サブネームは必須です";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const exist = shoppingCart.find(
            (item) => item.productId === logoData?.logo_id,
        );

        if (!exist) {
            const newCart = [
                ...shoppingCart,
                {
                    userId: auth.user ? auth.user.id : 0,
                    productId: logoData?.logo_id ?? 0,
                    subName: formData.sub_text,
                    mainName: formData.main_text,
                    logoMotion: selectedMotion,
                    logoManual: selectedManual,
                    product: logoData,
                },
            ];
            setShoppingCart(newCart);
            toast.success(
                t("logoDetail.added_to_cart") || "カートに追加されました",
            );
        } else {
            toast.error(
                t("logoDetail.prod_cart_exist") ||
                    "商品はすでにカート内に存在します",
            );
        }
    };

    const favoriteEvent = () => {
        if (auth.user) {
            router.post(route("public.logo.favorite", logoData.logo_id), {
                preserveScroll: true,
            });
        } else {
            setShowSignIn(true);
        }
    };

    const handleOptionChange = (id: string, value: string) => {
        if (id === "logo_manual") {
            setSelectedManual(value !== logoManualOption[0].name);
        } else if (id === "animation") {
            setSelectedMotion(value !== logoMotionOptions[0]);
        } else {
            setFormData((prev) => ({ ...prev, [id]: value }));
        }
    };

    const fileImageMulti = logoData
        ? [logoData.src, logoData.url_img_two].filter(
              (item) =>
                  typeof item === "string" &&
                  item.trim() !== "" &&
                  item.toLowerCase() !== "null",
          )
        : [];

    return (
        <>
            <Head title="Logo Detail" />
            <AppLayout>
                <div className="flex w-full items-center bg-[#F2F4F5] lg:h-[72px]">
                    <Container className="w-full text-[10px] text-[#5F6C72] lg:text-[14px]">
                        <div className="">
                            <span>Logo {">"} </span>
                            <span className="text-brand">
                                {localizedLogoName}
                            </span>{" "}
                            <span>
                                ({t("logoDetail.no")} {logoData?.logo_id})
                            </span>
                        </div>
                    </Container>
                </div>

                {/* logo detail */}
                <Container className="mt-8 grid w-full gap-8 lg:grid-cols-2">
                    <div className="flex flex-col gap-2 px-9">
                        {/* Main Preview Card */}
                        <div className="relative mx-auto flex aspect-square w-full max-w-[400px] flex-col overflow-hidden rounded-2xl border-2 border-[#E4E7E9] bg-white">
                            {/* Favorite Button Overlay */}
                            <div
                                className="absolute top-6 right-6 z-20 flex cursor-pointer items-center gap-1"
                                onClick={favoriteEvent}
                            >
                                <span className="text-sm font-bold text-gray-600">
                                    {logoData?.favorites_count || 0}
                                </span>
                                {logoData?.is_like ? (
                                    <Heart
                                        size={18}
                                        className="fill-[#D81700] text-[#D81700]"
                                    />
                                ) : (
                                    <Heart
                                        size={18}
                                        className="text-gray-400"
                                    />
                                )}
                            </div>
                            {/* Logo and thumbnail slider */}
                            {/* Logo Image Slider */}
                            <div className="flex flex-1 items-center justify-center overflow-hidden">
                                <ImageSlider
                                    images={fileImageMulti}
                                    alt={logoData?.logo_name || "Logo"}
                                    className="h-full w-full"
                                    imageClassName="max-h-[400px] max-w-[400px]"
                                    aspectRatio=""
                                    currentIndex={currentImageIndex}
                                    onIndexChange={setCurrentImageIndex}
                                    hideNavigation={fileImageMulti.length <= 1}
                                    hideIndicators={true}
                                    arrowStyle="orange"
                                    arrowPlacement="inside"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Slider */}
                        {fileImageMulti.length > 1 && (
                            <div className="mt-2 flex w-full items-center justify-center">
                                <ImageSlider
                                    items={fileImageMulti.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`mx-auto flex aspect-square max-h-[120px] w-full max-w-[120px] cursor-pointer items-center justify-center bg-white p-2 transition-all ${
                                                currentImageIndex === idx
                                                    ? "border-2 border-[#E67E22]"
                                                    : "border border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() =>
                                                setCurrentImageIndex(idx)
                                            }
                                        >
                                            <img
                                                src={img}
                                                alt={`${logoData?.logo_name || "Logo"} thumbnail ${idx + 1}`}
                                                className="max-h-full max-w-full object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.onerror =
                                                        null;
                                                    e.currentTarget.src =
                                                        "/img/default.png";
                                                }}
                                            />
                                        </div>
                                    ))}
                                    visibleItems={4}
                                    gap={2}
                                    arrowStyle="orange"
                                    className="w-full"
                                    hideNavigation={true}
                                />
                            </div>
                        )}
                    </div>

                    {/* Information Column */}
                    <form onSubmit={handleAddToCart} method="post">
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-3xl font-bold text-black">
                                    {localizedLogoName}
                                </h2>
                                <div className="text-lg text-gray-500">
                                    ({t("logoDetail.no")} {logoData?.logo_id})
                                </div>
                                <div className="mt-4 border-b border-gray-200 pb-8 text-lg text-gray-600">
                                    {logoData?.logo_explain}
                                </div>

                                <div className="mt-8 flex flex-col gap-2">
                                    <span className="text-lg text-gray-400">
                                        {t("logoDetail.price")}
                                    </span>
                                    <div className="text-brand text-3xl font-bold">
                                        {currencyNumber(totalPrice, true)}{" "}
                                        <span className="text-sm font-normal text-gray-400">
                                            ( {t("logoDetail.with_tax")} )
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Logo-option zone */}
                            <div className="mt-8 lg:mt-8">
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    {logoOption.map((option) => (
                                        <div
                                            key={option.id}
                                            className="flex flex-col gap-2"
                                        >
                                            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                                {option.label}{" "}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-[#F3993F] text-[10px] font-bold text-white">
                                                            ?
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        side="top"
                                                        className="max-w-[220px] rounded bg-black px-2 py-1 text-[11px] leading-snug text-white"
                                                    >
                                                        {option.helpText}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </label>
                                            {option.type === "select" ? (
                                                <select
                                                    className="h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-500 outline-none focus:border-[#F3993F]"
                                                    onChange={(e) =>
                                                        handleOptionChange(
                                                            option.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    {option.options?.map(
                                                        (opt, idx) => (
                                                            <option key={idx}>
                                                                {opt}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            ) : (
                                                <div className="flex w-full flex-col gap-1">
                                                    <input
                                                        type={option.type}
                                                        placeholder={
                                                            option.placeholder
                                                        }
                                                        className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#F3993F] ${errors[option.id] ? "border-red-500" : "border-gray-200"}`}
                                                        onChange={(e) => {
                                                            handleOptionChange(
                                                                option.id,
                                                                e.target.value,
                                                            );
                                                            if (
                                                                errors[
                                                                    option.id
                                                                ]
                                                            ) {
                                                                setErrors(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [option.id]:
                                                                            "",
                                                                    }),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    {errors[option.id] && (
                                                        <span className="text-sm text-red-500">
                                                            {errors[option.id]}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Submit action */}
                            <Button
                                type="submit"
                                className="bg-brand flex flex-row items-center justify-center gap-2 rounded-[5px] hover:bg-[#E67E00] md:mt-10 md:h-[56px]"
                                disabled={
                                    logoData?.inactive ||
                                    (logoData?.kept &&
                                        logoData?.is_user_kept === false)
                                }
                            >
                                <span className="text-[16px] font-bold text-white">
                                    {logoData?.state === 7
                                        ? t("logo_status.stop")
                                        : logoData?.state === 8
                                          ? t("logo_status.sold_out")
                                          : logoData?.state === 9
                                            ? t("logo_status.deleted")
                                            : logoData?.state === 2 &&
                                                !logoData?.is_user_kept
                                              ? t("logo_status.negotiation")
                                              : t("logoDetail.add_to_cart")}
                                </span>
                                {!logoData?.inactive &&
                                    !(
                                        logoData?.kept &&
                                        !logoData?.is_user_kept
                                    ) && (
                                        <ShoppingCart
                                            size={30}
                                            className="text-white"
                                        />
                                    )}
                            </Button>
                            <div className="mt-4 flex flex-row gap-3">
                                <Dot size={30} />
                                <span className="text-[#474747]">
                                    {t("logoDetail.condition")}
                                </span>
                            </div>
                        </div>
                    </form>
                </Container>

                <LogoDetailTabs />

                <PublicRecommendedLogo />
                {/* SignIn Modal Component */}
                <div className="z-101">
                    <SignIn open={showSignIn} setOpenLogin={setShowSignIn} />
                </div>
            </AppLayout>
        </>
    );
}
