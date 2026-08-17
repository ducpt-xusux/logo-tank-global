import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    InputError,
    Button, Label, Input,
} from "@/components";
import React, {FormEventHandler, useState} from "react";
import {useSystemStore} from "@/stores";
import {useForm} from "@inertiajs/react";
import {authService} from "@/services";
import {EyeIcon, EyeOffIcon, LoaderCircle} from "lucide-react";

export function ConfirmPassword() {
    const { openConfirmPassword, setOpenConfirmPassword } = useSystemStore();
    const [passwordType, setPasswordType] = useState('password');
    const [loading, setLoading] = useState(false);
    const { data, setData, errors, setError, clearErrors } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        authService.confirmPassword({password: data.password}).then(() => {
            setOpenConfirmPassword(false);
        }).catch(err => {
            setError(err.errors)
        }).then(() => {
            setLoading(false);
        })
    }

    const changePasswordType = () => {
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    }

    const onOpenChange = (status: boolean) => {
        setOpenConfirmPassword(status);
        if (!status) {
            setData({password: ''});
            clearErrors()
        }
    }

    return (
        <Dialog open={openConfirmPassword} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>パスワードの確認</DialogTitle>
                <DialogDescription>
                    この操作を続けるにはパスワードを入力してください。
                </DialogDescription>
                <form className="space-y-6" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm_password" className="sr-only">
                            パスワード
                        </Label>

                        <div className="relative">
                            <Input
                                id="confirm_password"
                                type={passwordType}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="パスワード"
                                autoComplete="current-password"
                            />
                            <span
                                className='absolute right-2 top-1 cursor-pointer p-1'
                                onClick={changePasswordType}
                            >
                                {passwordType === 'password' ?
                                    <EyeOffIcon className="size-5" /> :
                                    <EyeIcon className="size-5" />
                                }
                            </span>
                        </div>

                        <InputError message={errors.password}/>
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">
                                キャンセル
                            </Button>
                        </DialogClose>

                        <Button disabled={loading || data.password.trim() === ''} className="font-bold w-20">
                            { loading ? <LoaderCircle className="text-white animate-spin" /> : '確認' }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
