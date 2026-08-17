import {type LucideIcon} from "lucide-react"

import {
    SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components"
import {Link, usePage} from "@inertiajs/react";
import {cn} from "@/lib/utils";

interface NavItemProps {
    title: string
    url: string
    isActive?: boolean
    items: {
        title: string
        url: string
        icon?: LucideIcon
    }[]
}

function isPathActive(basePath: string, currentPath: string): boolean {
    const cleanBase = new URL(basePath).pathname.replace(/^\/|\/$/g, '');
    const cleanCurrent = currentPath.replace(/^\/|\/$/g, '');

    const baseSegments = cleanBase.split('/')
    const currentSegments = cleanCurrent.split('/')

    if (baseSegments.length > currentSegments.length) return false;
    if (baseSegments.length === currentSegments.length) return cleanBase === cleanCurrent

    return currentSegments[1] === baseSegments[1]
}

export function NavMain({items}: {items: NavItemProps[]}) {
    const { url } = usePage();
    const pathname = url.split('?')[0]
    return (
        items.map((item) => (
            <SidebarGroup key={item.title}>
                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {item.items.map((item) => {
                            const isActive = isPathActive(item.url, pathname);
                            return <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <Link href={item.url} className={cn(
                                        isActive && 'text-teal-600'
                                    )}>
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        })}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        ))
    )
}
