import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {children}
    </main>
  )
}