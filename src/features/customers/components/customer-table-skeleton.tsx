import { Skeleton } from "#/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";

const rows = Array.from({ length: 8 }, (_, index) => `row-${index}`);

export function CustomerTableSkeleton() {
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
					{rows.map((key) => (
						<TableRow key={key}>
							<TableCell>
								<Skeleton className="h-4 w-36" />
							</TableCell>

							<TableCell>
								<Skeleton className="h-4 w-32" />
							</TableCell>

							<TableCell>
								<Skeleton className="h-4 w-28" />
							</TableCell>

							<TableCell>
								<Skeleton className="ml-auto size-8" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
