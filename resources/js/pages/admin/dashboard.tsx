import { Head, usePage, router } from "@inertiajs/react";
import { AdminLayout } from "@/components";
import Filter from "@/pages/admin/common/filter";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pagination } from "@/components/pagination";
import { Logo } from "@/helper/type";
import { LogoTank } from "@/components"; 
import { FilterParams } from "@/pages/admin/common/filter";
import nprogress from "nprogress";
const breadcrumbs = [
    {
        title: "Dashboard",
        href: "/admin",
    },
];

const defaultParams: any = {
    keyword: undefined,
    state: undefined,
    designers: [],
};
export default function Dashboard() {
    const [parameters, setParameters] = useState<FilterParams>(defaultParams);
    const [loading, setLoading] = useState(false);

    const logoList = useRef<HTMLDivElement>(null);

    const {
        logos: initialLogos,
        designers,
        filters: urlFilters,
    } = usePage().props as any;
    const [logos, setLogos] = useState(initialLogos?.data || []);

    useEffect(() => {
        setLogos(initialLogos?.data || []);
    }, [initialLogos]);

    // Initialize filters from URL
    useEffect(() => {
        if (urlFilters) {
            setParameters({
                keyword: urlFilters.keyword,
                state: urlFilters.state,
                designers: urlFilters.designers || [],
            });
        }
        if (window.location.search) {
            window.location.href = route("admin.dashboard");
        }
    }, []);
    const handleFilterChange = (newFilters: FilterParams) => {
        setLoading(true);
        nprogress.start();
        router.get(
            route("admin.dashboard"),
            {
                page: 1,
                ...(newFilters.keyword && { keyword: newFilters.keyword }),
                ...(newFilters.state && { state: newFilters.state }),
                ...(newFilters.designers?.length && {
                    designers: newFilters.designers.join(","),
                }),
            },
            {
                preserveState: true,
                replace: false,
                onFinish: () => {
                    setLoading(false);
                    nprogress.done();
                    logoList.current?.scrollTo(0, 0);
                },
            },
        );
    };
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div
                className="min-h-screen-header h-screen-header overflow-auto"
                ref={logoList}
            >
                <Head title="Dashboard" />
                <div className="grid grid-cols-5 px-3 py-4 2xl:grid-cols-7">
                    <div>
                        <Filter
                            filters={parameters}
                            onChange={handleFilterChange}
                            designerOptions={designers}
                        />
                    </div>
                    <div className="col-span-4 2xl:col-span-6">
                        <div className="relative grid grid-cols-4 gap-4 pb-2 2xl:grid-cols-6">
                            {loading && (
                                <div className="min-h-screen-filter absolute z-100 h-full w-full bg-gray-200 opacity-70">
                                    <div className="sticky top-20 flex justify-center py-4">
                                        <div className="h-16 w-16 animate-spin rounded-full border-b border-solid border-indigo-500 border-t-transparent shadow-md" />
                                    </div>
                                </div>
                            )}
                            {logos.length > 0 &&
                                logos?.map((logo: Logo) => (
                                    <LogoTank logo={logo} key={logo.logo_id} />
                                ))}
                            {!loading && logos.length === 0 && (
                                <div className="col-span-5 text-center 2xl:col-span-6">
                                    データを見つかりません。
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
