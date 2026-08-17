import { PublicHeader, Container, PublicFooter } from "@/components/public";
import { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { User, SharedData } from "@/types";
import { getLocaleLink, currencyNumber } from "@/helper/utils";
import { usePackageCartStore } from "@/stores/package-cart.storage";
import {
  PaymentMethodSelector,
  PaymentMethodType,
} from "@/components/payment-method-selector";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "@/services/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { Button as UIButton } from "@/components/ui/button";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

interface PackageItem {
  packageId: number;
  packageKey: string;
  productCode: string;
  packageName: string;
  quantity: number;
  basePrice: number;
  motionPrice: number;
  manualPrice: number;
  total: number;
}

interface PackageCheckoutSummary {
  type: string;
  items: PackageItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  currency: string;
  totalAmount: number;
}

function PackageCheckoutForm({
  checkoutSummary,
  user,
}: {
  checkoutSummary: PackageCheckoutSummary;
  user: User;
}) {
  const { t, i18n } = useTranslation("common", { useSuspense: false });
  const { clearCart } = usePackageCartStore();
  const { locale, flash } = usePage<SharedData>().props;
  const stripe = useStripe();
  const elements = useElements();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("credit_card");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [submitting, setSubmitting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const orderSuccess = flash?.order_success as any;
  useEffect(() => {
    if (orderSuccess) {
      setShowSuccess(true);
    }
  }, [orderSuccess]);

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit_card":
        return t("checkout.credit_card");
      case "google_pay":
        return "Google Pay";
      case "qr_code":
        return t("checkout.scanQR");
      default:
        return method;
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      let paymentIntentId: string | undefined;
      let paymentIntentClientSecret: string | undefined;
      let paymentIntentStatus: string | undefined;

      if (paymentMethod === "credit_card" || paymentMethod === "google_pay") {
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
          setSubmitting(false);
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
            clearCart();
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

  return (
    <Container className="mt-10">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="space-y-5 rounded-lg border p-5">
            <div className="space-y-3">
              <h4>{t("cart.title")}</h4>
              {checkoutSummary.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[200px_1fr] gap-y-[14px]"
                >
                  <span className="text-black">
                    {t("package_cart.package_name")}
                  </span>
                  <span className="text-brand font-semibold uppercase">
                    {t(`breadcrumbs.${item.packageKey}`)}
                  </span>

                  <span className="text-black">
                    {t("package_cart.product_code")}
                  </span>
                  <span>{item.productCode}</span>

                  <span className="font-semibold text-black">
                    {t("package_cart.motion_logo")}
                  </span>
                  <span className="font-semibold text-black">
                    {currencyNumber(item.motionPrice, true)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border"></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold md:text-lg">
                  {t("package_checkout.shipping_to")}
                </span>
                <Link
                  href={getLocaleLink("/profile")}
                  className="text-[#118ACB] underline underline-offset-2"
                >
                  {t("customer_info.change_user_info")}
                </Link>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-y-[14px] text-black">
                <span>{t("package_checkout.receiver")}</span>
                <span className=" ">{user?.name}</span>
                <span>{t("package_checkout.email")}</span>
                <span className=" ">{user?.email}</span>
                <span>{t("package_checkout.address")}</span>
                <span className=" ">{user?.address_line_1 || "-"}</span>
                <span>{t("package_checkout.phone")}</span>
                <span className=" ">{user?.phone || "-"}</span>
              </div>
            </div>
          </div>

          {/* Khối chọn hình thức thanh toán */}
          <div className="space-y-4 rounded-lg border bg-white p-6">
            <h4 className="font-semibold md:text-lg">
              {t("checkout.payment_method")}
            </h4>
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              email={email}
              setEmail={setEmail}
              t={t}
              locale={locale}
            />
          </div>
        </div>

        <div className="sticky top-5 space-y-5 rounded-lg border bg-white p-6">
          <h4 className="leading-[24px] font-semibold md:text-lg">Tổng tiền</h4>
          {checkoutSummary.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[210px_1fr] gap-y-[14px]"
            >
              <span>Giá gói</span>
              <span className="text-right font-semibold">
                {currencyNumber(item.basePrice, true)}
              </span>
              <span>Logo chuyển động</span>
              <span className="text-right font-semibold">
                {currencyNumber(item.motionPrice, true)}
              </span>
              <span>Hướng dẫn sử dụng (bản PDF):</span>
              <span className="text-right font-semibold">
                {currencyNumber(item.manualPrice, true)}
              </span>
            </div>
          ))}
          <div className="border border-[#E4E7E9]"></div>
          <div className="grid grid-cols-[210px_1fr] gap-y-[14px]">
            <span>Tổng tiền tạm tính:</span>
            <span className="text-right font-semibold">
              {currencyNumber(checkoutSummary.subtotal, true)}
            </span>
            <span>Thuế (10%):</span>
            <span className="text-right font-semibold">
              {currencyNumber(checkoutSummary.tax, true)}
            </span>
          </div>
          <div className="border border-[#E4E7E9]"></div>
          <div className="flex flex-row items-center justify-between">
            <span>Tiền thanh toán:</span>
            <span className="text-right text-xl font-semibold text-[#FA8232]">
              {currencyNumber(checkoutSummary.grandTotal, true)}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-md bg-[#D74B3A] py-3 text-base font-medium text-white uppercase disabled:opacity-50 md:h-14"
          >
            {submitting
              ? t("checkout.processing")
              : t("package_checkout.pay_now")}
          </button>
        </div>
      </div>

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
                  {getPaymentMethodName(orderSuccess?.payment_method)}
                </span>
              </div>
              <div className="grid grid-cols-[160px_1fr] gap-2">
                <span className="text-gray-400">Email</span>
                <span className="text-right font-medium text-gray-900">
                  {orderSuccess?.email || "—"}
                </span>
              </div>
              <div className="grid grid-cols-[160px_1fr] gap-2">
                <span className="text-gray-400">{t("checkout.total")}</span>
                <span className="text-right font-bold text-orange-500">
                  {currencyNumber(orderSuccess?.total ?? 0, true)}
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
    </Container>
  );
}

export default function PackageCheckout({
  checkoutSummary,
  user,
}: {
  checkoutSummary: PackageCheckoutSummary;
  user: User;
}) {
  const { i18n } = useTranslation("common", { useSuspense: false });
  const { locale } = usePage<{ locale: string }>().props;

  const currency = (checkoutSummary.currency || "vnd").toLowerCase();
  const isZeroDecimal = ["vnd", "jpy"].includes(currency);
  const amount = Math.max(
    1,
    Math.round(
      (checkoutSummary.totalAmount || checkoutSummary.grandTotal || 10) *
        (isZeroDecimal ? 1 : 100),
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
        currency: currency,
      }}
    >
      <Head title={"Package Checkout"} />
      <PublicHeader />
      <PackageCheckoutForm checkoutSummary={checkoutSummary} user={user} />
      <PublicFooter className="mt-20" showOrangeBanner={false} />
    </Elements>
  );
}
