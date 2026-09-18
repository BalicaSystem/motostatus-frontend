import {
  Bike,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'
import * as React from 'react'
import { Link } from '@tanstack/react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar'

const navigation = [
  {
    label: 'Principal',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Operação',
    items: [
      {
        title: 'Clientes',
        url: '/clientes',
        icon: Users,
      },
      {
        title: 'Motocicletas',
        url: '/motocicletas',
        icon: Bike,
      },
      {
        title: 'Pedidos',
        url: '/pedidos',
        icon: ClipboardList,
      },
    ],
  },
]

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              render={<Link to="/dashboard" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bike className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Status Moto</span>
                <span className="truncate text-xs text-muted-foreground">
                  Gestão de concessionária
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      render={
                        <Link 
                          to={item.url} 
                          activeProps={{
                            className: 'bg-sidebar-accent text-sidebar-accent-foreground',
                          }} 
                        />
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Configurações"
              render={
                <Link 
                  to="/configuracoes" 
                  activeProps={{
                    className: 'bg-sidebar-accent text-sidebar-accent-foreground',
                  }} 
                />
              }
            >
              <Settings />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}