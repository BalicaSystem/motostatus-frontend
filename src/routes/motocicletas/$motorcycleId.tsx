import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/motocicletas/$motorcycleId')({
  component: MotorcycleDetailsPage,
})

function MotorcycleDetailsPage() {
  const { motorcycleId } = Route.useParams()

  return (
    <div>
      Motocicleta: {motorcycleId}
    </div>
  )
}