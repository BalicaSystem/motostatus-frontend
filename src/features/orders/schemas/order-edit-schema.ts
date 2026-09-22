import { z } from "zod";

export const orderEditSchema = z.object({
	seller: z.string().min(1, "Informe o vendedor"),
	billingDate: z
		.union([z.iso.date(), z.literal("")])
		.transform((value) => (value === "" ? null : value)),
});

export type OrderEditFormValues = z.input<typeof orderEditSchema>;

export type OrderEditFormData = z.output<typeof orderEditSchema>;
