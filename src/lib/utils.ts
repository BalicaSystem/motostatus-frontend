export { cn } from "cn";

export function getInitials(name: string) {
	const parts = name.trim().split(/\s+/).filter(Boolean);

	if (parts.length === 0) {
		return "?";
	}

	if (parts.length === 1) {
		return parts[0].slice(0, 2).toUpperCase();
	}

	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const element = document.createElement("textarea");

		element.value = text;
		element.setAttribute("readonly", "");
		element.style.position = "fixed";
		element.style.opacity = "0";

		document.body.appendChild(element);
		element.select();

		let copied = false;

		try {
			copied = document.execCommand("copy");
		} catch {
			copied = false;
		}

		document.body.removeChild(element);

		return copied;
	}
}
