import { Column, Table } from "@tanstack/react-table";
import {
    Check,
    PlusCircle,
    PlusCircleIcon,
    Search,
    SearchIcon,
    Settings2,
    XIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    Input,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Badge,
    Separator,
} from "@/components";
import { cn } from "@/lib/utils";
import { ColumnMeta, ParamsProps } from "@/types";
import React, { useState } from "react";
import { Link } from "@inertiajs/react";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    resetFilter: React.RefObject<boolean>;
    params?: ParamsProps;
    model: string;
}

function getFilterColumns<TData>(table: Table<TData>) {
    return table.getAllColumns().filter((column) => {
        const meta = column.columnDef.meta as ColumnMeta | undefined;
        return (
            typeof column.accessorFn !== "undefined" &&
            column.getCanHide() &&
            meta?.filterable
        );
    });
}

export function DataTableToolbar<TData>({
    table,
    model,
    resetFilter,
}: DataTableToolbarProps<TData>) {
    const [keyword, setKeyword] = useState("");
    const isFiltered =
        table.getState().columnFilters.length > 0 ||
        table.getState().globalFilter !== "";

    const search = () => {
        if (keyword.trim() === "") return;
        table.setGlobalFilter(keyword);
    };

    const reset = () => {
        resetFilter.current = true;
        table.resetGlobalFilter(true);
        table.resetColumnFilters(true);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex gap-2">
                    <Input
                        placeholder="フィルター"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") search();
                        }}
                    />
                    <Button
                        variant="secondary"
                        className="h-8 bg-teal-600 px-2 hover:bg-teal-700 lg:px-3"
                        onClick={search}
                    >
                        <Search className="text-white" />
                    </Button>
                    {getFilterColumns(table).map((column) => {
                        const meta = column.columnDef.meta as
                            | ColumnMeta
                            | undefined;
                        return (
                            <DataTableFacetedFilter
                                column={column}
                                title={meta?.title}
                                options={meta?.options ?? []}
                                key={column.id}
                            />
                        );
                    })}
                    {table.getState().globalFilter !== "" && (
                        <div className="flex items-center gap-2 rounded-md border border-dashed px-3">
                            {/* <SearchIcon className="size-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal"
                            >
                                {table.getState().globalFilter}
                            </Badge> */}
                        </div>
                    )}
                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={reset}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <XIcon />
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex"
                    asChild
                >
                    <Link href={route(`admin.${model}.create`)}>
                        <PlusCircleIcon />
                        作成
                    </Link>
                </Button>
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}

export function DataTableViewOptions<TData>({
    table,
}: DataTableViewOptionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex"
                >
                    <Settings2 />
                    表示
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>列の表示切替</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" &&
                            column.getCanHide(),
                    )
                    .map((column) => {
                        const meta = column.columnDef.meta as
                            | ColumnMeta
                            | undefined;
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="cursor-pointer capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                    column.toggleVisibility(value)
                                }
                            >
                                {meta?.title ?? column.id}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>;
    title?: string;
    options: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
}

export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
}: DataTableFacetedFilterProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues();
    const selectedValues = new Set(column?.getFilterValue() as string[]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-dashed"
                >
                    <PlusCircle />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="mx-2 h-4"
                            />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedValues.size}個選択中
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) =>
                                            selectedValues.has(option.value),
                                        )
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>見つかりません</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(
                                    option.value,
                                );
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                selectedValues.delete(
                                                    option.value,
                                                );
                                            } else {
                                                selectedValues.add(
                                                    option.value,
                                                );
                                            }
                                            const filterValues =
                                                Array.from(selectedValues);
                                            column?.setFilterValue(
                                                filterValues.length
                                                    ? filterValues
                                                    : undefined,
                                            );
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <div
                                            className={cn(
                                                "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible",
                                            )}
                                        >
                                            <Check className="text-white" />
                                        </div>
                                        {option.icon && (
                                            <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                                        )}
                                        <span>{option.label}</span>
                                        {facets?.get(option.value) && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                                {facets.get(option.value)}
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() =>
                                            column?.setFilterValue(undefined)
                                        }
                                        className="justify-center text-center"
                                    >
                                        フィルターをクリア
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
