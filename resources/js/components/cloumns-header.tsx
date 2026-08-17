import {Column} from "@tanstack/react-table"
import {ArrowDown, ArrowUp, ChevronsUpDown, EyeOff} from "lucide-react"
import {cn} from "@/lib/utils"
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components"
import React from "react";

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}

export function DataTableColumnHeader<TData, TValue>({column, title, className}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-neutral-100"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "asc" ? (
                            <ArrowDown/>
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowUp/>
                        ) : (
                            <ChevronsUpDown/>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70"/>
                        降順
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70"/>
                        昇順
                    </DropdownMenuItem>
                    { column.getCanHide() && <>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70"/>
                            非表示
                        </DropdownMenuItem>
                    </>}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
