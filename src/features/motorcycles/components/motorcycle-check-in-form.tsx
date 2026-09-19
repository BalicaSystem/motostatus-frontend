import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
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

	const form = useForm<CheckInMotorcycleFormData>({
		resolver: zodResolver(checkInMotorcycleSchema),
		defaultValues: {
			chassis: "",
		},
	});

	async function onSubmit(data: CheckInMotorcycleFormData) {
		try {
			await checkInMotorcycle.mutateAsync(data);

			setSuccess(true);

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
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						<CheckCircle2 className="size-6" />
					</div>

					<div className="space-y-1">
						<h2 className="text-lg font-semibold">Chegada registrada</h2>

						<p className="text-sm text-muted-foreground">
							A motocicleta foi registrada como recebida no estoque.
						</p>
					</div>

					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setSuccess(false);
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
		<div className="mx-auto w-full max-w-lg space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Registrar chegada</CardTitle>
					<CardDescription>
						Escaneie o QR Code da motocicleta ou informe o chassi.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<MotorcycleQrScanner
						onScan={(chassis) => {
							form.setValue("chassis", chassis, {
								shouldValidate: true,
								shouldDirty: true,
							});
						}}
					/>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>

						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								ou
							</span>
						</div>
					</div>

					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="chassis">Chassi</FieldLabel>

								<Input
									id="chassis"
									placeholder="Digite ou escaneie o chassi"
									{...form.register("chassis")}
								/>

								<FieldError>
									{form.formState.errors.chassis?.message}
								</FieldError>
							</Field>

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
										<Search className="size-4" />
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
