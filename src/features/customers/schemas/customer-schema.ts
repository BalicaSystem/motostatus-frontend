import { z } from "zod";

export const customerSchema = z.object({
	name: z.string().min(1, "Informe o nome"),
	document: z.string().min(1, "Informe o CPF ou CNPJ"),
	city: z.string().min(1, "Informe a cidade"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
