import { PublicHeader, Container } from "@/components/public";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { getLocaleLink } from "@/helper/utils";
import { usePackageCartStore } from "@/stores/package-cart.storage";
import { CircleUser, ArrowRight } from "lucide-react";

import { User } from "@/types";

export default function CustomerInfo({ user }: { user: User }) {
    const { t } = useTranslation("common", { useSuspense: false });
    const { packageCart } = usePackageCartStore();
    const firstItemKey = packageCart[0]?.packageKey;
    // const [showSignIn, setShowSignIn] = useState<boolean>(false);
    const planLabel = t(`breadcrumbs.${firstItemKey}`);
    console.log(user);

    const breadcrumbs = [
        {
            title: t("breadcrumbs.home"),
            href: getLocaleLink("/"),
        },
        {
            title: t("headers.contact_us"),
            href: getLocaleLink("/contact-us"),
        },
        ...(planLabel ? [{ title: planLabel }] : []),
        {
            title: t("customer_info.title"),
        },
    ];

    const infoFields = [
        {
            label: t("customer_info.customer_id"),
            value: user?.id,
        },
        {
            label: t("customer_info.company_name"),
            value: user?.company_name,
        },
        {
            label: t("customer_info.user_name"),
            value: user?.name,
        },
        {
            label: t("customer_info.email_addr"),
            value: user?.email,
        },
        {
            label: t("customer_info.phone_number"),
            value: user?.phone,
        },
        {
            label: t("customer_info.address"),
            value: user?.address,
        },
        {
            label: t("customer_info.postal_code"),
            value: user?.postal_code,
        },
    ];

    return (
        <>
            <Head title={"Customer Information"} />
            <PublicHeader />
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
                                    <span
                                        className={
                                            index === breadcrumbs.length - 1
                                                ? "text-brand font-medium"
                                                : ""
                                        }
                                    >
                                        {breadcrumb.title}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
            <Container className="mt-10 rounded-lg border border-[#E4E7E9] p-5">
                <div className="flex flex-col space-y-6">
                    <span className="text-[19px] leading-[24px] font-semibold md:text-lg">
                        {t("customer_info.acc_info")}
                    </span>

                    <div className="grid grid-cols-1 divide-y divide-[#E4E7E9]">
                        {/* Hàng chứa Icon và Tên + Nút thay đổi */}
                        <div className="grid grid-cols-[170px_1fr] pb-3">
                            <div className="flex space-x-3">
                                <CircleUser className="text-brand h-10 w-10" />
                                <span className="text-brand flex items-center font-medium">
                                    {user?.name}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Link
                                    href={getLocaleLink("/")}
                                    className="text-[#118ACB] hover:underline"
                                >
                                    {t("customer_info.change_user_info")}
                                </Link>
                            </div>
                        </div>

                        {infoFields.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-[170px_1fr] py-3"
                            >
                                <div className="text-[14px] text-black">
                                    {item.label}
                                </div>
                                <div className="text-[14px] text-[#191C1F]">
                                    {item.value || "-"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
            <Container className="mt-8 flex justify-end px-0">
                <Link
                    href={getLocaleLink("/my-page/package-checkout")}
                    className="group flex w-1/3 cursor-pointer items-center justify-center gap-3 rounded-sm bg-[#D74B3A] py-4 font-black tracking-[1px] text-white uppercase shadow-lg transition-colors hover:bg-[#c0392b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {t("package_cart.next_step")}
                    <ArrowRight className="h-5 w-5" />
                </Link>
            </Container>
        </>
    );
}
