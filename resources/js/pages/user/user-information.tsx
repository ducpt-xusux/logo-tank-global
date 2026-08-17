import { PublicHeader, Container, PublicFooter } from "@/components/public";
import {
    type UserInformation,
    UserInformationTable,
} from "@/components/user/user-information-table";
import { Head, Link, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { SharedData } from "@/types";
import { getLocaleLink } from "@/helper/utils";

export default function UserInformation() {
    const { t } = useTranslation("common", { useSuspense: false });
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user as UserInformation | null;

    const breadcrumbs = [
        {
            title: t("breadcrumbs.home") || "Home",
            href: getLocaleLink("/"),
        },
        {
            title: t("breadcrumbs.my_account") || "My Account",
        },
    ];
    return (
        <div className="min-h-screen bg-white">
            <Head title={t("title_tag.user_information")} />

            <PublicHeader />

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
            <Container className="mt-8 mb-20 w-full max-w-[900px]">
                <div className="">
                    <h2 className="pl-4 text-lg md:pl-10">
                        {t("user_information.title", "User Information")}
                    </h2>
                    <hr className="mt-2 border-t border-gray-300" />
                    <div className="mt-8">
                        <UserInformationTable user={user} />
                    </div>
                </div>
            </Container>
            <PublicFooter showOrangeBanner={false} />
        </div>
    );
}
