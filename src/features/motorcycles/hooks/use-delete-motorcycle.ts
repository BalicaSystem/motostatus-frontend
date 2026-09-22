import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMotorcycle } from "../services/motorcycles-service";

export function useDeleteMotorcycle() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteMotorcycle(id),
		onSuccess: async (_, id) => {
			queryClient.removeQueries({
				queryKey: ["motorcycle", id],
			});

			await queryClient.invalidateQueries({
				queryKey: ["motorcycles"],
			});
		},
	});
}
