import React, {useEffect} from 'react';
import {Head, usePage} from "@inertiajs/react";
import {ItemsProps, ParamsProps, SharedData, User} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {AdminLayout, DataTable, DataTableColumnHeader, DataTableRowActions, notify} from "@/components";
import {getPostStatus} from "@/lib/utils";

const breadcrumbs = [
    {
        title: '投稿',
        href: route('admin.post.index'),
    }
]


const columns: ColumnDef<any>[] = [
    {
        id: "select",
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="タイトル"/>
        ),
        cell: ({row}) => <div>{row.getValue("title")}</div>,
        enableHiding: false,
        meta: {
            title: 'タイトル'
        }
    },
    {
        accessorKey: "slug",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="スラッグ"/>
        ),
        cell: ({row}) => <div>{row.getValue("slug")}</div>,
        meta: {
            title: 'スラッグ'
        }
    },
    {
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="表示状態"/>
        ),
        cell: ({row}) => {
            return <div>{row.getValue("status")}</div>
        },
        meta: {
            title: '表示状態',
            filterable: true,
            options: getPostStatus()
        }
    },
    {
        accessorKey: "created_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="登録日時"/>
        ),
        cell: ({row}) => <div>{row.getValue("created_at")}</div>,
        meta: {
            title: '登録日時'
        }
    },
    {
        id: "actions",
        accessorKey: 'id',
        header: () => null,
        cell: ({row}) => <DataTableRowActions row={row} model='post' />,
    },
]

export default function PostIndex({items, params}: { items: ItemsProps, params: ParamsProps }) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash.success) notify.success(flash.success);
    }, [flash])

    return <AdminLayout breadcrumbs={breadcrumbs}>
        <Head title='投稿一覧' />
        <div className="h-full flex-1 flex-col space-y-4 p-2 sm:px-6 sm:pt-2 sm:pb-10 md:flex">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">投稿一覧</h2>
            </div>
            <DataTable items={items} columns={columns} params={params} model='post' />
        </div>
    </AdminLayout>
}
