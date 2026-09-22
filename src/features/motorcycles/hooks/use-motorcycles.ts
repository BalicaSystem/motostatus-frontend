import { useQuery } from "@tanstack/react-query";
import { getMotorcycles } from "../services/motorcycles-service";

export function useMotorcycles(page = 1) {
	return useQuery({
		queryKey: ["motorcycles", page],
		queryFn: ({ signal }) => getMotorcycles(page, 20, signal),
		placeholderData: (previousData) => previousData,
	});
}
