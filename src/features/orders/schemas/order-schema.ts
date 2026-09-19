import { z } from "zod";

export const orderSchema = z.object({
	customerId: z.string().min(1, "Selecione o cliente"),
	seller: z.string().min(1, "Informe o vendedor"),
	billingDate: z
		.union([z.iso.date(), z.literal("")])
		.transform((value) => (value === "" ? null : value)),
	motorcycleIds: z
		.array(z.string())
		.min(1, "Selecione pelo menos uma motocicleta"),
});

export type OrderFormValues = z.input<typeof orderSchema>;

export type OrderFormData = z.output<typeof orderSchema>;
