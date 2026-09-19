import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "./clientes";

export const Route = createFileRoute("/clientes/")({
	component: CustomersPage,
});
