import type { StatusTone } from "#/components/status-pill";
import { StatusPill } from "#/components/status-pill";
import type { OrderStatus } from "../types/order";

const toneConfig = {
	active: {
		label: "Ativo",
		tone: "sky",
	},
	released: {
		label: "Liberado",
		tone: "slate",
	},
	completed: {
		label: "Concluído",
		tone: "emerald",
	},
} satisfies Record<OrderStatus, { label: string; tone: StatusTone }>;

type OrderStatusBadgeProps = {
	status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
	const config = toneConfig[status];

	return <StatusPill tone={config.tone}>{config.label}</StatusPill>;
}
