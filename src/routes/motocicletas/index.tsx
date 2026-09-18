import { createFileRoute } from '@tanstack/react-router'
import { useMotorcycles } from '#/features/motorcycles/hooks/use-motorcycles'

export const Route = createFileRoute('/motocicletas/')({
  component: MotorcyclesPage,
})

function MotorcyclesPage() {
  const { data, isLoading, isError } = useMotorcycles()

  if (isLoading) {
    return <div>Carregando motocicletas...</div>
  }

  if (isError) {
    return <div>Não foi possível carregar as motocicletas.</div>
  }

  return (
    <main>
      <h1>Motocicletas</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}