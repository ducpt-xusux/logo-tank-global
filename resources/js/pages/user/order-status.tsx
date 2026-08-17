import { PublicHeader, Container, PublicFooter } from "@/components";
import { getLocaleLink } from "@/helper/utils";
import { Head, Link, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { useTranslation } from "react-i18next";
import {
  CheckCheck,
  Paintbrush,
  ShoppingBag,
  Timer,
  Truck,
  UserCheck,
} from "lucide-react";

interface OrderLogoItem {
  id?: number;
  logo_id?: number;
}

interface OrderStatusLogItem {
  id?: number;
  status?: number;
  date_time?: string;
}

interface OrderData {
  id?: number;
  invoice_num?: string | null;
  total_amount?: number | string | null;
  sub_total?: number | string | null;
  tax?: number | string | null;
  tax_rate?: number | string | null;
  currency?: string | null;
  payment_status?: number | null;
  status?: number | null;
  orderLogos?: OrderLogoItem[];
  order_logos?: OrderLogoItem[];
}

interface OrderStatusProps {
  locale?: "en" | "vi" | "ja";
  order?: OrderData;
  logs?: OrderStatusLogItem[] | { data?: OrderStatusLogItem[] };
}

export default function OrderStatus() {
  const { order, logs } = usePage<SharedData & OrderStatusProps>().props;
  const { t, i18n } = useTranslation("common", { useSuspense: false });

  const status_steps = [
    {
      id: 1,
      label: t("order_status.steps.step_1") || "Order Successful",
      icon: ShoppingBag,
    },
    {
      id: 2,
      label: t("order_status.steps.step_2") || "Logo Tank Received",
      icon: UserCheck,
    },
    {
      id: 3,
      label: t("order_status.steps.step_3") || "Design Received",
      icon: Paintbrush,
    },
    {
      id: 4,
      label: t("order_status.steps.step_4") || "Processing",
      icon: Timer,
    },
    {
      id: 5,
      label: t("order_status.steps.step_5") || "Shipping",
      icon: Truck,
    },
    {
      id: 6,
      label: t("order_status.steps.step_6") || "Completed",
      icon: CheckCheck,
    },
  ];

  const logList = Array.isArray(logs) ? logs : logs?.data || [];
  const currentStatus = logList.length > 0 ? (logList[0].status ?? 1) : 1;

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
      title: `${t("order_status.title")}${order?.invoice_num}`,
    },
  ];

    return (
        <>
            <Head title="Order Status" />
            <PublicHeader />
            <div className="flex w-full items-center bg-[#F2F4F5] text-[12px] text-[#5F6C72] md:h-[72px] md:text-[16px]">
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
                                        className="transition-colors hover:text-[#F3993F]"
                                    >
                                        {breadcrumb.title}
                                    </Link>
                                ) : (
                                    <span className="font-medium text-[#F3993F]">
                                        {breadcrumb.title}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Container className="py-10">
                <div className="mx-auto w-full max-w-[800px] rounded-md border border-[#E4E7E9] p-6">
                    <h2 className="mb-6 text-xl font-bold">Order ID: {order?.invoice_num}</h2>
                    
                    {/* Status Steps */}
                    <div className="flex w-full items-center justify-between">
                        {status_steps.map((step, index) => {
                            const isCompleted = step.id <= currentStatus;
                            const isCurrent = step.id === currentStatus;
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className="flex flex-1 flex-col items-center relative">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                            isCompleted
                                                ? "border-brand bg-brand text-white"
                                                : "border-[#E4E7E9] bg-white text-[#5F6C72]"
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span
                                        className={`mt-2 text-center text-[10px] md:text-xs ${
                                            isCurrent
                                                ? "font-bold text-brand"
                                                : "text-[#5F6C72]"
                                        }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Time line */}
                    <div className="mt-10 w-full max-w-1/2">
                        {logList.length === 0 ? (
                            <p className="mt-2 text-sm text-[#5F6C72]">
                                No status logs yet.
                            </p>
                        ) : (
                            <ul className="space-y-2 rounded-md">
                                {logList.map((log, idx) => (
                                    <li key={log.id || `log-${idx}`} className="px-3 py-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs text-[#000000]">
                                                {log.date_time || "-"}
                                            </span>
                                            <span className="text-brand">
                                                {t(`order_status.steps.step_${log.status}`) || "Updated"}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </Container>

            {/* footer without LogoTank Man */}
            <PublicFooter className="mt-20" showOrangeBanner={false} />
        </>
    );
}
