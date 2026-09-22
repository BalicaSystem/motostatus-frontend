import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "cn";
import type * as React from "react";

function AlertDialogRoot(props: AlertDialogPrimitive.Root.Props) {
	return <AlertDialogPrimitive.Root {...props} />;
}

function AlertDialogTrigger({
	className,
	...props
}: AlertDialogPrimitive.Trigger.Props) {
	return (
		<AlertDialogPrimitive.Trigger
			data-slot="alert-dialog-trigger"
			className={cn("", className)}
			{...props}
		/>
	);
}

function AlertDialogBackdrop({
	className,
	...props
}: AlertDialogPrimitive.Backdrop.Props) {
	return (
		<AlertDialogPrimitive.Backdrop
			data-slot="alert-dialog-backdrop"
			className={cn(
				"fixed inset-0 z-50 bg-black/70 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogViewport({
	className,
	...props
}: AlertDialogPrimitive.Viewport.Props) {
	return (
		<AlertDialogPrimitive.Viewport
			data-slot="alert-dialog-viewport"
			className={cn(
				"fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:items-center sm:p-6",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogPopup({
	className,
	...props
}: AlertDialogPrimitive.Popup.Props) {
	return (
		<AlertDialogPrimitive.Portal>
			<AlertDialogBackdrop />
			<AlertDialogViewport>
				<AlertDialogPrimitive.Popup
					data-slot="alert-dialog-popup"
					className={cn(
						"relative w-full max-w-md rounded-lg border bg-background p-6 shadow-lg transition-[transform,opacity] duration-200 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0",
						className,
					)}
					{...props}
				/>
			</AlertDialogViewport>
		</AlertDialogPrimitive.Portal>
	);
}

function AlertDialogTitle({
	className,
	...props
}: AlertDialogPrimitive.Title.Props) {
	return (
		<AlertDialogPrimitive.Title
			data-slot="alert-dialog-title"
			className={cn("text-lg font-semibold", className)}
			{...props}
		/>
	);
}

function AlertDialogDescription({
	className,
	...props
}: AlertDialogPrimitive.Description.Props) {
	return (
		<AlertDialogPrimitive.Description
			data-slot="alert-dialog-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function AlertDialogClose({
	className,
	...props
}: AlertDialogPrimitive.Close.Props) {
	return (
		<AlertDialogPrimitive.Close
			data-slot="alert-dialog-close"
			className={cn("", className)}
			{...props}
		/>
	);
}

function AlertDialogActions({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-dialog-actions"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

const AlertDialog = Object.assign(AlertDialogRoot, {
	Root: AlertDialogRoot,
	Trigger: AlertDialogTrigger,
	Backdrop: AlertDialogBackdrop,
	Viewport: AlertDialogViewport,
	Popup: AlertDialogPopup,
	Title: AlertDialogTitle,
	Description: AlertDialogDescription,
	Close: AlertDialogClose,
	Actions: AlertDialogActions,
});

export {
	AlertDialog,
	AlertDialogActions,
	AlertDialogBackdrop,
	AlertDialogClose,
	AlertDialogDescription,
	AlertDialogPopup,
	AlertDialogRoot,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogViewport,
};
