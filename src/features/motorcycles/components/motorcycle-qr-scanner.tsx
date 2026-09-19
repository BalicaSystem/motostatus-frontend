import { Scanner } from "@yudiel/react-qr-scanner";
import { Camera } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button";

type MotorcycleQrScannerProps = {
	onScan: (value: string) => void;
};

export function MotorcycleQrScanner({ onScan }: MotorcycleQrScannerProps) {
	const [scanned, setScanned] = useState(false);

	function handleScan(results: { rawValue: string }[]) {
		if (scanned) return;

		const value = results[0]?.rawValue?.trim();

		if (!value) return;

		setScanned(true);
		onScan(value);
	}

	function handleReset() {
		setScanned(false);
	}

	return (
		<div className="space-y-4">
			<div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
				{!scanned ? (
					<Scanner
						onScan={handleScan}
						components={{
							finder: true,
						}}
						styles={{
							container: {
								width: "100%",
								height: "100%",
							},
							video: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
							},
						}}
					/>
				) : (
					<div className="flex h-full flex-col items-center justify-center gap-3">
						<div className="flex size-12 items-center justify-center rounded-full bg-background">
							<Camera className="size-6" />
						</div>

						<p className="text-sm text-muted-foreground">
							QR Code lido com sucesso
						</p>
					</div>
				)}
			</div>

			{scanned && (
				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={handleReset}
				>
					Escanear novamente
				</Button>
			)}
		</div>
	);
}
