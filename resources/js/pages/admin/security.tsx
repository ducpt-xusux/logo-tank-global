import React, {FormEventHandler, useState} from "react";
import {Head, useForm} from "@inertiajs/react";
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
    notify, TwoFactor
} from "@/components";
import {route} from "ziggy-js";
import {EyeIcon, EyeOffIcon, LoaderCircle} from "lucide-react";


const breadcrumbs = [
    {
        title: 'プロフィール',
        href: '/admin/profile',
    },
];

type PasswordForm = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

export default function AdminProfile() {
    const [passwordType, setPasswordType] = useState({
        old: 'password',
        new: 'password',
        confirm: 'password',
    })

    const { data, setData, put, errors, processing, reset, clearErrors } = useForm<Required<PasswordForm>>({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('user-password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                });
                clearErrors();
                notify.success('パスワードが正常に更新されました。');
            },
        });
    }

    const changePasswordType = (type: number) => {
        switch(type) {
            case 2:
                setPasswordType({
                    ...passwordType,
                    new: passwordType.new === 'password' ? 'text' : 'password',
                });
                break;
            case 3:
                setPasswordType({
                    ...passwordType,
                    confirm: passwordType.confirm === 'password' ? 'text' : 'password',
                })
                break;
            default:
                setPasswordType({
                    ...passwordType,
                    old: passwordType.old === 'password' ? 'text' : 'password',
                });
        }
    }

    return <AdminLayout breadcrumbs={breadcrumbs}>
        <Head title='パスワードと認証' />
        <div className="h-full flex-1 flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-10 md:flex">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">パスワードと認証</h2>
            </div>
            <div className="flex gap-5 flex-wrap items-start">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>パスワードを変更</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">現在のパスワード</Label>
                                <div className="relative max-w-sm">
                                    <Input
                                        id="current_password"
                                        type={passwordType.old}
                                        name="current_password"
                                        value={data.current_password}
                                        required
                                        onChange={(e) => setData('current_password', e.target.value)}
                                    />
                                    <span
                                        className='absolute right-2 top-1 cursor-pointer p-1'
                                        onClick={() => changePasswordType(1)}
                                    >
                                        {passwordType.old === 'password' ?
                                            <EyeOffIcon className="size-5" /> :
                                            <EyeIcon className="size-5" />
                                        }
                                    </span>
                                </div>
                                <InputError message={errors.current_password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">新しいパスワード</Label>
                                <div className="relative max-w-sm">
                                    <Input
                                        id="password"
                                        type={passwordType.new}
                                        name="password"
                                        value={data.password}
                                        required
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <span
                                        className='absolute right-2 top-1 cursor-pointer p-1'
                                        onClick={() => changePasswordType(2)}
                                    >
                                        {passwordType.new === 'password' ?
                                            <EyeOffIcon className="size-5" /> :
                                            <EyeIcon className="size-5" />
                                        }
                                    </span>
                                </div>
                                <InputError message={errors.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">新しいパスワードの確認</Label>
                                <div className="relative max-w-sm">
                                    <Input
                                        id="password_confirmation"
                                        type={passwordType.confirm}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        required
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <span
                                        className='absolute right-2 top-1 cursor-pointer p-1'
                                        onClick={() => changePasswordType(3)}
                                    >
                                        {passwordType.confirm === 'password' ?
                                            <EyeOffIcon className="size-5" /> :
                                            <EyeIcon className="size-5" />
                                        }
                                    </span>
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing} className="font-bold w-28">
                                    { processing ? <LoaderCircle className="animate-spin" />  : '保存' }
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <TwoFactor />
            </div>
        </div>
    </AdminLayout>
}
