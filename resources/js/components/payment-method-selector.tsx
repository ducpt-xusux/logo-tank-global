import {
    PaymentElement,
    LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { usePage } from "@inertiajs/react";
import { QrCode } from "lucide-react";

export type PaymentMethodType =
    | "credit_card"
    | "google_pay"
    | "qr_code"
    | "momo"
    | "zalopay"
    | "vnpay";

interface PaymentMethodSelectorProps {
    paymentMethod: PaymentMethodType;
    setPaymentMethod: (method: PaymentMethodType) => void;
    email: string;
    setEmail: (email: string) => void;
    t: any;
    locale?: string;
}

export function PaymentMethodSelector({
    paymentMethod,
    setPaymentMethod,
    email,
    setEmail,
    t,
    locale,
}: PaymentMethodSelectorProps) {
    const { vietqr, checkoutSummary } = usePage<{
        vietqr?: {
            uri: string;
            account_name: string;
        };
        checkoutSummary: any;
    }>().props;

    const amount = checkoutSummary?.totalAmount ?? checkoutSummary?.grandTotal;
    const items = checkoutSummary?.items || [];
    const itemIds = items
        .map((it: any) => it.productId || it.packageId)
        .filter(Boolean);

    const isPackage = items.some((it: any) => it.packageId);
    const description =
        itemIds.length > 0
            ? `Thanh Toan ${isPackage ? "Package" : "Logotank"} id: ${itemIds.join(", ")}`
            : `Thanh Toan ${isPackage ? "Package" : "Logotank"}`;

    const qrUrl = checkoutSummary
        ? `${vietqr?.uri.replace(/compact2|compact|qr_only|print|dDME1Jw/, "compact")}?amount=${amount}&addInfo=${encodeURIComponent(
              description,
          )}&accountName=${encodeURIComponent(vietqr?.account_name || "")}`
        : vietqr?.uri;

    const currency = (checkoutSummary?.currency || "vnd")
        .toLowerCase()
        .replace("đ", "d");

    return (
        <div className="space-y-4">
            <div>
                <label className="flex items-center gap-3">
                    <input
                        type="radio"
                        name="payment-method-main"
                        checked={
                            paymentMethod === "credit_card" ||
                            paymentMethod === "google_pay"
                        }
                        onChange={() => setPaymentMethod("credit_card")}
                        className="accent-[#F2762E]"
                    />
                    <img src="/img/mini-credit-card.png" alt="" />
                    <span className="text-[18px] text-[#000000]">
                        {t("checkout.credit_card")}
                    </span>
                </label>
            </div>

            {(paymentMethod === "credit_card" ||
                paymentMethod === "google_pay") && (
                <div className="mx-auto w-full max-w-[546px] space-y-3">
                    <div className="relative -left-3">
                        <img src="/img/credit-card.png" alt="" />
                    </div>

                    <div className="mt-[10px]">
                        <LinkAuthenticationElement
                            onChange={(e) => setEmail(e.value.email)}
                            options={{
                                defaultValues: {
                                    email: email,
                                },
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("credit_card")}
                            className={`rounded-sm border px-4 py-3 text-left text-[16px] font-medium text-[#191C1F] ${paymentMethod === "credit_card" ? "border-[#F2762E] bg-[#fff7f2]" : "border-[#E4E7E9] bg-white"}`}
                        >
                            <div className="flex flex-row items-center gap-3">
                                <img src="/img/mini-credit-card.png" alt="" />
                                <span>{t("checkout.credit_card")}</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("google_pay")}
                            className={`rounded-sm border px-4 py-3 text-left text-[16px] font-medium text-[#191C1F] ${paymentMethod === "google_pay" ? "border-[#F2762E] bg-[#fff7f2]" : "border-[#E4E7E9] bg-white"}`}
                        >
                            <div className="flex flex-row items-center gap-3">
                                <img src="/img/gg_pay.png" alt="" />
                                <span>Google Pay</span>
                            </div>
                        </button>
                    </div>

                    {paymentMethod === "credit_card" && (
                        <div className="mt-4">
                            <PaymentElement
                                options={{
                                    layout: "tabs",
                                    wallets: {
                                        googlePay: "never",
                                        applePay: "never",
                                    },
                                    fields: {
                                        billingDetails: {
                                            email: "never",
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-3 pt-4">
                {(locale === "vi" || currency === "vnd") && (
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[18px] text-[#191C1F]">
                            <input
                                type="radio"
                                name="payment-method-main"
                                checked={paymentMethod === "qr_code"}
                                onChange={() => setPaymentMethod("qr_code")}
                                className="accent-[#F2762E]"
                            />
                            <QrCode className="h-9 w-9" />
                            {t("checkout.scanQR")}
                        </label>
                        {paymentMethod === "qr_code" && (
                            <div className="mx-auto flex max-w-[650px] flex-col overflow-hidden rounded-sm border border-[#E4E7E9] bg-white md:flex-row">
                                {/* Left: QR Code */}
                                <div className="flex flex-col items-center border-b p-6 md:w-[45%]">
                                    <div className="h-full w-56 p-2">
                                        <img
                                            src={qrUrl}
                                            alt="VietQR Code"
                                            className=""
                                        />
                                    </div>
                                </div>

                                {/* Right: Details */}
                                <div className="flex-1 p-6 text-[13px] text-[#143C7B]">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-[110px_1fr] gap-2">
                                            <span className="">Số tiền:</span>
                                            <span className="">
                                                {(amount ?? 0).toLocaleString()}{" "}
                                                VND
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-[110px_1fr] gap-2">
                                            <span className="">
                                                Nội dung CK:
                                            </span>
                                            <span className="">
                                                {description}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-[110px_1fr] gap-2">
                                            <span className="">
                                                Tên chủ TK:
                                            </span>
                                            <span className="font-medium uppercase">
                                                {vietqr?.account_name}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-[110px_1fr] gap-2">
                                            <span className="">Số TK:</span>
                                            <span className="font-medium">
                                                1037641561
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-[110px_1fr] gap-2">
                                            <span className="">Ngân hàng:</span>
                                            <span className="">
                                                Ngân hàng TMCP Ngoại Thương Việt
                                                Nam
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <label className="flex cursor-not-allowed items-center gap-2 text-[18px] text-[#A3AAB2]">
                    <input
                        type="radio"
                        name="payment-method-main"
                        checked={false}
                        disabled
                        className="cursor-not-allowed accent-[#F2762E]"
                    />
                    Ví Momo
                </label>
                <label className="flex cursor-not-allowed items-center gap-2 text-[18px] text-[#A3AAB2]">
                    <input
                        type="radio"
                        name="payment-method-main"
                        checked={false}
                        disabled
                        className="cursor-not-allowed accent-[#F2762E]"
                    />
                    Ví ZaloPay
                </label>
                <label className="flex cursor-not-allowed items-center gap-2 text-[18px] text-[#A3AAB2]">
                    <input
                        type="radio"
                        name="payment-method-main"
                        checked={false}
                        disabled
                        className="cursor-not-allowed accent-[#F2762E]"
                    />
                    Ví VNPAY
                </label>
            </div>
        </div>
    );
}
