import { FormEventHandler } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { LoaderCircle } from "lucide-react";
import { SharedData } from "@/types";
import { AppLayout, Container } from "@/components/public";
import { Button, Input, Label, notify } from "@/components";
import { getLocaleLink } from "@/helper/utils";

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { t } = useTranslation("common", { useSuspense: false });
    const { locale = "en" } = usePage<SharedData>().props;
    const breadcrumbs = [
        {
            title: t("breadcrumbs.home") || "Home",
            href: getLocaleLink("/"),
        },
        {
            title: t("reset_password.title"),
        },
    ];
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.update", { locale }), {
            onSuccess: () => {
                notify.success(
                    t("reset_password.success") ||
                        "パスワードが再設定されました",
                );
            },
            onError: (e) => {
                notify.error(
                    e.email || e.password || e.token || t("messages.error"),
                );
            },
        });
    };

    return (
        <AppLayout>
            <Head title={t("reset_password.head_title")} />

            {/* Breadcrumb */}
            <div className="flex w-full items-center bg-[#F2F4F5] lg:h-[72px]">
                <Container className="w-full text-[12px] text-[#5F6C72] lg:text-[14px]">
                    <div className="flex items-center gap-2">
                        {breadcrumbs.map((breadcrumb, index) => (
                            <div
                                key={`${breadcrumb.title}-${index}`}
                                className="flex items-center gap-2"
                            >
                                {index > 0 && <span>{">"}</span>}
                                {breadcrumb.href ? (
                                    <Link
                                        href={breadcrumb.href}
                                        className="hover:text-brand transition-colors"
                                    >
                                        {breadcrumb.title}
                                    </Link>
                                ) : (
                                    <span className="text-brand font-medium">
                                        {breadcrumb.title}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            <Container className="flex flex-col items-center py-16">
                <h1 className="mb-10 text-xl font-bold">
                    {t("reset_password.title")}
                </h1>

                <div className="mb-8 space-y-1 text-center text-[13px] text-gray-800">
                    <p>{t("reset_password.description")}</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-[400px] space-y-6"
                >
                    <input
                        type="hidden"
                        aria-label={t("reset_password.email")}
                        value={data.email}
                        readOnly
                    />

                    <div className="space-y-2">
                        <Label
                            htmlFor="new-password"
                            className="text-sm font-normal text-gray-700"
                        >
                            {t("reset_password.new_password")}
                        </Label>
                        <Input
                            id="new-password"
                            type="password"
                            placeholder="********"
                            required
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="bg-gray-50 border-gray-200 focus-visible:ring-[#FF8D26]"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="confirm-password"
                            className="text-sm font-normal text-gray-700"
                        >
                            {t("reset_password.confirm_password")}
                        </Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder="********"
                            required
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData(
                                    "password_confirmation",
                                    e.target.value,
                                )
                            }
                            className="bg-gray-50 border-gray-200 focus-visible:ring-[#FF8D26]"
                        />
                    </div>

                    <div className="flex justify-center pt-2">
                        <Button
                            type="submit"
                            className="h-10 w-48 rounded-md bg-[#E65C00] text-white hover:bg-[#CC5200]"
                            disabled={processing}
                        >
                            {processing ? (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {t("reset_password.submit")}
                        </Button>
                    </div>
                </form>
            </Container>
        </AppLayout>
    );
}
