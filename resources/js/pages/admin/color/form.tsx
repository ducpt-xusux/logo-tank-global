import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Field, Color } from "@/types";
import { FormEventHandler } from "react";
import { LoaderCircle } from "lucide-react";
import { goBack } from "@/lib/utils";
import {
    AdminLayout,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    FormField,
    notify,
} from "@/components";
const breadcrumbs = [
    {
        title: "ジャンルを変更",
        href: "/admin/color",
    },
];
interface ColorFormProps {
    item: Color;
}
const basicFields: Field[] = [
    {
        name: "name",
        label: "ジャンルを",
    },
    {
        name: "name_vi",
        label: "Thể Loại",
    },
    {
        name: "name_en",
        label: "Genre",
    },
];
export default function ColorForm({ item }: ColorFormProps) {
    const { data, setData, patch, errors, processing, post } = useForm<Color>(
        item ?? ({} as Color),
    );
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (item) {
            patch(route("admin.color.update", { color: item }), {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success("更新完了しました。");
                },
            });
        } else {
            post(route("admin.color.store"), {
                preserveScroll: true,
            });
        }
    };
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                {/*<Head title="ジャンルを変更" />*/}
                <Head title={item ? "ジャンルを変更" : "them moi"} />
                <div className="flex-1 flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-10 md:flex">
                    <form
                        onSubmit={submit}
                        className="flex flex-col items-center gap-5 sm:flex-row sm:items-start"
                    >
                        <Card className="w-full max-w-2xl">
                            <CardHeader>
                                <CardTitle>ユーザー情報</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                {basicFields.map((field) => {
                                    return (
                                        <FormField
                                            field={field}
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                            key={field.name}
                                        />
                                    );
                                })}
                            </CardContent>
                        </Card>
                        <div className="sticky top-5 flex flex-col gap-3">
                            <Button
                                size="lg"
                                className="flex w-40 items-center justify-center font-bold"
                                type="submit"
                            >
                                {processing ? (
                                    <LoaderCircle className="animate-spin" />
                                ) : (
                                    "保存"
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-40"
                                type="button"
                                onClick={goBack}
                            >
                                前のページに戻る
                            </Button>
                        </div>
                    </form>
                </div>
            </AdminLayout>
        </>
    );
}
