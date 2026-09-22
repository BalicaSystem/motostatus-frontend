import { Scanner } from "@yudiel/react-qr-scanner";
import { Camera, ScanLine } from "lucide-react";
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
			<div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted">
				{!scanned ? (
					<>
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

						<div className="pointer-events-none absolute inset-3">
							<span className="absolute top-0 left-0 size-6 border-t-2 border-l-2 border-primary" />
							<span className="absolute top-0 right-0 size-6 border-t-2 border-r-2 border-primary" />
							<span className="absolute bottom-0 left-0 size-6 border-b-2 border-l-2 border-primary" />
							<span className="absolute right-0 bottom-0 size-6 border-r-2 border-b-2 border-primary" />
						</div>

						<div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
							<span className="flex items-center gap-2 rounded bg-background/90 px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.12em] text-muted-foreground uppercase">
								<ScanLine className="size-3.5 text-primary" />
								Aguardando scan
							</span>
						</div>
					</>
				) : (
					<div className="flex h-full flex-col items-center justify-center gap-3">
						<div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
							<Camera className="size-6" />
						</div>

						<p className="font-mono text-[0.6rem] tracking-[0.12em] text-muted-foreground uppercase">
							QR Code lido
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
