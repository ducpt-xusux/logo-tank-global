import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Field, User } from "@/types";
import { FormEventHandler } from "react";
import { LoaderCircle } from "lucide-react";
import { getRoleOptions, goBack } from "@/lib/utils";
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
        title: "ユーザー",
        href: "/admin/users",
    },
];

interface UserFormProps {
    item: User;
}

const basicFields: Field[] = [
    {
        name: "name",
        label: "ユーザー名",
    },
    {
        name: "email",
        label: "メールアドレス",
    },
    {
        name: "password",
        label: "パスワード",
        type: "password",
    },
    {
        name: "role",
        label: "役割",
        type: "select",
        options: getRoleOptions(),
    },
];

export default function UserForm({ item }: UserFormProps) {
    const { data, setData, patch, errors, processing, post } = useForm<
        Required<User>
    >(item ?? ({} as Required<User>));
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (item) {
            patch(route("admin.user.update", { user: item }), {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success("更新完了しました。");
                },
            });
        } else {
            post(route("admin.user.store"), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="ユーザー" />
            <div className="flex-1 flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-10 md:flex">
                <form
                    onSubmit={submit}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-5"
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
    );
}
