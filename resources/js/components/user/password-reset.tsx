import { FormEventHandler, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { LoaderCircle } from "lucide-react";
import { SharedData } from "@/types";
import {
    Button,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    notify,
} from "@/components";

interface PasswordResetProps {
    onBack: () => void;
    onSuccess: () => void;
}

const supportedLocales = ["en", "ja", "vi"] as const;

const getCurrentRouteLocale = (fallbackLocale: string) => {
    const pathLocale = window.location.pathname.split("/")[1];

    return supportedLocales.includes(
        pathLocale as (typeof supportedLocales)[number],
    )
        ? pathLocale
        : fallbackLocale;
};

const PasswordReset = ({ onBack, onSuccess }: PasswordResetProps) => {
    const { t } = useTranslation("common", { useSuspense: false });
    const { locale = "en" } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, transform } = useForm({
        email: "",
    });
    const [showNotification, setShowNotification] = useState(false);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        const currentLocale = getCurrentRouteLocale(locale);

        transform((data) => ({
            ...data,
            locale: currentLocale,
        }));

        post(
            route("password.email", { locale: currentLocale }),
            {
                onSuccess: () => {
                    setShowNotification(true);
                },
                onError: (e) => {
                    notify.error(e.email || t("messages.error"));
                },
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <DialogHeader>
                <div className="mt-2 flex items-center justify-between">
                    <DialogTitle className="text-xl">
                        {t("sign_in.forgot_title")}
                    </DialogTitle>
                </div>
            </DialogHeader>
            <div className="pt-4">
                {!showNotification ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-sm text-gray-600">
                            {t("sign_in.forgot_attention")}
                        </p>
                        <div className="space-y-2">
                            <Label htmlFor="forgot-email">
                                {t("sign_in.email")}
                            </Label>
                            <Input
                                id="forgot-email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button
                                type="submit"
                                className="w-56 bg-orange-600 text-white hover:bg-orange-700"
                                disabled={processing}
                            >
                                {processing ? (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                {t("sign_in.btn_continue")}
                            </Button>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                onClick={onBack}
                                className="text-sm text-gray-500 hover:underline"
                            >
                                {t("sign_in.back_to_sign_in")}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4 py-4 text-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            {t("sign_in.check_mail_alert")}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {t("sign_in.check_mail_attention_1")}
                            {data.email}
                            {t("sign_in.check_mail_attention_2")}
                        </p>
                        <div className="flex justify-center pt-4">
                            <Button
                                type="button"
                                onClick={onSuccess}
                                className="bg-orange-600 text-white hover:bg-orange-700"
                            >
                                {t("sign_in.close")}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PasswordReset;
