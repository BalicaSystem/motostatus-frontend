import type { StatusTone } from "#/components/status-pill";
import { StatusPill } from "#/components/status-pill";
import type { Motorcycle } from "../types/motorcycle";

const toneConfig = {
	in_transit: {
		label: "Em trânsito",
		tone: "amber",
	},
	delayed: {
		label: "Atrasada",
		tone: "red",
	},
	arrived: {
		label: "Chegou",
		tone: "emerald",
	},
} satisfies Record<Motorcycle["status"], { label: string; tone: StatusTone }>;

type MotorcycleStatusBadgeProps = {
	status: Motorcycle["status"];
};

export function MotorcycleStatusBadge({ status }: MotorcycleStatusBadgeProps) {
	const config = toneConfig[status];

	return <StatusPill tone={config.tone}>{config.label}</StatusPill>;
}
