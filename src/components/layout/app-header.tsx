import { Menu } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { SidebarTrigger } from '#/components/ui/sidebar'

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger
        render={<Button variant="ghost" size="icon" className="size-8" />}
      >
        <Menu className="size-4" />
        <span className="sr-only">Abrir menu</span>
      </SidebarTrigger>

      <div className="flex flex-1 items-center">
        <span className="text-sm font-medium">Status Moto</span>
      </div>
    </header>
  )
}