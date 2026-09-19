import { Badge } from "#/components/ui/badge";
import type { RegistrationStatus } from "../types/order";

const statusConfig = {
	without_registration: {
		label: "Sem emplacamento",
		variant: "outline",
	},
	registering: {
		label: "Emplacando",
		variant: "secondary",
	},
	registered: {
		label: "Emplacado",
		variant: "default",
	},
} satisfies Record<
	RegistrationStatus,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
>;

type RegistrationStatusBadgeProps = {
	status: RegistrationStatus;
};

export function RegistrationStatusBadge({
	status,
}: RegistrationStatusBadgeProps) {
	const config = statusConfig[status];

	return <Badge variant={config.variant}>{config.label}</Badge>;
}
