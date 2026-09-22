import type { StatusTone } from "#/components/status-pill";
import { StatusPill } from "#/components/status-pill";
import type { RegistrationStatus } from "../types/order";

const toneConfig = {
	without_registration: {
		label: "Sem emplacamento",
		tone: "slate",
	},
	registering: {
		label: "Emplacando",
		tone: "amber",
	},
	registered: {
		label: "Emplacado",
		tone: "emerald",
	},
} satisfies Record<RegistrationStatus, { label: string; tone: StatusTone }>;

type RegistrationStatusBadgeProps = {
	status: RegistrationStatus;
};

export function RegistrationStatusBadge({
	status,
}: RegistrationStatusBadgeProps) {
	const config = toneConfig[status];

	return <StatusPill tone={config.tone}>{config.label}</StatusPill>;
}
