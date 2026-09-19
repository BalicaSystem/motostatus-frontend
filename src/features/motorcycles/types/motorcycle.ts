export type MotorcycleStatus = "in_transit" | "delayed" | "arrived";

export type Motorcycle = {
	id: string;
	model: string;
	chassis: string;
	estimatedArrival: string | null;
	status: MotorcycleStatus;
};
