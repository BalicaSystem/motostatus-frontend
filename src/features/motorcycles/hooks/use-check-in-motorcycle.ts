import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type CheckInMotorcycleInput,
	checkInMotorcycle,
} from "../services/motorcycles-service";

export function useCheckInMotorcycle() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CheckInMotorcycleInput) => checkInMotorcycle(data),
		onSuccess: async ({ motorcycle }) => {
			queryClient.setQueryData(["motorcycle", motorcycle.id], { motorcycle });

			await queryClient.invalidateQueries({
				queryKey: ["motorcycles"],
			});
		},
	});
}
