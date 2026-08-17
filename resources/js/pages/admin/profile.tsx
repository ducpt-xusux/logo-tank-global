import React, {FormEventHandler, useState} from "react";
import {Head, useForm, usePage} from "@inertiajs/react";
import {
    AdminLayout,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    InputError,
    Label,
    notify
} from "@/components";
import {SharedData} from "@/types";
import {route} from "ziggy-js";
import {LoaderCircle} from "lucide-react";

const breadcrumbs = [
    {
        title: 'プロフィール',
        href: '/admin/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
};

export default function AdminProfile() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user!;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('admin.profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                notify.success('プロフィールが更新されました。');
            }
        });
    }

    return <AdminLayout breadcrumbs={breadcrumbs}>
        <Head title='プロフィール' />
        <div className="h-full flex-1 flex-col space-y-4 p-2 sm:px-6 sm:pt-2 sm:pb-10 md:flex">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">プロフィール</h2>
            </div>

            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">ユーザー名</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">メールアドレス</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing} className="font-bold w-20">
                                { processing ? <LoaderCircle /> : '保存'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
}
