import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { ApiError } from "#/lib/api/client";
import { authenticate } from "./auth-service";
import { type LoginFormData, loginSchema } from "./schemas/login-schema";

export function LoginForm() {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: LoginFormData) {
		setIsPending(true);
		setErrorMessage(null);

		try {
			await authenticate(data.email, data.password);

			await navigate({ to: "/dashboard" });
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				setErrorMessage("E-mail ou senha inválidos.");
			} else {
				toast.error("Não foi possível entrar", {
					description:
						error instanceof Error ? error.message : "Tente novamente.",
				});
			}
		} finally {
			setIsPending(false);
		}
	}

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="mx-auto w-full max-w-sm space-y-5 px-4"
		>
			<div className="space-y-1.5 text-center">
				<h1 className="font-display text-2xl font-bold tracking-[0.06em] text-foreground uppercase">
					Status Moto
				</h1>

				<p className="text-sm text-muted-foreground">
					Entre com suas credenciais para acessar o painel.
				</p>
			</div>

			<Field data-invalid={!!form.formState.errors.email}>
				<FieldLabel htmlFor="email">E-mail</FieldLabel>

				<Input
					id="email"
					type="email"
					autoComplete="email"
					placeholder="voce@concessionaria.com.br"
					{...form.register("email")}
				/>

				{form.formState.errors.email && (
					<FieldError>{form.formState.errors.email.message}</FieldError>
				)}
			</Field>

			<Field data-invalid={!!form.formState.errors.password}>
				<FieldLabel htmlFor="password">Senha</FieldLabel>

				<Input
					id="password"
					type="password"
					autoComplete="current-password"
					placeholder="••••••••"
					{...form.register("password")}
				/>

				{form.formState.errors.password && (
					<FieldError>{form.formState.errors.password.message}</FieldError>
				)}
			</Field>

			{errorMessage && (
				<div
					role="alert"
					className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
				>
					{errorMessage}
				</div>
			)}

			<Button type="submit" className="w-full" disabled={isPending}>
				{isPending ? (
					<>
						<Loader2 className="animate-spin" />
						Entrando...
					</>
				) : (
					"Entrar"
				)}
			</Button>
		</form>
	);
}
