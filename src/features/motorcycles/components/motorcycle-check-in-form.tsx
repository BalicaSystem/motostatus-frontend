import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { CheckCheck, CheckCircle2, Loader2, ScanSearch } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { useCheckInMotorcycle } from "../hooks/use-check-in-motorcycle";
import {
	type CheckInMotorcycleFormData,
	checkInMotorcycleSchema,
} from "../schemas/motorcycle-schema";
import { MotorcycleQrScanner } from "./motorcycle-qr-scanner";

export function MotorcycleCheckInForm() {
	const navigate = useNavigate();
	const checkInMotorcycle = useCheckInMotorcycle();
	const [success, setSuccess] = useState(false);
	const [successChassis, setSuccessChassis] = useState<string | null>(null);

	const form = useForm<CheckInMotorcycleFormData>({
		resolver: zodResolver(checkInMotorcycleSchema),
		defaultValues: {
			chassis: "",
		},
	});

	const chassis = form.watch("chassis");

	async function onSubmit(data: CheckInMotorcycleFormData) {
		try {
			await checkInMotorcycle.mutateAsync(data);

			setSuccess(true);
			setSuccessChassis(data.chassis);

			toast.success("Chegada registrada com sucesso", {
				description: "A motocicleta foi registrada como recebida no estoque.",
			});
		} catch (error) {
			toast.error("Não foi possível registrar a chegada", {
				description:
					error instanceof Error
						? error.message
						: "Verifique o chassi e tente novamente.",
			});
		}
	}

	if (success) {
		return (
			<Card className="mx-auto w-full max-w-lg">
				<CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
					<div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
						<CheckCircle2 className="size-7" />
					</div>

					<div className="space-y-1">
						<h2 className="font-display text-xl font-bold tracking-[0.04em] uppercase">
							Chegada registrada
						</h2>

						<p className="text-sm text-muted-foreground">
							A motocicleta foi registrada como recebida no estoque.
						</p>
					</div>

					{successChassis && (
						<p className="max-w-full truncate rounded border border-border bg-accent/40 px-3 py-1.5 font-mono text-xs tracking-wide">
							{successChassis}
						</p>
					)}

					<div className="flex flex-wrap justify-center gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setSuccess(false);
								setSuccessChassis(null);
								form.reset();
							}}
						>
							Registrar outra
						</Button>

						<Button
							type="button"
							onClick={() =>
								navigate({ to: "/motocicletas", search: { page: 1 } })
							}
						>
							Voltar para estoque
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid w-full gap-4 lg:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="font-display text-base font-bold tracking-[0.04em] uppercase">
						Escaneie a unidade
					</CardTitle>
				</CardHeader>

				<CardContent>
					<MotorcycleQrScanner
						onScan={(value) => {
							form.setValue("chassis", value, {
								shouldValidate: true,
								shouldDirty: true,
							});
						}}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 font-display text-base font-bold tracking-[0.04em] uppercase">
						<ScanSearch className="size-4 text-primary" />
						Unidade identificada
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-5">
					<Field data-invalid={!!form.formState.errors.chassis}>
						<FieldLabel htmlFor="chassis">Chassi</FieldLabel>

						<Input
							id="chassis"
							placeholder="Digite ou escaneie o chassi"
							{...form.register("chassis")}
						/>

						<FieldError>{form.formState.errors.chassis?.message}</FieldError>
					</Field>

					<div className="rounded border border-border bg-accent/40 p-4">
						<p className="font-mono text-[0.6rem] tracking-[0.12em] text-muted-foreground uppercase">
							Status da unidade
						</p>

						<p className="mt-1 text-sm font-medium">
							{chassis
								? "Unidade pronta para recebimento"
								: "Nenhuma unidade identificada"}
						</p>
					</div>

					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Button
								type="submit"
								disabled={checkInMotorcycle.isPending}
								className="w-full"
							>
								{checkInMotorcycle.isPending ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Registrando...
									</>
								) : (
									<>
										<CheckCheck className="size-4" />
										Registrar chegada
									</>
								)}
							</Button>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
