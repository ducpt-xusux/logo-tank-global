import { AdminLayout } from "@/components";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CheckCircle,
    Paintbrush,
    ShoppingBag,
    Timer,
    Truck,
    UserCheck,
} from "lucide-react";
import { useState } from "react";
import { SharedData } from "@/types";
import { toast } from "react-toastify";

interface StatusLog {
    id: number;
    status: number;
    date_time: string;
    creator?: {
        name: string;
    };
}

interface OrderStatusProps {
    order: {
        id: number;
        invoice_num: string;
        user_name: string;
    };
    logs: {
        data: StatusLog[];
    };
}

const breadcrumbs = (orderId: number) => [
    { title: "Order", href: route("admin.order.index") },
    { title: `Order #${orderId} Status`, href: "#" },
];

const status_steps = [
    {
        id: 1,
        label: "注文済み",
        icon: ShoppingBag,
        desc: "注文が正常に完了しました",
    },
    {
        id: 2,
        label: "受付済み",
        icon: UserCheck,
        desc: "Logo Tankが注文を受け付けました",
    },
    {
        id: 3,
        label: "デザイン受領",
        icon: Paintbrush,
        desc: "デザイン部門が注文を受け取りました",
    },
    {
        id: 4,
        label: "処理中",
        icon: Timer,
        desc: "注文を処理しています",
    },
    {
        id: 5,
        label: "配送中",
        icon: Truck,
        desc: "商品を発送中です",
    },
    {
        id: 6,
        label: "完了",
        icon: CheckCircle,
        desc: "配送が完了しました",
    },
];

export default function Status() {
    const { order, logs } = usePage<SharedData & OrderStatusProps>().props;
    const logList = logs.data || [];
    const [isLoading, setIsLoading] = useState(false);

    const latestStatus = logList.length > 0 ? logList[0].status : 0;

    const handleStepClick = (stepId: number) => {
        if (isLoading) return;

        // Already completed
        if (stepId <= latestStatus) {
            return;
        }

        if (stepId !== latestStatus + 1) {
            toast.error("ステータスを順番に更新してください!");
            return;
        }

        // Proceed to update
        setIsLoading(true);
        router.post(
            route("admin.order.store-status", order.id),
            { status: stepId },
            {
                onSuccess: () => {
                    toast.success("ステータスが正常に更新されました。!");
                },
                onError: () => toast.error("ステータスの更新に失敗しました。"),
                onFinish: () => setIsLoading(false),
            },
        );
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs(order.id)}>
            <Head title={`Order #${order.id} Status Management`} />
            <div className="space-y-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight text-[#474747]">
                        注文を追跡する
                    </h2>
                </div>

                {/* Order Summary */}
                <Card className="border-teal-100 bg-teal-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-teal-800">
                            注文情報 #{order.id}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-gray-500">Mã hóa đơn</p>
                            <p className="font-semibold">
                                {order.invoice_num || "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Khách hàng</p>
                            <p className="font-semibold">{order.user_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Trạng thái hiện tại
                            </p>
                            <p className="font-semibold text-teal-700">
                                {status_steps.find((s) => s.id === latestStatus)
                                    ?.desc || "N/A"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Stepper (Progress Bar) */}
                <Card>
                    <CardContent className="pt-12 pb-16">
                        <div className="relative flex w-full items-center justify-between px-[28px]">
                            {/* Background Line */}
                            <div className="absolute top-7 right-0 left-0 h-[2px] bg-gray-200" />

                            {/* Active Line */}
                            <div
                                className="absolute top-7 left-0 h-[2px] bg-[#00A29A] transition-all duration-500"
                                style={{
                                    width: `${Math.max(0, (latestStatus - 1) / (status_steps.length - 1)) * 100}%`,
                                }}
                            />

                            {status_steps.map((step, index) => {
                                const isActive = step.id <= latestStatus;
                                const isNext = step.id === latestStatus + 1;
                                const Icon = step.icon;

                                return (
                                    <div
                                        key={step.id}
                                        className="relative z-10 flex w-14 flex-col items-center"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStepClick(step.id)
                                            }
                                            disabled={isLoading}
                                            className={`flex h-14 w-14 items-center justify-center rounded-full border-4 transition-all duration-300 focus:outline-none ${
                                                isActive
                                                    ? "cursor-default border-[#00A29A] bg-white text-[#00A29A] shadow-md"
                                                    : isNext
                                                      ? "cursor-pointer border-gray-200 bg-white text-gray-400 hover:border-[#00A29A] hover:text-[#00A29A]"
                                                      : "cursor-pointer border-gray-200 bg-white text-gray-200"
                                            }`}
                                            title={step.desc}
                                        >
                                            <Icon className="h-7 w-7" />
                                        </button>
                                        <div className="absolute top-16 left-1/2 flex w-max -translate-x-1/2 flex-col items-center text-center">
                                            <span
                                                className={`text-xs font-bold whitespace-nowrap ${isActive === true ? "text-[#191C1F]" : "text-gray-400"}`}
                                            >
                                                {step.desc}
                                            </span>
                                            <span className="mt-0.5 text-[10px] whitespace-nowrap text-gray-400">
                                                {step.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* History Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-[#474747]">
                            更新履歴
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {logList.length === 0 ? (
                            <p className="py-4 text-center text-gray-500">
                                まだ更新履歴はありません
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {logList.map((log) => (
                                    <div
                                        key={log.id}
                                        className="relative flex gap-4 border-l-2 border-[#E4E7E9] pb-2 pl-6 last:border-0 last:pb-0"
                                    >
                                        <div className="absolute top-1 -left-[7px] h-3 w-3 rounded-full bg-[#00A29A]" />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-gray-800">
                                                    {status_steps.find(
                                                        (s) =>
                                                            s.id === log.status,
                                                    )?.desc || "Updated"}
                                                </p>
                                                <span className="text-xs font-medium text-gray-400">
                                                    {log.date_time}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                By:{" "}
                                                {log.creator?.name || "System"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
