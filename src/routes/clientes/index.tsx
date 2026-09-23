import { createFileRoute } from "@tanstack/react-router";

import { CustomersPage } from "./clientes";

export const Route = createFileRoute("/clientes/")({
	validateSearch: (search) => ({
		page: Number(search.page) || 1,
		q: typeof search.q === "string" ? search.q.trim() : "",
	}),
	component: CustomersPage,
});
