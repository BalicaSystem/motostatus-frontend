import { Link } from '@tanstack/react-router'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { Customer } from '../types/customer'

type CustomerTableProps = {
  customers: Customer[]
}

export function CustomerTable({ customers }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">
          Nenhum cliente encontrado.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF/CNPJ</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                {customer.name}
              </TableCell>

              <TableCell className="font-mono text-sm">
                {customer.document}
              </TableCell>

              <TableCell>{customer.city}</TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      />
                    }
                  >
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">
                      Ações do cliente
                    </span>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      render={
                        <Link
                          to="/clientes/$customerId"
                          params={{ customerId: customer.id }}
                        />
                      }
                    >
                      <Eye />
                      Visualizar
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      render={
                        <Link
                          to="/clientes/$customerId"
                          params={{ customerId: customer.id }}
                        />
                      }
                    >
                      <Pencil />
                      Editar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}