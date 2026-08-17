import * as React from "react";
import {
    ColumnDef,
    Row,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    getExpandedRowModel,
    ColumnFiltersState,
    AccessorKeyColumnDef,
    PaginationState,
    SortingState,
    ColumnSort,
    ExpandedState,
} from "@tanstack/react-table";

import {
    DataTablePagination,
    DataTableToolbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components";
import { useEffect, useRef, useState } from "react";
import { ColumnMeta, ItemsProps, ParamsProps } from "@/types";
import { router } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    items: ItemsProps;
    params?: ParamsProps;
    model: string;
    showCreate?: boolean;
    renderDetail?: (row: Row<TData>) => React.ReactNode;
}

const defaultParams = {
    page: 0,
    per_page: 20,
    sort_field: "",
    sort_value: "asc",
    keyword: "",
};

function parseQueryToColumnFilters(
    params: ParamsProps | undefined,
): ColumnFiltersState {
    const filters: ColumnFiltersState = [];
    if (!params) return filters;
    const defaultKeys = Object.keys(defaultParams);

    for (const [key, value] of Object.entries(params)) {
        if (defaultKeys.includes(key) || !value) {
            continue;
        }

        filters.push({
            id: key,
            value: (value as string).split(","),
        });
    }

    return filters;
}

function parseQueryToColumnSort(params: ParamsProps | undefined): SortingState {
    const sorts: SortingState = [];
    if (!params) return sorts;

    if (params.sort_field) {
        sorts.push({
            id: params.sort_field,
            desc: params.sort_value === "desc",
        });
    }

    return sorts;
}

function getFilterableColumns<TData, TValue>(
    columns: ColumnDef<TData, TValue>[],
) {
    const filterableColumns: string[] = [];
    columns.forEach((column) => {
        const meta = column.meta as ColumnMeta | undefined;
        const accessorKey = (column as AccessorKeyColumnDef<TData, TValue>)
            .accessorKey;
        if (meta?.filterable) filterableColumns.push(String(accessorKey));
    });
    return filterableColumns;
}

function omitKeys<T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
    reset?: boolean,
): Omit<T, K> {
    const newObj = { ...obj };
    keys.forEach((key) => delete newObj[key]);
    return reset
        ? {
              ...newObj,
              keyword: "",
          }
        : newObj;
}

export function DataTable<TData, TValue>({
    columns,
    items,
    params,
    model,
    renderDetail,
    showCreate = true,
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );

    const [parameters, setParameters] = useState<ParamsProps>(
        params ?? defaultParams,
    );

    const [loading, setLoading] = useState(false);

    const isFirstRender = useRef(true);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const resetFilter = useRef(false);

    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageIndex: params?.page ? params?.page - 1 : 0,
        pageSize: params?.per_page ?? 20,
    });

    const [sortingState, setSortingState] = useState<SortingState>([]);

    const [expanded, setExpanded] = useState<ExpandedState>({});

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setLoading(true);
        router.get(route(`admin.${model}.index`), parameters, {
            showProgress: true,
            onFinish: () => {
                setLoading(false);
            },
        });
    }, [parameters]);

    const table = useReactTable({
        data: items.data,
        columns,
        state: {
            columnVisibility,
            expanded,
            columnFilters: parseQueryToColumnFilters(params),
            globalFilter: parameters.keyword,
            pagination: paginationState,
            sorting: parseQueryToColumnSort(params),
        },
        pageCount: items.meta.last_page,
        enableRowSelection: true,
        onSortingChange: (sort) => {
            setSortingState(sort);
            let sorts: SortingState =
                typeof sort === "function" ? sort(sortingState) : sort;
            const columnSort: ColumnSort = sorts[0];
            if (columnSort) {
                setParameters({
                    ...parameters,
                    sort_field: columnSort.id,
                    sort_value: columnSort.desc ? "desc" : "asc",
                });
            }
        },
        onGlobalFilterChange: (value) => {
            if (resetFilter.current) return;
            setParameters({ ...parameters, keyword: value ?? "" });
        },
        onColumnFiltersChange: (value) => {
            setColumnFilters(value);
            let filters: ColumnFiltersState =
                typeof value === "function" ? value(columnFilters) : value;
            if (filters.length === 0) {
                setParameters(
                    omitKeys(
                        parameters,
                        getFilterableColumns(columns),
                        resetFilter.current,
                    ),
                );
                if (resetFilter.current) resetFilter.current = false;
                return;
            }
            filters.forEach((filter) => {
                setParameters({
                    ...parameters,
                    [filter.id]: Array.isArray(filter.value)
                        ? filter.value.join(",")
                        : filter,
                });
            });
        },
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: (value) => {
            let state: PaginationState =
                typeof value === "function" ? value(paginationState) : value;
            setPaginationState(value);
            setParameters({
                ...parameters,
                page: state.pageIndex + 1,
                per_page: state.pageSize,
            });
        },
        getCoreRowModel: getCoreRowModel(),
        onExpandedChange: setExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getRowCanExpand: () => !!renderDetail,
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
    });
    return (
        <div className="space-y-4">
            {showCreate && (
                <DataTableToolbar
                    table={table}
                    params={params}
                    resetFilter={resetFilter}
                    model={model}
                />
            )}
            <div className="rounded-md border shadow-md">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-20"
                                >
                                    <div className="flex justify-center items-center h-full">
                                        <LoaderCircle className="animate-spin text-teal-600" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                        onClick={
                                            renderDetail
                                                ? row.getToggleExpandedHandler()
                                                : undefined
                                        }
                                        className={
                                            renderDetail
                                                ? "cursor-pointer hover:bg-[#daebdf]"
                                                : ""
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {renderDetail &&
                                        row.getIsExpanded() &&
                                        renderDetail && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={columns.length}
                                                >
                                                    {renderDetail(row)}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    結果がありません。
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
