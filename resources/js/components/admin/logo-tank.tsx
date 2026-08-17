import React, { useEffect, useState } from "react";
import { ListBoxOption, Logo } from "@/helper/type";
import { Link, usePage, router } from "@inertiajs/react";
import { Archive, FileText, FileSearch, Image } from "lucide-react";
import { ListBox } from "@/components/list-box";
import { getAdminRoute } from "@/helper/utils";
import { ImageWithLoading } from "@/components";

export const LogoTank = (props: { logo: Logo }) => {
    const adminRoute = getAdminRoute();

    const [logo, setLogo] = useState<Logo>(props.logo);
    const [hover, setHover] = useState(false);

    const { auth } = usePage().props as any;
    const user = auth?.user;
    const role = user?.role || "user";

    const getLogoName = () => {
        if (logo.logo_name.length >= 10) {
            return logo.logo_name.substring(0, 10) + "...";
        }
        return logo.logo_name;
    };

    const listState: ListBoxOption[] = [
        { id: 1, value: 0, name: "通常" },
        { id: 2, value: 2, name: "商談中" },
        { id: 3, value: 8, name: "売約済" },
        { id: 4, value: 7, name: "停止" },
    ];

    const changeState = (value: number) => {
        setLogo({ ...logo, state: value });
        router.post(
            route("admin.logo.update-state", logo.logo_id),
            { state: value },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const toDetail = (e: React.MouseEvent, tab?: string) => {
        e.preventDefault();
        e.stopPropagation();
        const url = tab
            ? `/${adminRoute}/logo/${logo.logo_id}/${tab}`
            : `/${adminRoute}/logo/${logo.logo_id}`;
        router.visit(url);
    };

    return (
        <div
            className="h-[370px] w-52 rounded border hover:shadow-lg"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div
                className="aspect-w-1 aspect-h-1 relative cursor-pointer"
                onClick={(e) => toDetail(e)}
            >
                <ImageWithLoading src={logo.src ?? ""} />
            </div>
            <div className="absolute w-52 px-2 py-8 text-center text-sm">
                <Link
                    href={`/${adminRoute}/logo/${logo.logo_id}`}
                    className="hover:underline"
                >
                    {logo.logo_id} {getLogoName()}
                </Link>
                {role === "admin" && (
                    <div className="">
                        <span className="leading-9">ステータス</span>
                        <ListBox
                            options={listState}
                            value={logo.state}
                            handleOnchange={changeState}
                            className="mr-8 ml-8 w-32"
                            small
                        />
                    </div>
                )}
                <p className="mt-1">制作者 ： {logo.reg_by}</p>
            </div>
        </div>
    );
};
