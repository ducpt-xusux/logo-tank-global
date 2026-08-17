import React, { FormEventHandler, useEffect, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { EyeIcon, EyeOffIcon, LoaderCircle } from "lucide-react";
import { Toaster } from "sonner";

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
    Switch,
} from "@/components";
import { SharedData } from "@/types";

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login() {
    const { flash } = usePage<SharedData>().props;
    const { data, setData, post, processing, reset, clearErrors } = useForm<
        Required<LoginForm>
    >({
        email: "",
        password: "",
        remember: true,
    });
    const [passwordType, setPasswordType] = useState("password");

    useEffect(() => {
        if (flash?.status) {
            notify.success(flash.status);
        } else if (flash?.success) {
            notify.success(flash.success);
        }

        if (flash?.error) {
            notify.error(flash.error);
        }
    }, [flash]);

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route("login.store"), {
            onFinish: () => {
                reset("password");
                clearErrors();
            },
            onError: (errors) => {
                notify.error(
                    errors.email ??
                        errors.password ??
                        "メールアドレス、またはパスワードに誤りがあります",
                );
            },
        });
    };

    const changePasswordType = () => {
        setPasswordType(passwordType === "password" ? "text" : "password");
    };

    return (
        <>
            <Toaster />
            <Head title="管理者ログイン" />
            <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle>管理者ログイン</CardTitle>
                            <CardDescription>
                                管理画面にアクセスするにはログインしてください
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">
                                            メールアドレス
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            name="email"
                                            required
                                            autoComplete="username"
                                            onChange={(event) =>
                                                setData(
                                                    "email",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="password">
                                            パスワード
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={passwordType}
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                onChange={(event) =>
                                                    setData(
                                                        "password",
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer px-0.5 text-slate-500"
                                                onClick={changePasswordType}
                                                aria-label={
                                                    passwordType === "password"
                                                        ? "パスワードを表示"
                                                        : "パスワードを非表示"
                                                }
                                            >
                                                {passwordType === "password" ? (
                                                    <EyeOffIcon className="h-5 w-5" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="remember"
                                            defaultChecked={data.remember}
                                            onCheckedChange={(remember) =>
                                                setData("remember", remember)
                                            }
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="cursor-pointer"
                                        >
                                            ログイン状態を保持する
                                        </Label>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <LoaderCircle className="animate-spin" />
                                        ) : (
                                            "ログイン"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
