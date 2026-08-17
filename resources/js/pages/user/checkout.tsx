import { PublicHeader, Container, PublicFooter } from "@/components/public";
import { currencyNumber, getLocaleLink } from "@/helper/utils";
import { Head, usePage, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { SharedData } from "@/types";
import { loadStripe } from "@stripe/stripe-js";
import {
    PaymentMethodSelector,
    PaymentMethodType,
} from "@/components/payment-method-selector";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useSystemStore } from "@/stores/system.storage";
import api from "@/services/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { Button as UIButton } from "@/components/ui/button";

interface CheckoutItemSummary {
    productId: number;
    subName: string;
    mainName: string;
    logoManual: boolean;
    logoMotion: boolean;
    logoPrice: number;
    logoManualPrice: number;
    logoMotionPrice: number;
    lineTotal: number;
}

interface CheckoutSummary {
    items: CheckoutItemSummary[];
    submittedTotal: number;
    computedTotalFromItems: number;
    diffFromComputed: number;
    subtotal: number;
    tax: number;
    taxRate: number;
    totalAmount: number;
    totalIncludesTax: boolean;
    currency: string;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

interface CheckoutPageProps {
    checkoutSummary?: CheckoutSummary | null;
    vietqr?: {
        uri: string;
        account_name: string;
    };
}

export default function CheckOut() {
    const { checkoutSummary, locale } = usePage<
        SharedData & CheckoutPageProps
    >().props;
    const { i18n } = useTranslation("common", { useSuspense: false });
    const currency = (checkoutSummary?.currency || "usd").toLowerCase();

    const isZeroDecimal = ["vnd", "jpy"].includes(currency);
    const amount = Math.max(
        1,
        Math.round(
            (checkoutSummary?.totalAmount || 10) * (isZeroDecimal ? 1 : 100),
        ),
    );

    const currentLang = i18n.language || locale || "en";
    const stripeLocale = currentLang === "vn" ? "vi" : currentLang;

    return (
        <Elements
            stripe={stripePromise}
            options={{
                locale: stripeLocale as any,
                mode: "payment",
                amount,
                currency: currency.toLowerCase(),
            }}
        >
            <Head title="Checkout" />
            <CheckOutForm />
        </Elements>
    );
}

function CheckOutForm() {
    const { t, i18n } = useTranslation("common", { useSuspense: false });
    const stripe = useStripe();
    const elements = useElements();
    const { setShoppingCart } = useSystemStore();
    const { flash, locale, checkoutSummary } = usePage<
        SharedData & CheckoutPageProps
    >().props;

    const [showSuccess, setShowSuccess] = useState(false);
    const orderSuccess = flash?.order_success as any;
    console.log(orderSuccess);
    useEffect(() => {
        if (orderSuccess) {
            setShowSuccess(true);
        }
    }, [orderSuccess]);

    const getPaymentMethodName = (method: string) => {
        switch (method) {
            case "credit_card":
                return "Credit Card";
            case "google_pay":
                return "Google Pay";
            case "qr_code":
                return "Quét mã QR";
            case "momo":
                return "Momo";
            case "zalopay":
                return "ZaloPay";
            case "vnpay":
                return "VNPAY";
            default:
                return method;
        }
    };
    // State for handle select payment_method
    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethodType>("credit_card");
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    //chuẩn bị xử lý bước 3 trong md
    const handleSubmit = async () => {
        if (submitting) return;

        setSubmitting(true);

        try {
            let paymentIntentId: string | undefined;
            let paymentIntentClientSecret: string | undefined;
            let paymentIntentStatus: string | undefined;

            if (
                paymentMethod === "credit_card" ||
                paymentMethod === "google_pay"
            ) {
                if (!stripe || !elements) {
                    setSubmitting(false);
                    return;
                }

                const { error: submitError } = await elements.submit();
                if (submitError) {
                    alert(submitError.message || "Payment form is invalid.");
                    setSubmitting(false);
                    return;
                }

                const paymentIntentResponse = await api.post(
                    getLocaleLink("/checkout/payment-intent"),
                    {
                        payment_method: paymentMethod,
                        email: email || undefined,
                    },
                );

                const clientSecret = paymentIntentResponse?.client_secret;
                if (!clientSecret) {
                    alert("Could not initialize payment intent.");
                    setSubmitting(false);
                    return;
                }

                const result = await stripe.confirmPayment({
                    elements,
                    clientSecret,
                    confirmParams: {
                        receipt_email: email || undefined,
                        payment_method_data: {
                            billing_details: {
                                email: email || undefined,
                            },
                        },
                        return_url: window.location.href,
                    },
                    redirect: "if_required",
                });

                if (result.error) {
                    alert(result.error.message || "Payment failed.");
                    return;
                }

                paymentIntentId = result.paymentIntent?.id;
                paymentIntentClientSecret =
                    result.paymentIntent?.client_secret ?? undefined;
                paymentIntentStatus = result.paymentIntent?.status;
            }

            router.post(
                getLocaleLink("/checkout/submit"),
                {
                    payment_method: paymentMethod,
                    payment_intent: paymentIntentId,
                    payment_intent_client_secret: paymentIntentClientSecret,
                    payment_intent_status: paymentIntentStatus,
                },
                {
                    onSuccess: () => {
                        setShoppingCart([]);
                    },
                    onError: () => {
                        setSubmitting(false);
                    },
                    onFinish: () => {
                        setSubmitting(false);
                    },
                },
            );
        } catch (error) {
            console.error(error);
            const message =
                (error as any)?.message ||
                (error as any)?.response?.data?.message ||
                "Could not submit order. Please try again.";
            alert(message);
            setSubmitting(false);
        }
    };

    const currentLang = i18n.language || locale || "en";

    const breadcrumbs = [
        {
            title: t("breadcrumbs.home") || "Home",
            href: getLocaleLink("/"),
        },
        {
            title: t("cart.title") || "Cart",
            href: getLocaleLink("/my-page/cart"),
        },
        {
            title: "Checkout",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <PublicHeader />
            <div className="flex w-full items-center bg-[#F2F4F5] text-[12px] text-[#5F6C72] md:h-[72px] md:text-[16px]">
                <div className="mx-auto w-full max-w-[1238px]">
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

            <Container className="p w-full py-8">
                <div className="grid grid-cols-1 gap-13 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <div className="rounded-sm border border-[#E4E7E9] bg-white p-6">
                        <h3 className="mb-4 text-[22px] font-semibold text-[#191C1F]">
                            {t("checkout.payment_method")}
                        </h3>
                        <PaymentMethodSelector
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            email={email}
                            setEmail={setEmail}
                            t={t}
                            locale={currentLang}
                        />
                    </div>

                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-sm border border-[#E4E7E9] bg-white p-4">
                            <h3 className="mb-4 text-[20px] font-semibold text-[#191C1F]">
                                {t("cart.order_summary")}
                            </h3>

                            <div className="space-y-2 text-[15px] text-[#5F6C72]">
                                <div className="flex items-center justify-between">
                                    <span>
                                        {t("checkout.subtotal_without_tax")}
                                    </span>
                                    <span className="text-[#191C1F]">
                                        {currencyNumber(
                                            checkoutSummary?.subtotal ?? 0,
                                            true,
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>
                                        Tax ({checkoutSummary?.taxRate ?? 10}
                                        %):
                                    </span>
                                    <span className="text-[#191C1F]">
                                        {currencyNumber(
                                            checkoutSummary?.tax ?? 0,
                                            true,
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Chuyển hàng:</span>
                                    <span className="text-[#191C1F]">
                                        {currencyNumber(0, true)}
                                    </span>
                                </div>
                            </div>

                            <div className="my-4 h-px bg-[#E4E7E9]" />

                            <div className="mb-4 flex items-center justify-between text-[16px]">
                                <span className="font-base text-[#191C1F]">
                                    {t("checkout.total")}
                                </span>
                                <span className="text-brand text-[24px] font-bold">
                                    {currencyNumber(
                                        checkoutSummary?.totalAmount ?? 0,
                                        true,
                                    )}
                                </span>
                            </div>
                            <p className="mb-4 text-right text-[12px] text-[#2DB224]">
                                (đã bao gồm thuế)
                            </p>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full rounded-sm bg-[#D74B3A] py-3 text-[16px] font-bold text-white uppercase transition-colors hover:bg-[#bf4031]"
                            >
                                {submitting
                                    ? t("checkout.processing")
                                    : paymentMethod === "qr_code"
                                      ? t("checkout.confirm_transfer")
                                      : t("checkout.complete_order")}
                            </button>
                        </div>
                    </div>
                </div>
            </Container>

            <PublicFooter className="mt-20" showOrangeBanner={false} />

            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="bg-white sm:max-w-[480px]">
                    <div className="flex flex-col items-center py-6 text-center">
                        <div className="mb-4 flex h-22 w-22 items-center justify-center rounded-full bg-white">
                            <div className="flex h-22 w-22 items-center justify-center rounded-full border text-green-500 shadow-md">
                                <Check className="h-10 w-10 font-bold" />
                            </div>
                        </div>

                        <h2 className="mb-8 text-2xl font-bold text-green-600">
                            {t("checkout.payment_success")}
                        </h2>

                        <div className="w-full space-y-4 px-4 text-left text-[16px] text-gray-700">
                            <div className="grid grid-cols-[160px_1fr] gap-2">
                                <span className="text-gray-400">
                                    {t("checkout.payment_method")}
                                </span>
                                <span className="text-right font-medium text-gray-900">
                                    {getPaymentMethodName(
                                        orderSuccess?.payment_method,
                                    )}
                                </span>
                            </div>
                            <div className="grid grid-cols-[160px_1fr] gap-2">
                                <span className="text-gray-400">Email</span>
                                <span className="text-right font-medium text-gray-900">
                                    {orderSuccess?.email || "—"}
                                </span>
                            </div>
                            <div className="grid grid-cols-[160px_1fr] gap-2">
                                <span className="text-gray-400">Logo ID</span>
                                <span className="text-right font-medium text-gray-900">
                                    {orderSuccess?.logo_ids?.join(", ") || "—"}
                                </span>
                            </div>
                            <div className="grid grid-cols-[160px_1fr] gap-2">
                                <span className="text-gray-400">
                                    {t("checkout.total")}
                                </span>
                                <span className="text-right font-bold text-orange-500">
                                    {currencyNumber(
                                        orderSuccess?.total ?? 0,
                                        true,
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 w-full px-4 text-right">
                            <Link
                                href={getLocaleLink(
                                    `/my-page/order-status/${orderSuccess?.id}`,
                                )}
                            >
                                <UIButton className="w-1/2 rounded-md bg-[#0088CC] py-6 text-base font-semibold text-white hover:bg-[#0077B3]">
                                    {t("checkout.order_status")}
                                </UIButton>
                            </Link>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
