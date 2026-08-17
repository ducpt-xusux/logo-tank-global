import {
    ChevronsUpDown,
    LogOut, ShieldUserIcon,
    UserRoundPen,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, UserInfo,
    useSidebar,
} from "@/components"
import {SharedData} from "@/types";
import {Link, router, usePage} from "@inertiajs/react";
import {cn} from "@/lib/utils";
import {route} from "ziggy-js";

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user!;
    const {isMobile} = useSidebar();

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(
                                "data-[state=open]:bg-neutral-100 data-[state=open]:text-sidebar-accent-foreground",
                                'cursor-pointer'
                            )}
                        >
                            <UserInfo user={user} showEmail />
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <UserInfo user={user} showEmail />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link href={route('admin.profile')}>
                                    <UserRoundPen/>
                                    プロフィール
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link href={route('admin.security')}>
                                    <ShieldUserIcon/>
                                    パスワードと認証
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                            <LogOut/>
                            ログアウト
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
