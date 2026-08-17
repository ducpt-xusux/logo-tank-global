import { useState } from "react";
import { PublicHeader, Container, PublicFooter } from "@/components/public";
import { useTranslation } from "react-i18next";
import { useSystemStore } from "@/stores/system.storage";
import { Head, router } from "@inertiajs/react";
import {
    currencyNumber,
    getLogoPrice,
    getManualPrice,
    getMotionPrice,
    getLocaleLink,
} from "@/helper/utils";
import { Link, usePage } from "@inertiajs/react";
import { XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { SharedData } from "@/types";
import SignIn from "@/components/user/sign-in";
export default function PublicCart() {
    const { t } = useTranslation("common", { useSuspense: false });
    const { shoppingCart, setShoppingCart } = useSystemStore();
    const [showSignIn, setShowSignIn] = useState(false);
    const breadcrumbs = [
        {
            title: t("breadcrumbs.home") || "Home",
            href: getLocaleLink("/"),
        },
        {
            title: t("cart.title"),
        },
    ];
    const removeItem = (productId: number) => {
        setShoppingCart(
            shoppingCart.filter((item) => item.productId !== productId),
        );
    };

    const { auth } = usePage<SharedData>().props;
    console.log(auth);
    const logoPrice = getLogoPrice();
    const manualPrice = getManualPrice();
    const motionPrice = getMotionPrice();

    const orderSummaryItems = shoppingCart.map((item) => {
        const logoTotal = logoPrice;
        const manualTotal = item.logoManual ? manualPrice : 0;
        const motionTotal = item.logoMotion ? motionPrice : 0;
        const itemTotal = logoTotal + manualTotal + motionTotal;

        return {
            productId: item.productId,
            logoName: item.product?.logo_name,
            logoTotal,
            manualTotal,
            motionTotal,
            itemTotal,
        };
    });

    const totalAmount = orderSummaryItems.reduce(
        (sum, item) => sum + item.itemTotal,
        0,
    );
    const processToCheckOut = () => {
        const isLoggedIn = !!auth?.user;

        if (!isLoggedIn) {
            setShowSignIn(true);
            return;
        }

        router.post(getLocaleLink(`/checkout/process`), {
            items: shoppingCart.map((item) => ({
                productId: item.productId,
                subName: item.subName || "",
                mainName: item.mainName || "",
                logoManual: !!item.logoManual,
                logoMotion: !!item.logoMotion,
            })),
            submittedTotal: totalAmount,
            totalIncludesTax: true,
        });
    };
    return (
        <div className="min-h-screen bg-white">
            <Head title="Cart" />
            <PublicHeader />

            {/* Breadcrumb */}
            <div className="flex w-full items-center bg-[#F2F4F5] lg:h-[72px]">
                <Container className="w-full text-[12px] text-[#5F6C72] lg:text-[14px]">
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
                </Container>
            </div>
            <Container className="w-full">
                <div className="my-10 flex flex-col gap-8 lg:flex-row">
                    {/* Main Content (2/3) */}
                    <div className="lg:basis-2/3">
                        <div className="overflow-hidden rounded-sm border border-[#E4E7E9]">
                            {/* Header Title */}
                            <div className="bg-white p-5 lg:p-6">
                                <h1 className="text-lg tracking-wide text-[#191C1F]">
                                    {t("cart.title")}
                                </h1>
                            </div>

                            {/* Table Header */}
                            <div className="grid grid-cols-2 items-center gap-10 bg-[#E4E7E9] px-6 py-3.5">
                                {/* Delete placeholder */}
                                <div className="text-[13px] font-bold tracking-wider text-[#475156] uppercase">
                                    {t("cart.products")}
                                </div>
                                <div className="flex-1 pl-4 text-[13px] font-bold tracking-wider text-[#475156] uppercase">
                                    {t("cart.product_detail")}
                                </div>
                            </div>

                            {/* Cart Items List */}
                            <div className="divide-y divide-[#E4E7E9]">
                                {shoppingCart.length > 0 ? (
                                    shoppingCart.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="grid grid-cols-2 items-center gap-10 px-6 py-8 transition-colors hover:bg-slate-50"
                                        >
                                            {/* Delete Button */}
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() =>
                                                        removeItem(
                                                            item.productId,
                                                        )
                                                    }
                                                    className="cursor-pointer text-[#EE5858] transition-colors"
                                                    title={t("cart.remove")}
                                                >
                                                    <XCircle size={22} />
                                                </button>
                                                {/* Product Image */}
                                                <div className="flex flex-1 items-center justify-center">
                                                    <div className="flex h-[170px] w-full max-w-[360px] items-center justify-center rounded-md border border-[#D9DEE1] bg-white p-4 shadow-sm sm:h-[200px] sm:p-5 lg:h-[220px] lg:p-6">
                                                        <img
                                                            src={
                                                                item.product
                                                                    ?.src &&
                                                                item.product
                                                                    .src !==
                                                                    "/logo_data/no.gif"
                                                                    ? item
                                                                          .product
                                                                          .src
                                                                    : item
                                                                          .product
                                                                          ?.url_img_two ||
                                                                      "/img/default.png"
                                                            }
                                                            alt={item.mainName}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Product Details */}
                                            <div className="flex-1 pl-4 text-[14px]">
                                                <div className="grid grid-cols-[120px_1fr] items-start gap-x-4 gap-y-2.5 lg:grid-cols-[140px_1fr]">
                                                    <div className="text-[#5F6C72]">
                                                        {t("cart.product_id")}
                                                    </div>
                                                    <div className="text-[#191C1F]">
                                                        no.{item.productId}{" "}
                                                        <span className="text-brand ml-1">
                                                            {
                                                                item.product
                                                                    ?.logo_name
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="text-[#5F6C72]">
                                                        {t("cart.sub_name")}
                                                    </div>
                                                    <div className="text-[#191C1F]">
                                                        {item.subName || "---"}
                                                    </div>

                                                    <div className="text-[#5F6C72]">
                                                        {t("cart.main_name")}
                                                    </div>
                                                    <div className="tracking-tight text-[#191C1F] uppercase">
                                                        {item.mainName || "---"}
                                                    </div>

                                                    <div className="text-[#5F6C72]">
                                                        {t("cart.logo_price")}
                                                    </div>
                                                    <div className="text-[#191C1F]">
                                                        {currencyNumber(
                                                            logoPrice,
                                                            true,
                                                        )}
                                                    </div>

                                                    {item.logoManual && (
                                                        <>
                                                            <div className="text-[#5F6C72]">
                                                                {t(
                                                                    "cart.manual_price",
                                                                )}
                                                            </div>
                                                            <div className="font-bold text-gray-700">
                                                                {currencyNumber(
                                                                    manualPrice,
                                                                    true,
                                                                )}
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* Conditional Row: Logo motion */}
                                                    {item.logoMotion && (
                                                        <>
                                                            <div className="text-[#5F6C72]">
                                                                {t(
                                                                    "cart.motion_price",
                                                                )}
                                                            </div>
                                                            <div className="font-bold text-gray-700">
                                                                {currencyNumber(
                                                                    motionPrice,
                                                                    true,
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-24 text-center">
                                        <p className="mb-6 text-gray-500">
                                            {t("cart.empty")}
                                        </p>
                                        <Link
                                            href={getLocaleLink("/explore")}
                                            className="text-brand inline-flex items-center gap-2 hover:underline"
                                        >
                                            <ArrowLeft size={18} />
                                            {t("cart.return_to_shop")}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Back to Shop Button Area */}
                            {shoppingCart.length > 0 && (
                                <div className="border-t border-[#E4E7E9] p-6 lg:p-8">
                                    <Link
                                        href={getLocaleLink("/explore")}
                                        className="border-brand text-brand hover:bg-brand inline-flex items-center gap-x-3 rounded-sm border-2 px-8 py-3.5 text-[15px] font-black tracking-widest uppercase shadow-sm transition-all hover:text-white"
                                    >
                                        <ArrowLeft size={18} />
                                        {t("cart.return_to_shop")}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:basis-1/3">
                        <div className="sticky top-24 space-y-6 rounded-sm border border-[#E4E7E9] bg-white p-6 lg:p-8">
                            <h2 className="border-b border-[#E4E7E9] pb-4 text-xl font-bold text-[#191C1F]">
                                {t("cart.order_summary")}
                            </h2>

                            <div className="space-y-4 pt-2">
                                {orderSummaryItems.map((item, index) => (
                                    <div
                                        key={`${item.productId}-${index}`}
                                        className={
                                            index === 0
                                                ? "space-y-2 pt-0"
                                                : "space-y-2 border-t border-[#E4E7E9] pt-4"
                                        }
                                    >
                                        <p className="flex gap-2 text-sm font-semibold text-[#191C1F]">
                                            no.{item.productId}
                                            <span className="text-brand">
                                                {item.logoName}
                                            </span>
                                        </p>
                                        <div className="flex items-center justify-between text-[#5F6C72]">
                                            <span>{t("cart.logo_price")}</span>
                                            <span className="text-[#191C1F]">
                                                {currencyNumber(
                                                    item.logoTotal,
                                                    true,
                                                )}
                                            </span>
                                        </div>
                                        {item.manualTotal > 0 && (
                                            <div className="flex items-center justify-between text-[#5F6C72]">
                                                <span>
                                                    {t("cart.manual_price")}
                                                </span>
                                                <span className="text-[#191C1F]">
                                                    {currencyNumber(
                                                        item.manualTotal,
                                                        true,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {item.motionTotal > 0 && (
                                            <div className="flex items-center justify-between text-[#5F6C72]">
                                                <span>
                                                    {t("cart.motion_price")}
                                                </span>
                                                <span className="text-[#191C1F]">
                                                    {currencyNumber(
                                                        item.motionTotal,
                                                        true,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="font-semibold text-[#191C1F]">
                                                {t("cart.total")}
                                            </span>
                                            <span className="text-brand font-bold">
                                                {currencyNumber(
                                                    item.itemTotal,
                                                    true,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-center justify-between border-t border-[#E4E7E9] pt-4">
                                    <span className="text-lg font-bold text-[#191C1F]">
                                        {t("cart.total")}
                                    </span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-brand text-xl font-bold">
                                            {currencyNumber(totalAmount, true)}
                                        </span>
                                        <span className="text-sm text-[#2DB224]">
                                            {t("cart.included_tax")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={processToCheckOut}
                                disabled={shoppingCart.length === 0}
                                className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-sm bg-[#D74B3A] py-4 font-black tracking-[2px] text-white uppercase shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {t("cart.checkout")}
                                <ArrowRight
                                    size={20}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </Container>

            {/* footer without LogoTank-Man */}
            <PublicFooter className="mt-20" showOrangeBanner={false} />

            <SignIn open={showSignIn} setOpenLogin={setShowSignIn} />
        </div>
    );
}
