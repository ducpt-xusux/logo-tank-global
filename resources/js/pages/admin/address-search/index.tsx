import { AdminLayout, DataTable, DataTableColumnHeader } from "@/components";
import { ItemsProps, ParamsProps, SharedData } from "@/types";

import { Head, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
const breadcrumbs = [
    {
        title: "アドレス検索",
        href: route("admin.address-search.index"),
    },
];
interface addressSearchIndexProps {
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
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => <div>{row.original.id}</div>,
        enableHiding: false,
    },

    {
        accessorKey: "address_ip",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="アドレスIP" />
        ),
        cell: ({ row }) => <div>{row.original.address_ip}</div>,
        enableHiding: false,
        meta: {
            title: "アドレスIP",
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="登録日時" />
        ),
        cell: ({ row }) => <div>{row.original.created_at}</div>,
        enableHiding: false,
        meta: {
            title: "登録日時",
        },
    },
];
export default function AddressSearchIndex({
    items,
    params,
}: addressSearchIndexProps) {
    const data1 = usePage().props;
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="アドレス検索" />
                <div className="flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-5 md:flex">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">
                            アドレス検索
                        </h2>
                    </div>
                    <DataTable
                        items={items}
                        columns={columns}
                        params={params}
                        model="address-search"
                        showCreate={false}
                    />
                </div>
            </AdminLayout>
        </>
    );
}
