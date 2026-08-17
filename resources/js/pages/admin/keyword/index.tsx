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
    title: "キーワード",
    href: route("admin.keyword.index"),
  },
];
interface keywordIndexProps {
  items: ItemsProps;
  params: ParamsProps;
}
const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div>{row.original.id}</div>,
    enableHiding: false,
  },
  {
    id: "name_ja",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="日本語のキーワード" />
    ),
    cell: ({ row }) => <div>{row.original.keyword_language?.ja}</div>,
    enableHiding: false,
  },
  {
    id: "name_vi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ベトナム語キーワード" />
    ),
    cell: ({ row }) => <div>{row.original.keyword_language?.vi}</div>,
    enableHiding: false,
  },
  {
    id: "name_en",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="英語のキーワード" />
    ),
    cell: ({ row }) => <div>{row.original.keyword_language?.en}</div>,
    enableHiding: false,
  },
  {
    id: "actions",
    accessorKey: "id",
    header: ({ column }) => null,
    cell: ({ row }) => <DataTableRowActions row={row} model="keyword" />,
  },
];
export default function KeywordIndex({ items, params }: keywordIndexProps) {
  const data1 = usePage().props;
  return (
    <>
      <AdminLayout breadcrumbs={breadcrumbs}>
        <Head title="キーワード" />
        <div className="flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-5 md:flex">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">キーワード</h2>
          </div>
          <DataTable
            items={items}
            columns={columns}
            params={params}
            model="keyword"
            showCreate={true}
          />
        </div>
      </AdminLayout>
    </>
  );
}
