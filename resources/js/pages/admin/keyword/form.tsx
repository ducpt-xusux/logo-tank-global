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
import { KeyWord } from "@/helper/type";
const breadcrumbs = [
    {
        title: "キーワードを変更",
        href: "/admin/keyword",
    },
];
interface KeywordFormProps {
    item: KeyWord;
}
const basicFields: Field[] = [
    {
        name: "name_ja",
        label: "日本語のキーワード",
    },
    {
        name: "name_vi",
        label: "ベトナム語キーワード",
    },
    {
        name: "name_en",
        label: "英語のキーワード",
    },
];
export default function KeywordForm({ item }: KeywordFormProps) {
    const initialValues: KeyWord = {
        name_ja: item?.keyword_language?.ja || item?.keyword || "",
        name_vi: item?.keyword_language?.vi || "",
        name_en: item?.keyword_language?.en || "",
    };

    const { data, setData, patch, errors, processing, post } =
        useForm<KeyWord>(initialValues);
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (item) {
            patch(route("admin.keyword.update", { keyword: item }), {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success("更新完了しました。");
                },
            });
        } else {
            post(route("admin.keyword.store"), {
                preserveScroll: true,
            });
        }
    };
    return (
        <>
            <AdminLayout breadcrumbs={breadcrumbs}>
                {/*<Head title="ジャンルを変更" />*/}
                <Head title={item ? "キーワードを変更" : "キーワードを追加"} />
                <div className="flex-1 flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-10 md:flex">
                    <form
                        onSubmit={submit}
                        className="flex flex-col sm:flex-row items-center sm:items-start gap-5"
                    >
                        <Card className="w-full max-w-2xl">
                            <CardHeader>
                                <CardTitle>キーワード情報</CardTitle>
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
