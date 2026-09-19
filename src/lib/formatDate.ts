export function formatDate(value: string | null | undefined) {
	if (!value) {
		return "Não definida";
	}

	const [year, month, day] = value.split("-");

	return `${day}/${month}/${year}`;
}
