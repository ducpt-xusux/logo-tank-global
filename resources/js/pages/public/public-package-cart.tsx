import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { PublicHeader, Container, PublicFooter } from "@/components/public";
import { getLocaleLink, currencyNumber, getMotionPrice } from "@/helper/utils";
import { SharedData } from "@/types";

import { usePackageCartStore } from "@/stores/package-cart.storage";
import { XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import SignIn from "@/components/user/sign-in";

export default function PublicPackageCart() {
    const { t, i18n } = useTranslation("common", { useSuspense: false });
    const { packageCart, removeItem, getItemCalculations } =
        usePackageCartStore();
    const { auth } = usePage<SharedData>().props;
    const [showSignIn, setShowSignIn] = useState(false);

    const firstItemKey = packageCart[0]?.packageKey;
    const planLabel = t(`breadcrumbs.${firstItemKey}`);

    const breadcrumbs = [
        {
            title: t("breadcrumbs.home"),
            href: getLocaleLink("/"),
        },
        {
            title: t("headers.contact_us"),
            href: getLocaleLink("/contact-us"),
        },
        {
            title: t("breadcrumbs.select_payment"),
        },
    ];

    // Calculations for all items in the cart
    const subtotal = packageCart.reduce((acc, item) => {
        const { grandTotal } = getItemCalculations(item, i18n.language);
        return acc + grandTotal;
    }, 0);

    const processToCheckOut = () => {
        const isLoggedIn = !!auth?.user;

        if (!isLoggedIn) {
            setShowSignIn(true);
            return;
        }

        router.post(getLocaleLink(`/checkout/process-package`), {
            items: packageCart.map((item) => {
                return {
                    packageId: item.packageId,
                    packageKey: item.packageKey,
                    quantity: item.quantity,
                    logoManual: !!item.logoManual,
                    logoMotion: !!item.logoMotion,
                };
            }),
            type: "package",
            language: i18n.language,

            // items: shoppingCart.map((item) => ({
            //     productId: item.productId,
            //     subName: item.subName || "",
            //     mainName: item.mainName || "",
            //     logoManual: !!item.logoManual,
            //     logoMotion: !!item.logoMotion,
            // })),
            // submittedTotal: totalAmount,
            // totalIncludesTax: true,
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <Head title={`${planLabel} - Contact Us`} />

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
                                    <span
                                        className={
                                            index === breadcrumbs.length - 1
                                                ? "text-brand"
                                                : ""
                                        }
                                    >
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
                                <h1 className="text-2xl font-bold text-[#191C1F] lg:text-[32px]">
                                    {t("package_cart.title")}
                                </h1>
                            </div>

                            {/* Table Header */}
                            <div className="grid grid-cols-2 items-center gap-10 bg-[#E4E7E9] px-6 py-3.5">
                                <div className="text-[13px] font-bold tracking-wider text-[#475156] uppercase">
                                    {t("package_cart.products")}
                                </div>
                                <div className="flex-1 pl-4 text-[13px] font-bold tracking-wider text-[#475156] uppercase">
                                    {t("package_cart.product_info")}
                                </div>
                            </div>

                            {/* Cart Items List */}
                            <div className="divide-y divide-[#E4E7E9]">
                                {packageCart.length > 0 ? (
                                    packageCart.map((item) => (
                                        <div
                                            key={item.packageId}
                                            className="grid grid-cols-2 items-center gap-10 px-6 py-8 transition-colors hover:bg-slate-50"
                                        >
                                            {/* Delete Button & Image */}
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() =>
                                                        removeItem(
                                                            item.packageId,
                                                        )
                                                    }
                                                    className="cursor-pointer text-[#EE5858] transition-colors"
                                                >
                                                    <XCircle size={22} />
                                                </button>
                                                <div className="flex flex-1 items-center justify-center">
                                                    <div className="flex h-[170px] w-full max-w-[360px] flex-col items-center justify-center rounded-md border border-[#D9DEE1] bg-white p-4 text-[#F3993F] shadow-sm sm:h-[200px] sm:p-5 lg:h-[220px] lg:p-6">
                                                        <img
                                                            src="/img/logo-full.svg"
                                                            alt="Logo Tank"
                                                            className="mb-2 h-12 w-auto"
                                                        />
                                                        <span className="text-brand text-xs font-bold tracking-wider uppercase">
                                                            {item.packageName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Product Details */}
                                            <div className="flex-1 pl-4 text-[14px]">
                                                <div className="grid grid-cols-[120px_1fr] items-start gap-x-4 gap-y-2.5 lg:grid-cols-[140px_1fr]">
                                                    <div className="text-[#5F6C72]">
                                                        {t(
                                                            "package_cart.package_name",
                                                        )}
                                                    </div>
                                                    <div className="text-brand font-bold">
                                                        {item.packageName}
                                                    </div>

                                                    <div className="text-[#5F6C72]">
                                                        {t(
                                                            "package_cart.product_code",
                                                        )}
                                                    </div>
                                                    <div className="text-[#191C1F]">
                                                        DT{item.packageId}123
                                                    </div>

                                                    <div className="text-[#5F6C72]">
                                                        {t(
                                                            "package_cart.motion_logo",
                                                        )}
                                                    </div>
                                                    <div className="text-[#191C1F]">
                                                        {item.logoMotion
                                                            ? currencyNumber(
                                                                  getMotionPrice(),
                                                                  true,
                                                              )
                                                            : null}
                                                    </div>
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
                                            href={getLocaleLink("/contact-us")}
                                            className="text-brand inline-flex items-center gap-2 hover:underline"
                                        >
                                            <ArrowLeft size={18} />
                                            {t("cart.return_to_shop")}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Back to Shop Button Area */}
                            {packageCart.length > 0 && (
                                <div className="border-t border-[#E4E7E9] p-6 lg:p-8">
                                    <Link
                                        href={getLocaleLink("/contact-us")}
                                        className="border-brand text-brand hover:bg-brand inline-flex items-center gap-x-3 rounded-sm border-2 px-8 py-3.5 text-[15px] font-black tracking-widest uppercase shadow-sm transition-all hover:text-white"
                                    >
                                        <ArrowLeft size={18} />
                                        {t("package_cart.back_to_shop")}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:basis-1/3">
                        <div className="sticky top-24 space-y-6 rounded-sm border border-[#E4E7E9] bg-white p-6 lg:p-8">
                            <h2 className="pb-4 text-xl font-bold text-[#191C1F]">
                                {t("package_cart.order_summary")}
                            </h2>

                            <div className="space-y-6 pt-2">
                                {packageCart.map((item) => {
                                    const {
                                        basePrice,
                                        motionPrice,
                                        manualPrice,
                                        grandTotal,
                                    } = getItemCalculations(
                                        item,
                                        i18n.language,
                                    );

                                    return (
                                        <div
                                            key={item.packageId}
                                            className="space-y-3 border-y border-[#E4E7E9] py-6"
                                        >
                                            <div className="flex items-start gap-1 font-bold text-[#191C1F]">
                                                <span className="text-brand">
                                                    {item.packageName}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 text-[#5F6C72]">
                                                <span className="text-base font-medium">
                                                    {t(
                                                        "package_cart.package_price",
                                                    )}
                                                </span>
                                                <span className="text-right text-[#191C1F]">
                                                    {currencyNumber(
                                                        basePrice,
                                                        true,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Add-ons */}
                                            {item.logoMotion && (
                                                <div className="grid grid-cols-2 text-[#5F6C72]">
                                                    <span className="text-base font-medium">
                                                        {t(
                                                            "package_cart.motion_logo",
                                                        )}
                                                    </span>
                                                    <span className="text-right text-[#191C1F]">
                                                        {" "}
                                                        {currencyNumber(
                                                            motionPrice,
                                                            true,
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {item.logoManual && (
                                                <div className="grid grid-cols-2 text-[#5F6C72]">
                                                    <span className="text-base font-medium">
                                                        {t(
                                                            "logoDetail.logo_manual_option",
                                                        )}
                                                    </span>
                                                    <span className="text-right text-[#191C1F]">
                                                        {currencyNumber(
                                                            manualPrice,
                                                            true,
                                                        )}
                                                    </span>
                                                </div>
                                            )}



                                            {/* Item Total (Incl. Tax) */}
                                            <div className="grid grid-cols-2 text-lg font-bold">
                                                <span className="text-[#191C1F]">
                                                    {t("package_cart.total")}
                                                </span>
                                                <span className="text-brand text-right">
                                                    {currencyNumber(
                                                        grandTotal,
                                                        true,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <span className="text-xl font-bold text-[#191C1F]">
                                            {t("package_cart.total")}
                                        </span>
                                        <div className="text-right">
                                            <span className="text-brand text-2xl font-bold">
                                                {currencyNumber(subtotal, true)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={processToCheckOut}
                                disabled={packageCart.length === 0}
                                className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-sm bg-[#D74B3A] py-4 font-black tracking-[1px] text-white uppercase shadow-lg transition-colors hover:bg-[#c0392b] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {t("package_cart.next_step")}
                                <ArrowRight
                                    size={20}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </Container>

            {/* footer */}
            <PublicFooter className="mt-20" showOrangeBanner={false} />
            <SignIn open={showSignIn} setOpenLogin={setShowSignIn} />
        </div>
    );
}
