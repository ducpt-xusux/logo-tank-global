import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Field, LogoZip } from "@/types";
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
        href: "/admin/logo-zip",
    },
];
interface LogoZipFormProps {
    item: LogoZip;
}
const basicFields: Field[] = [
    {
        name: "logo_id",
        label: "シンボルコード",
    },
    {
        name: "file",
        type: "file",
        label: "ファイルzipをアップロードする",
        accept: "zip, rar",
    },
];
export default function LogoZipForm({ item }: LogoZipFormProps) {
    const { data, setData, patch, errors, processing, post } = useForm({
        logo_id: item?.logo_id || "",
        url_zip: null,
        _method: item ? "PUT" : "POST",
    });
    const submit: FormEventHandler = (e: any) => {
        e.preventDefault();
        if (item) {
            post(route("admin.logo-zip.update", item.id), {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success("更新完了しました。");
                },
            });
        } else {
            post(route("admin.logo-zip.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success("登録完了しました。");
                },
            });
        }
    };
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title="zip情報" />
                <div className="flex-1 flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-10 md:flex">
                    <form
                        onSubmit={submit}
                        className="flex flex-col sm:flex-row items-center sm:items-start gap-5"
                    >
                        <Card className="w-full max-w-2xl">
                            <CardHeader>
                                <CardTitle>zip情報</CardTitle>
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
                                className="flex items-center justify-center w-40 font-bold"
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
