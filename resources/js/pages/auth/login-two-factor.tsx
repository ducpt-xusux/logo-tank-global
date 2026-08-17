import React, {FormEventHandler} from 'react';
import { Head, useForm } from '@inertiajs/react';
import {Toaster} from "sonner";
import {LoaderCircle} from "lucide-react";
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    notify
} from "@/components";

export default function LoginTwoFactor () {
    const { setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        code: ''
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.login.persist'), {
            onFinish: () => {
                reset('code')
                clearErrors();
            },
            onError: (e) => {
                notify.error(e.email ?? "ワンタイムパスワードに誤りがあります");
            }
        })
    }

    return <>
        <Toaster />
        <Head title="ログイン" />
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>ワンタイムパスワード</CardTitle>
                            <CardDescription>
                                携帯電話に送信されたワンタイムパスワードを入力してください。
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <InputOTP maxLength={6} onChange={v => setData('code', v)}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0}/>
                                                <InputOTPSlot index={1}/>
                                                <InputOTPSlot index={2}/>
                                                <InputOTPSlot index={3}/>
                                                <InputOTPSlot index={4}/>
                                                <InputOTPSlot index={5}/>
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button type="submit" className="w-full">
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
