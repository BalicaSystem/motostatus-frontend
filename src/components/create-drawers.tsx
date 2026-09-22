import { useEffect, useState } from "react";

import { EntityDrawer } from "#/components/entity-drawer";
import { CustomerCreateForm } from "#/features/customers/components/customer-create-form";
import { MotorcycleForm } from "#/features/motorcycles/components/motorcycle-form";
import { OrderCreateForm } from "#/features/orders/components/order-create-form";

export type CreateEntity = "cliente" | "motocicleta" | "pedido";

const OPEN_EVENT = "motostatus:open-create";

export function openCreateDrawer(entity: CreateEntity) {
	window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: entity }));
}

export function CreateDrawers() {
	const [create, setCreate] = useState<CreateEntity | null>(null);

	function closeCreate() {
		setCreate(null);
	}

	useEffect(() => {
		function onOpenCreate(event: Event) {
			setCreate((event as CustomEvent<CreateEntity>).detail);
		}

		window.addEventListener(OPEN_EVENT, onOpenCreate);

		return () => window.removeEventListener(OPEN_EVENT, onOpenCreate);
	}, []);

	return (
		<>
			<EntityDrawer
				open={create === "cliente"}
				onOpenChange={(open) => {
					if (!open) {
						closeCreate();
					}
				}}
				title="Novo cliente"
				subtitle="Cadastre um novo cliente."
			>
				<CustomerCreateForm onClose={closeCreate} />
			</EntityDrawer>

			<EntityDrawer
				open={create === "motocicleta"}
				onOpenChange={(open) => {
					if (!open) {
						closeCreate();
					}
				}}
				title="Nova motocicleta"
				subtitle="Cadastre uma nova motocicleta no estoque."
			>
				<MotorcycleForm onClose={closeCreate} />
			</EntityDrawer>

			<EntityDrawer
				open={create === "pedido"}
				onOpenChange={(open) => {
					if (!open) {
						closeCreate();
					}
				}}
				title="Novo pedido"
				subtitle="Registre um novo pedido de motocicleta."
				width="wide"
			>
				<OrderCreateForm onClose={closeCreate} />
			</EntityDrawer>
		</>
	);
}
