import {
    AdminLayout,
    DataTable,
    DataTableColumnHeader,
    DataTableRowActions,
    notify,
} from "@/components";
import { ColumnDef } from "@tanstack/react-table";
import { QrCode } from "lucide-react";
import { StripeIcon } from "@/components/icon";
import { useState } from "react";
import { ItemsProps, ParamsProps } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const breadcrumbs = [
    {
        title: "Order",
        href: route("admin.order.index"),
    },
];
interface orderIndexProps {
    items: ItemsProps;
    params: ParamsProps;
}

const getStatus = (status: number) => {
    switch (status) {
        case 1:
            return (
                <span className="mr-2 rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Unpaid
                </span>
            );
        case 2:
            return (
                <span className="mr-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Paid
                </span>
            );
        case 3:
            return (
                <span className="mr-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Cancelled
                </span>
            );
        default:
            break;
    }
};

const formatCurrencyPrice = (
    amount: number | string | undefined,
    currencyCode: string | undefined,
) => {
    if (amount === undefined || amount === null || amount === "") return "0";
    const value =
        typeof amount === "string"
            ? parseFloat(amount.replaceAll(",", ""))
            : amount;
    if (isNaN(value)) return "0";

    const currency = (currencyCode || "").toUpperCase();

    if (currency === "USD") {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    } else if (currency === "VND") {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    } else if (currency === "JPY") {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    }

    // Default formatting
    return (
        new Intl.NumberFormat("en-US").format(value) +
        (currency ? ` ${currency}` : "")
    );
};

export default function Index({ items, params }: orderIndexProps) {
    const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const showModalConfirm = (item: any) => {
        setSelectedOrderId(item.id);
        setShowConfirm(true);
    };

    const confirmPayment = () => {
        if (!selectedOrderId) return;
        router.post(
            route("admin.order.update-status", selectedOrderId),
            {},
            {
                onSuccess: () => {
                    setShowConfirm(false);
                },
                onError: (errors) => {
                    notify.error("Error updating order status");
                },
            },
        );
    };

    const columns: ColumnDef<any>[] = [
        {
            id: "select",
            enableSorting: false,
            enableHiding: false,
        },

        {
            accessorKey: "type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="注文タイプ" />
            ),
            cell: ({ row }) => {
                const typeValue = row.getValue("type") as number;
                return (
                    <div>
                        {typeValue === 3 ? (
                            <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                                パッケージ
                            </span>
                        ) : (
                            <span className="rounded bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-800">
                                ロゴ
                            </span>
                        )}
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "invoice_num",
            id: "invoice_num",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="請求書番号" />
            ),
            cell: ({ row }) => <div>{row.getValue("invoice_num")}</div>,
            enableHiding: false,
        },

        {
            accessorKey: "id",
            id: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="注文ID" />
            ),
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            enableHiding: false,
        },

        {
            accessorKey: "user_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="購入者名" />
            ),
            cell: ({ row }) => <div>{row.getValue("user_name")}</div>,
            enableHiding: false,
        },

        {
            accessorKey: "payment_date",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="支払期日" />
            ),
            cell: ({ row }) => <div>{row.getValue("payment_date")}</div>,
            enableHiding: false,
        },

        {
            accessorKey: "payment_status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="支払い状況" />
            ),
            cell: ({ row }) => {
                const statusValue = row.getValue("payment_status") as number;
                return <div>{getStatus(statusValue)}</div>;
            },
            enableHiding: false,
        },

        {
            accessorKey: "tax",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="税" />
            ),
            cell: ({ row }) => {
                return (
                    <div>
                        {formatCurrencyPrice(
                            row.getValue("tax") as number,
                            row.original.currency as string,
                        )}
                    </div>
                );
            },
            enableHiding: false,
        },

        {
            accessorKey: "total_amount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="合計金額" />
            ),
            cell: ({ row }) => {
                return (
                    <div>
                        {formatCurrencyPrice(
                            row.getValue("total_amount") as number,
                            row.original.currency as string,
                        )}
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "currency",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="通貨" />
            ),
            cell: ({ row }) => {
                return <div>{row.getValue("currency")}</div>;
            },
            enableHiding: false,
        },
        {
            accessorKey: "progress",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="進捗状況" />
            ),
            cell: ({ row }) => {
                const item = row.original;
                const latestLog = item.status_logs?.[0];
                const statusText = latestLog ? (
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        {latestLog.status === 1 && "注文済み"}
                        {latestLog.status === 2 && "受付済み"}
                        {latestLog.status === 3 && "デザイン受領"}
                        {latestLog.status === 4 && "処理中"}
                        {latestLog.status === 5 && "配送中"}
                        {latestLog.status === 6 && "完了"}
                    </span>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                );

                return (
                    <div className="flex items-center gap-2">
                        {statusText}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-teal-600 hover:text-teal-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.visit(
                                    route("admin.order.status", item.id),
                                );
                            }}
                        >
                            進捗管理
                        </Button>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="アクション" />
            ),
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="">
                        {item.payment_status == 1 && item.status == 1 ? (
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showModalConfirm(item);
                                }}
                                variant="success"
                                size="sm"
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                入金完了
                            </Button>
                        ) : null}
                    </div>
                );
            },
        },
    ];

    const paymentMethods = [
        {
            id: 1,
            name: "Credit Card Stripe",
            icon: <StripeIcon className="h-20 w-20" />,
            active: true,
        },
        {
            id: 2,
            name: "QR Scan",
            icon: <QrCode className="h-20 w-20" />,
            active: true,
        },
        {
            id: 3,
            name: "Momo",
            icon: <img className="h-20 w-20" src="/img/logo-momo.png" alt="" />,
            active: false,
        },
        {
            id: 4,
            name: "ZaloPay",
            icon: (
                <img className="h-20 w-20" src="/img/logo-zalopay.png" alt="" />
            ),
            active: false,
        },
    ];

    const getPaymentMethod = (id: string) => {
        const payment = paymentMethods.find((el: any) => (el.id = id));
    };
    // const showModalConfirm = (item: any) => {
    //     setSelectedOrderId(item.id);
    //     setShowConfirm(true);
    // };

    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="注文管理" />
                <div className="flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-5 md:flex">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">
                            注文管理
                        </h2>
                    </div>
                    <DataTable
                        items={items}
                        columns={columns}
                        params={params}
                        model="order"
                        renderDetail={(row) => {
                            const isPackage = row.original.type === 3;

                            if (isPackage) {
                                const packageHeaders = [
                                    { header: "パッケージ名" },
                                    { header: "数量" },
                                    { header: "価格" },
                                    { header: "ロゴマニュアル" },
                                    { header: "モーションロゴ" },
                                    { header: "メインテキスト" },
                                ];
                                const packageData =
                                    row.original.order_packages || [];
                                return (
                                    <div>
                                        <Table className="border-collapse border border-gray-300">
                                            <TableHeader>
                                                <TableRow className="bg-gray-300 text-center">
                                                    {packageHeaders.map(
                                                        (
                                                            el: any,
                                                            i: number,
                                                        ) => (
                                                            <TableHead
                                                                key={i}
                                                                className="text-center"
                                                            >
                                                                {el.header}
                                                            </TableHead>
                                                        ),
                                                    )}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {packageData.map(
                                                    (
                                                        element: any,
                                                        i: number,
                                                    ) => (
                                                        <TableRow
                                                            key={i}
                                                            className="bg-gray-50 text-center"
                                                        >
                                                            <TableCell>
                                                                {element.package
                                                                    ?.key ||
                                                                    element.packageName ||
                                                                    "Unknown"}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    element.quantity
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatCurrencyPrice(
                                                                    element.price,
                                                                    row.original
                                                                        .currency,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatCurrencyPrice(
                                                                    element.logo_manual_price,
                                                                    row.original
                                                                        .currency,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatCurrencyPrice(
                                                                    element.logo_motion_price,
                                                                    row.original
                                                                        .currency,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatCurrencyPrice(
                                                                    element.main_text_price,
                                                                    row.original
                                                                        .currency,
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                );
                            }

                            const headerProps = [
                                {
                                    header: "ロゴ名",
                                },
                                {
                                    header: "価格",
                                },
                                {
                                    header: "ロゴマニュアル",
                                },
                                {
                                    header: "モーションロゴ",
                                },
                                {
                                    header: "メインネーム",
                                },
                                {
                                    header: "サブネーム",
                                },
                            ];
                            const data2 = row.original.order_logos || [];
                            return (
                                <div>
                                    <Table className="border-collapse border border-gray-300">
                                        <TableHeader>
                                            <TableRow className="bg-gray-300 text-center">
                                                {headerProps.map(
                                                    (el: any, i: number) => (
                                                        <TableHead
                                                            key={i}
                                                            className="text-center"
                                                        >
                                                            {el.header}
                                                        </TableHead>
                                                    ),
                                                )}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data2.map(
                                                (element: any, i: number) => (
                                                    <TableRow
                                                        key={i}
                                                        className="bg-gray-50 text-center"
                                                    >
                                                        <TableCell>
                                                            {
                                                                element.logo
                                                                    ?.logo_name
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatCurrencyPrice(
                                                                row.original
                                                                    .price,
                                                                row.original
                                                                    .currency,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatCurrencyPrice(
                                                                element.logo_motion_price,
                                                                row.original
                                                                    .currency,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatCurrencyPrice(
                                                                element.logo_manual_price,
                                                                row.original
                                                                    .currency,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {element.main_name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {element.sub_name}
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            );
                        }}
                    />
                </div>
            </AdminLayout>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>入金確認</DialogTitle>
                        <DialogDescription>
                            この注文を「入金完了」としてマークしてもよろしいですか？
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirm(false)}
                        >
                            キャンセル
                        </Button>
                        <Button variant="success" onClick={confirmPayment}>
                            確認
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
