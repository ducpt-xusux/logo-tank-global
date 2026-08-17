import {
    AdminLayout,
    DataTable,
    DataTableColumnHeader,
    DataTableRowActions,
    notify,
} from "@/components";
import { useEffect } from "react";
import { usePage, Head } from "@inertiajs/react";
import { ItemsProps, ParamsProps, SharedData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
const breadcrumbs = [
    {
        title: "Log",
        href: route("admin.log.index"),
    },
];
interface logIndexProps {
    items: ItemsProps;
    params: ParamsProps;
}

const columns: ColumnDef<any>[] = [
    {
        id: "select",
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "logo.logo_name",
        id: "logo_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ロゴタイトル" />
        ),
        cell: ({ row }) => <div>{row.original.logo?.logo_name}</div>,
    },

    {
        accessorKey: "user.name",
        id: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="更新者" />
        ),
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
        enableHiding: false,
        meta: {
            title: "更新者",
        },
    },

    {
        accessorKey: "value",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="内容" />
        ),
        cell: ({ row }) => <div>{row.getValue("value")}</div>,
        enableHiding: false,
        meta: {
            title: "内容",
        },
    },
];

export default function index({ items, params }: logIndexProps) {
    const { flash } = usePage<SharedData>().props;
    useEffect(() => {
        if (flash.success) notify.success(flash.success);
    }, [flash]);
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="ログ" />
                <div className="flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-5 md:flex">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">
                            ログ
                        </h2>
                    </div>
                    <DataTable
                        items={items}
                        columns={columns}
                        params={params}
                        model="log"
                        showCreate={false}
                    />
                </div>
            </AdminLayout>
        </>
    );
}
