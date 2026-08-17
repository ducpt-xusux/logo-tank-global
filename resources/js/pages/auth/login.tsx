import React, {FormEventHandler, useState} from 'react';
import {Link, router} from '@inertiajs/react'
import { Head, useForm, usePage } from '@inertiajs/react';
import {Toaster} from "sonner";
import {EyeIcon, EyeOffIcon, LoaderCircle} from "lucide-react";
import { SharedData } from "@/types";
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    notify,
    Switch
} from "@/components";

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login () {
    const { locale = "en" } = usePage<SharedData>().props;
    const { setData, post, processing, errors, reset, setError, clearErrors } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [passwordType, setPasswordType] = useState('password');

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login.store'), {
            onFinish: () => {
                reset('password')
                clearErrors();
            },
            onError: (e) => {
                notify.error(e.email ?? "メールアドレス、またはパスワードに誤りがあります");
            }
        })
    }

    const changePasswordType = () => {
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    }

    return <>
        <Toaster />
        <Head title="ログイン" />
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>アカウントにログイン</CardTitle>
                            <CardDescription>
                                メールアドレスを入力してログイン
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">メールアドレス</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            name="email"
                                            required
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="password">パスワード</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={passwordType}
                                                name="password"
                                                required
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                            <span
                                                className='absolute right-2 top-1.5 cursor-pointer px-0.5'
                                                onClick={changePasswordType}
                                            >
                                                {passwordType === 'password' ?
                                                    <EyeOffIcon />:
                                                    <EyeIcon />
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="remember" onCheckedChange={r => setData('remember', r)} />
                                        <Label htmlFor="remember" className="cursor-pointer">ログイン状態を保持する</Label>
                                    </div>
                                    <div className="flex items-center">
                                        <Link
                                            href={route('forgot-password', { locale })}
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            tabIndex={-1}
                                        >
                                            パスワードをお忘れですか？
                                        </Link>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            {processing ? <LoaderCircle className="animate-spin" /> : 'ログイン'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </>
}
