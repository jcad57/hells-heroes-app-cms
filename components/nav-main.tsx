"use client";

import { usePathname } from "next/navigation";
import { type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

function isNavItemActive(pathname: string, itemUrl: string): boolean {
  if (pathname === itemUrl) return true;
  // Active when current path is under this nav item (e.g. /dashboard/bands/123)
  if (pathname.startsWith(itemUrl + "/")) return true;
  return false;
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isNavItemActive(pathname ?? "", item.url);
            return (
              <SidebarMenuItem key={item.title} href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  className={isActive ? "bg-muted" : undefined}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
