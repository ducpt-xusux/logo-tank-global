import React, {useEffect, useState} from "react";
import {
    Accordion, AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle, Input, InputError, notify
} from "@/components";
import {LoaderCircle} from "lucide-react";
import {useForm, usePage} from "@inertiajs/react";
import {SharedData} from "@/types";
import {authService} from "@/services";
import {useSystemStore} from "@/stores";

export function TwoFactor() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user!;
    const { setOpenConfirmPassword } = useSystemStore();
    const [qrCode, setQrCode] = useState(null);
    const [enabled, setEnabled] = useState<Boolean>(!!user.two_factor_confirmed_at);
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, setData, setError, errors } = useForm({
        code: '',
        email_code: '',
    });

    const enable2FA = async () => {
        setLoading(true);
        try {
            const res = await authService.enable2FA();
            const svgResponse = await authService.getQRCode();
            setQrCode(svgResponse.svg);
            setActive(true);
        } catch (error) {
            setOpenConfirmPassword(true);
        }
        setLoading(false);
    }

    const confirmAppTwoFactor = () => {
        authService.confirmedTwoFactorAuthentication({ code: data.code }).then(res => {
            setEnabled(true);
            notify.success("二要素認証の設定が正常に完了しました。");
            setData('code', '');
        }).catch((err) => {
            setError('code', err.message)
        })
    }

    const confirmEmailTwoFactor = () => {
        authService.confirmEmailTwoFactorAuthentication({ code: data.email_code }).then(res => {
            setEnabled(true);
            notify.success("二要素認証の設定が正常に完了しました。");
            setData('email_code', '');
        }).catch(err => {
            setError('email_code', err.message);
        })
    }

    const disableTwoFactor = () => {
        authService.disable2FA().then(() => {
            setActive(false);
            setEnabled(false);
        }).catch(() => {
            setOpenConfirmPassword(true);
        })
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>二要素認証（2FA）</CardTitle>
            </CardHeader>
            <CardContent>
                {enabled ? (
                    <>
                        <p className="mb-2">2FAは有効です。</p>
                        <Button variant="destructive" className="font-bold" onClick={disableTwoFactor}>
                            二要素認証を無効にする
                        </Button>
                    </>
                ) : (active ? (
                    <div className="grid gap-6">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="email">
                                <AccordionTrigger className="font-bold">メール認証の設定</AccordionTrigger>
                                <AccordionContent className="grid gap-6">
                                    <p>
                                        サインイン時に、メールで認証コードを受け取ります。メールが受信できる有効なアドレスを使用してください。
                                    </p>
                                    <div className="flex gap-5">
                                        <Input
                                            id="code"
                                            type="text"
                                            name="code"
                                            value={data.email_code}
                                            onChange={(e) => setData('email_code', e.target.value)}
                                            placeholder="コード"
                                            className="w-40"
                                        />
                                        <SendCodeButton />
                                    </div>
                                    <InputError message={errors.email_code} />

                                    <Button onClick={confirmEmailTwoFactor}>
                                        メール認証を有効にする
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="app">
                                <AccordionTrigger className="font-bold">認証アプリの設定</AccordionTrigger>
                                <AccordionContent className="grid gap-6">
                                    <p>
                                        1Password、Authy、Microsoft Authenticator、Authenticator などの認証アプリやブラウザ拡張機能は、
                                        サインイン時に本人確認のために求められる**ワンタイムパスワード（OTP）を生成します。
                                        これらは、あなたの身元を確認するための第2の認証要素（二要素認証）**として使用されます。
                                    </p>
                                    <div className="flex justify-center py-5">
                                        {qrCode && <div dangerouslySetInnerHTML={{ __html: qrCode }} />}
                                    </div>

                                    <div className="grid gap-2">
                                        <Input
                                            id="code"
                                            type="text"
                                            name="code"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder="コード"
                                        />
                                        <InputError message={errors.code} />
                                    </div>

                                    <Button onClick={confirmAppTwoFactor}>
                                        二要素認証を確認する
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                ) : (
                    <Button onClick={enable2FA} className="w-56 flex justify-center items-center">
                        { loading ? <LoaderCircle className="animate-spin text-white" /> : '二要素認証を無効にする'}
                    </Button>
                ))}
            </CardContent>
        </Card>
    )
}

function SendCodeButton() {
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(0);

    useEffect(() => {
        let countdown: NodeJS.Timeout;

        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0 && isDisabled) {
            setIsDisabled(false);
        }

        return () => clearInterval(countdown);
    }, [timer, isDisabled]);

    const handleSendCode = () => {
        setIsDisabled(true);
        setTimer(60);
        authService.sendEmailTwoFactorAuthentication({}).then(() => {
            notify.success('二要素認証を確認するためのメールが送信されました。');
        })
    };

    return (
        <Button onClick={handleSendCode} disabled={isDisabled}>
            {isDisabled ? `${timer}秒後に再送信` : '認証コードを送信'}
        </Button>
    );
}
