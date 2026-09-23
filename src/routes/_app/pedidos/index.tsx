import { createFileRoute } from "@tanstack/react-router";

import { OrdersPage } from "./pedidos";

export const Route = createFileRoute("/_app/pedidos/")({
	validateSearch: (search) => ({
		page: Number(search.page) || 1,
		q: typeof search.q === "string" ? search.q.trim() : "",
	}),
	component: OrdersPage,
});
