import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "./pedidos";

export const Route = createFileRoute("/pedidos/")({
	component: OrdersPage,
});
