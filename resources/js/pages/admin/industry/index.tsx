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
        title: "ジャンル",
        href: route("admin.industry.index"),
    },
];
interface industryIndexProps {
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
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="スラッグ" />
        ),
        cell: ({ row }) => <div>{row.original.name_ja}</div>,
        enableHiding: false,
        meta: {
            title: "スラッグ",
        },
    },

    {
        accessorKey: "name_vi",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Thể Loại" />
        ),
        cell: ({ row }) => <div>{row.getValue("name_vi")}</div>,
        enableHiding: false,
        meta: {
            title: "Thể Loại",
        },
    },

    {
        accessorKey: "name_en",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Genre" />
        ),
        cell: ({ row }) => <div>{row.getValue("name_en")}</div>,
        enableHiding: false,
        meta: {
            title: "Genre",
        },
    },

    {
        accessorKey: "reg_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="登録日時" />
        ),
        cell: ({ row }) => <div>{row.getValue("reg_date")}</div>,
        enableHiding: false,
        meta: {
            title: "登録日時",
        },
    },

    {
        id: "actions",
        accessorKey: "id",
        header: ({ column }) => null,
        cell: ({ row }) => <DataTableRowActions row={row} model="industry" />,
    },
];

export default function index({ items, params }: industryIndexProps) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash.success) notify.success(flash.success);
    }, [flash]);

    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="業種を選択" />
                <div className="flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-5 md:flex">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">
                            ジャンル一覧
                        </h2>
                    </div>
                    <DataTable
                        items={items}
                        columns={columns}
                        params={params}
                        model="industry"
                    />
                </div>
            </AdminLayout>
        </>
    );
}
