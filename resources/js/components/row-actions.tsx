import React, { FormEventHandler, useState } from "react";
import { Row } from "@tanstack/react-table";
import { LoaderCircle, MoreHorizontal, TrashIcon } from "lucide-react";

import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components";
import { Link, useForm } from "@inertiajs/react";
import { getRouteParams } from "@/lib/utils";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
    model: string;
}

export function DataTableRowActions<TData>({
    row,
    model,
}: DataTableRowActionsProps<TData>) {
    const routeParam = getRouteParams(model);
    const [open, setOpen] = useState(false);

    const { delete: destroy, processing } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(
            route(`admin.${model}.destroy`, {
                [routeParam]: (row.original as any).id,
            }),
            {
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
                    >
                        <MoreHorizontal />
                        <span className="sr-only">メニューを開く</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <Link
                            href={route(`admin.${model}.show`, {
                                [routeParam]: (row.original as any).id,
                            })}
                        >
                            編集
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        削除
                        <DropdownMenuShortcut>
                            <TrashIcon className="text-red-500" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle>パスワードの確認</DialogTitle>
                    <DialogDescription>
                        この操作を続けるにはパスワードを入力してください。
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">キャンセル</Button>
                        </DialogClose>

                        <form onSubmit={submit}>
                            <Button
                                disabled={processing}
                                className="font-bold w-20"
                            >
                                {processing ? (
                                    <LoaderCircle className="text-white animate-spin" />
                                ) : (
                                    "確認"
                                )}
                            </Button>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
