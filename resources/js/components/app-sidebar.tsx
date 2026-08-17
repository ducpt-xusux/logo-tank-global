import * as React from "react";
import {
    GalleryVerticalEnd,
    LayoutGrid,
    NewspaperIcon,
    Users,
    PaintbrushVertical,
    House,
    NotebookPen,
    Rows4,
    ClipboardList,
    FolderClosed,
    FlaskConical,
    Globe,
    KeyRound,
} from "lucide-react";
import {
    NavMain,
    NavUser,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
    SidebarRail,
} from "@/components";

import { cn } from "@/lib/utils";
import { NavItemProps } from "@/types";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const navMain: NavItemProps[] = React.useMemo(
        () => [
            {
                title: "共通",
                url: "#",
                isActive: true,
                items: [
                    {
                        title: "ダッシュボード",
                        url: route().has("admin.dashboard") ? route("admin.dashboard") : "#",
                        icon: House,
                    },
                    {
                        title: "ログ",
                        url: route().has("admin.log.index") ? route("admin.log.index") : "#",
                        icon: NotebookPen,
                    },
                    {
                        title: "注文管理",
                        url: route().has("admin.order.index") ? route("admin.order.index") : "#",
                        icon: ClipboardList,
                    },
                    {
                        title: "zipファイル",
                        url: route().has("admin.logo-zip.index") ? route("admin.logo-zip.index") : "#",
                        icon: FolderClosed,
                    },
                ],
            },
            {
                title: "マスター",
                url: "#",
                items: [
                    {
                        title: "ユーザー",
                        url: route().has("admin.user.index") ? route("admin.user.index") : "#",
                        icon: Users,
                    },
                    {
                        title: "ジャンル",
                        url: route().has("admin.color.index") ? route("admin.color.index") : "#",
                        icon: PaintbrushVertical,
                    },
                    {
                        title: "業種",
                        url: route().has("admin.industry.index") ? route("admin.industry.index") : "#",
                        icon: Rows4,
                    },
                    {
                        title: "テイスト",
                        url: route().has("admin.taste.index") ? route("admin.taste.index") : "#",
                        icon: FlaskConical,
                    },
                    {
                        title: "アドレス検索",
                        url: route().has("admin.address-search.index") ? route("admin.address-search.index") : "#",
                        icon: Globe,
                    },
                    {
                        title: "キーワード",
                        url: route().has("admin.keyword.index") ? route("admin.keyword.index") : "#",
                        icon: KeyRound,
                    },
                ],
            },
        ],
        [],
    );

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-neutral-100 data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div
                        className={cn(
                            "bg-teal-600 text-sidebar-primary-foreground flex aspect-square size-8 items-center",
                            "justify-center rounded-lg",
                        )}
                    >
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                            ロゴ タンク
                        </span>
                    </div>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
