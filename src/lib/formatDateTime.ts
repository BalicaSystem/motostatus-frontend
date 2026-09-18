export function formatDateTime(value: string | null | undefined) {
  if (!value) return 'Não definida'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}