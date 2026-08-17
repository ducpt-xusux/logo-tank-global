import React, { FormEventHandler, useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { LoaderCircle, EyeIcon, EyeOffIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Button,
    notify,
} from "@/components";
import PasswordReset from "./password-reset";

interface SignType {
    open?: boolean;
    setOpenLogin?: (state: boolean) => void;
}

const loginSocial = (e: React.MouseEvent, provider: string) => {
    e.preventDefault();
    window.open(
        route("auth.social", { provider }),
        "SocialLoginPopup",
        "width=550,height=600",
    );
};

const SignIn = ({ open, setOpenLogin }: SignType) => {
    const { t } = useTranslation("common", { useSuspense: false });
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    useEffect(() => {
        if (open) {
            setIsForgotPassword(false);
        }
    }, [open]);

    const handleOpenChange = (isOpen: boolean) => {
        if (setOpenLogin) {
            setOpenLogin(isOpen);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[490px]">
                {!isForgotPassword ? (
                    <LoginForm
                        onForgotPassword={() => setIsForgotPassword(true)}
                        onSignUp={() => {
                            handleOpenChange(false);
                            // Normally we would open sign up here
                            router.visit(route("register"));
                        }}
                        onSuccess={() => handleOpenChange(false)}
                        t={t}
                    />
                ) : (
                    <PasswordReset
                        onBack={() => setIsForgotPassword(false)}
                        onSuccess={() => handleOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

const LoginForm = ({
    onForgotPassword,
    onSignUp,
    onSuccess,
    t,
}: {
    onForgotPassword: () => void;
    onSignUp: () => void;
    onSuccess: () => void;
    t: any;
}) => {
    const { setData, post, processing, errors, reset, clearErrors } = useForm({
        email: "",
        password: "",
        remember: false,
    });
    const [passwordType, setPasswordType] = useState("password");

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login.store"), {
            onSuccess: () => {
                reset("password");
                clearErrors();
                notify.success(
                    t("messages.login_success") || "Logged in successfully!",
                );
                onSuccess();
            },
            onError: (e) => {
                notify.error(
                    e.email ||
                        e.password ||
                        t("messages.invalid_input") ||
                        "Invalid login credentials.",
                );
            },
        });
    };

    return (
        <>
            <DialogHeader>
                <div className="mt-2 flex items-center justify-between">
                    <DialogTitle className="text-xl">
                        {t("sign_in.signIn")}
                    </DialogTitle>
                    <button
                        type="button"
                        onClick={onSignUp}
                        className="text-sm font-medium text-orange-600 hover:underline"
                    >
                        {t("sign_in.sign_up")}
                    </button>
                </div>
            </DialogHeader>
            <div className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("sign_in.email")}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            required
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            {t("sign_in.password")}
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={passwordType}
                                placeholder={t("sign_in.passPlaceholder")}
                                required
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() =>
                                    setPasswordType(
                                        passwordType === "password"
                                            ? "text"
                                            : "password",
                                    )
                                }
                            >
                                {passwordType === "password" ? (
                                    <EyeOffIcon className="h-4 w-4" />
                                ) : (
                                    <EyeIcon className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center pt-2">
                        <Button
                            type="submit"
                            className="w-56 bg-orange-600 text-white hover:bg-orange-700"
                            disabled={processing}
                        >
                            {processing ? (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            <span className="uppercase">
                                {t("sign_in.signIn")}
                            </span>
                        </Button>
                    </div>

                    <div className="mt-2 mb-4 flex justify-center">
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className="cursor-pointer text-sm text-orange-600 hover:underline"
                        >
                            {t("sign_in.forgot_pwd")}
                        </button>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase"></div>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        <a
                            onClick={(e) => loginSocial(e, "facebook")}
                            href="#"
                            className="flex w-56 items-center justify-center rounded-lg bg-slate-100 px-5 py-2.5 font-medium text-black hover:bg-slate-200 focus:ring-4 focus:ring-slate-300 focus:outline-none"
                        >
                            <img
                                src="/img/facebook.svg"
                                alt="Facebook"
                                className="mr-2 h-6 w-6"
                            />
                            <span className="text-[13px]">
                                {t("sign_in.sign_in_fb")}
                            </span>
                        </a>
                        <a
                            onClick={(e) => loginSocial(e, "google")}
                            href="#"
                            className="flex w-56 items-center justify-center rounded-lg bg-slate-100 px-5 py-2.5 font-medium text-black hover:bg-slate-200 focus:ring-4 focus:ring-slate-300 focus:outline-none"
                        >
                            <img
                                src="/img/gmail.png"
                                alt="Google"
                                className="mr-2 h-6 w-6"
                            />
                            <span className="text-[13px]">
                                {t("sign_in.sign_in_gg")}
                            </span>
                        </a>
                    </div>
                            
                    <div className="mt-6 text-center text-[10px] font-light md:text-xs">
                        {t("sign_in.agree_agreement")}{" "}
                        <a href="#" className="text-gray-600 underline">
                            {t("sign_in.agreement")}
                        </a>{" "}
                        {t("sign_in.and")}{" "}
                        <a href="#" className="text-gray-600 underline">
                            {t("sign_in.privacy_policy")}
                        </a>
                        .
                    </div>

                    <p className="mt-2 text-center text-sm font-light text-gray-600">
                        {t("sign_in.has_not_acc")}{" "}
                        <button
                            type="button"
                            onClick={onSignUp}
                            className="cursor-pointer font-medium text-orange-600 hover:underline"
                        >
                            {t("sign_in.click_here")}
                        </button>
                    </p>
                </form>
            </div>
        </>
    );
};

export default SignIn;
