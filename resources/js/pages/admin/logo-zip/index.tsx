import {
    AdminLayout,
    DataTable,
    DataTableColumnHeader,
    DataTableRowActions,
} from "@/components";
import { ItemsProps, ParamsProps, SharedData } from "@/types";

import { Head, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";

const breadcrumbs = [
    {
        title: "zipファイル",
        href: route("admin.logo-zip.index"),
    },
];
interface logoZipIndexProps {
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
        accessorKey: "logo_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="シンボルコード" />
        ),
        cell: ({ row }) => <div>{row.original.logo_id}</div>,
        enableHiding: false,
    },

    {
        accessorKey: "url_zip",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ジップURL" />
        ),
        cell: ({ row }) => <div>{row.original.url_zip}</div>,
        enableHiding: false,
        meta: {
            title: "ジップURL",
        },
    },

    {
        id: "actions",
        accessorKey: "id",
        header: ({ column }) => null,
        cell: ({ row }) => <DataTableRowActions row={row} model="logo-zip" />,
    },
];
export default function LogoZipIndex({ items, params }: logoZipIndexProps) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="ユーザー一覧" />
            <div className="flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-5 md:flex">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        zipファイル
                    </h2>
                </div>
                <DataTable
                    items={items}
                    columns={columns}
                    params={params}
                    model="logo-zip"
                />
            </div>
        </AdminLayout>
    );
}
