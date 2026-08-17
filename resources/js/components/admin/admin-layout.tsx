import { BreadcrumbItemProps, SharedData } from "@/types";
import React, { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { Toaster } from "sonner";
import {
    AppSidebar,
    Breadcrumbs,
    ConfirmPassword,
    Separator,
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdminLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItemProps[];
}

export function AdminLayout({ children, breadcrumbs = [] }: AdminLayoutProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    useEffect(() => {
        const appElement = document.getElementById("app");
        if (appElement) delete appElement.dataset.page;
    }, []);

    return (
        <>
            <Toaster />
            <SidebarProvider defaultOpen={isOpen}>
                <AppSidebar />
                <SidebarInset className="h-[100dvh] overflow-hidden">
                    <header
                        className={cn(
                            "flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear",
                            "z-50 shadow-md group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
                        )}
                    >
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1 cursor-pointer" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    </header>
                    <div className="flex flex-col overflow-auto">
                        {children}
                    </div>
                </SidebarInset>
                <ConfirmPassword />
            </SidebarProvider>
        </>
    );
}
