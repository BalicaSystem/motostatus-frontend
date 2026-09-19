import { z } from "zod";

export const createMotorcycleSchema = z.object({
	model: z.string().min(1, "Informe o modelo"),
	chassis: z.string().min(1, "Informe o chassi"),
	estimatedArrival: z
		.union([z.iso.date(), z.literal("")])
		.transform((value) => (value === "" ? undefined : value)),
});

export const updateMotorcycleSchema = z.object({
	model: z.string().min(1, "Informe o modelo"),
	chassis: z.string().min(1, "Informe o chassi"),
	estimatedArrival: z
		.union([z.iso.date(), z.literal("")])
		.transform((value) => (value === "" ? null : value)),
	status: z.enum(["in_transit", "delayed", "arrived"]),
});

export const checkInMotorcycleSchema = z.object({
	chassis: z.string().min(1, "Informe o chassi"),
});

export type CreateMotorcycleFormValues = z.input<typeof createMotorcycleSchema>;

export type CreateMotorcycleFormData = z.output<typeof createMotorcycleSchema>;

export type UpdateMotorcycleFormValues = z.input<typeof updateMotorcycleSchema>;

export type UpdateMotorcycleFormData = z.output<typeof updateMotorcycleSchema>;

export type CheckInMotorcycleFormData = z.output<
	typeof checkInMotorcycleSchema
>;
