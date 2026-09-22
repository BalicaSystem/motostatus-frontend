export function digitsOnly(value: string): string {
	return value.replace(/\D/g, "");
}

export function maskCpf(value: string): string {
	const digits = digitsOnly(value).slice(0, 11);

	return digits
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCnpj(value: string): string {
	const digits = digitsOnly(value).slice(0, 14);

	return digits
		.replace(/(\d{2})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1/$2")
		.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskDocument(value: string): string {
	const digits = digitsOnly(value);

	if (digits.length > 11) {
		return maskCnpj(value);
	}

	return maskCpf(value);
}
