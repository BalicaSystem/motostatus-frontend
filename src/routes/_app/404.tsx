import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "#/components/layout/page-container";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/404")({
	component: NotFoundPage,
});

function NotFoundPage() {
	return (
		<PageContainer>
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
				<p className="text-6xl font-semibold">404</p>
				<h1 className="text-2xl font-semibold tracking-tight">
					Página não encontrada
				</h1>
				<p className="text-sm text-muted-foreground">
					A página que você procura não existe ou foi movida.
				</p>
				<Button
					variant="outline"
					nativeButton={false}
					render={<Link to="/dashboard" />}
				>
					<ArrowLeft className="size-4" />
					Voltar ao início
				</Button>
			</div>
		</PageContainer>
	);
}
