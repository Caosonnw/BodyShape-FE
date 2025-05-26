import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { ChevronRight } from 'lucide-react'
import React from 'react'

export default function RenderMenu({
  menuData,
  collapsibleDefaultOpen = false
}: {
  menuData: any[]
  collapsibleDefaultOpen?: boolean
}) {
  return (
    <SidebarMenu>
      {menuData.map((item) => {
        const hasChildren = !!item.items && item.items.length > 0
        if (hasChildren) {
          return (
            <Collapsible
              key={item.title || item.name}
              asChild
              defaultOpen={collapsibleDefaultOpen}
              className='group/collapsible'
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title || item.name}>
                    {item.icon && <item.icon />}
                    <span>{item.title || item.name}</span>
                    <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem: any) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        } else {
          // Nếu không có children
          return (
            <SidebarMenuItem key={item.title || item.name}>
              <SidebarMenuButton asChild tooltip={item.title || item.name}>
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title || item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        }
      })}
    </SidebarMenu>
  )
}
