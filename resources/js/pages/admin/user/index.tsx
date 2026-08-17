import React, { useEffect } from "react";
import {
    AdminLayout,
    DataTable,
    DataTableColumnHeader,
    DataTableRowActions,
    notify,
} from "@/components";
import { Head, usePage } from "@inertiajs/react";
import { ItemsProps, ParamsProps, SharedData, User } from "@/types";
import { getUserRole } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

const breadcrumbs = [
    {
        title: "ユーザー",
        href: route("admin.user.index"),
    },
];

const columns: ColumnDef<any>[] = [
    {
        id: "select",
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ユーザー名" />
        ),
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
        enableHiding: false,
        meta: {
            title: "ユーザー名",
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="メールアドレス" />
        ),
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
        meta: {
            title: "メールアドレス",
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="役割" />
        ),
        cell: ({ row }) => {
            const role = getUserRole().find(
                (r) => r.value === String(row.getValue("role")),
            );
            return <div>{role?.label}</div>;
        },
        meta: {
            title: "役割",
            filterable: true,
            options: getUserRole(),
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="登録日時" />
        ),
        cell: ({ row }) => <div>{row.getValue("created_at")}</div>,
        meta: {
            title: "登録日時",
        },
    },
    {
        id: "actions",
        accessorKey: "id",
        header: ({ column }) => null,
        cell: ({ row }) => <DataTableRowActions row={row} model="user" />,
    },
];

export default function UserIndex({
    items,
    params,
}: {
    items: ItemsProps;
    params: ParamsProps;
}) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash.success) notify.success(flash.success);
    }, [flash]);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="ユーザー一覧" />
            <div className="flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-5 md:flex">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        ユーザー一覧
                    </h2>
                </div>
                <DataTable
                    items={items}
                    columns={columns}
                    params={params}
                    model="user"
                />
            </div>
        </AdminLayout>
    );
}
