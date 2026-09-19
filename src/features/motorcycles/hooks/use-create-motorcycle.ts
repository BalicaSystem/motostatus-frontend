import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type CreateMotorcycleInput,
	createMotorcycle,
} from "../services/motorcycles-service";

export function useCreateMotorcycle() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateMotorcycleInput) => createMotorcycle(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["motorcycles"],
			});
		},
	});
}
