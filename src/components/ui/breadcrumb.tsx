import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import { ChevronRight, Slash } from "lucide-react";
import type * as React from "react";
import { Badge } from "./badge";

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
	return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
	return (
		<ol
			data-slot="breadcrumb-list"
			className={cn(
				"flex flex-wrap items-center gap-1 break-words text-sm text-muted-foreground sm:gap-1.5",
				className,
			)}
			{...props}
		/>
	);
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
	return (
		<li
			data-slot="breadcrumb-item"
			className={cn("inline-flex items-center gap-1", className)}
			{...props}
		/>
	);
}

function BreadcrumbLink({
	className,
	render,
	...props
}: useRender.ComponentProps<"span">) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(
					"transition-colors hover:text-foreground focus-visible:outline-none",
					className,
				),
			},
			props,
		),
		render,
	});
}

function BreadcrumbPage({
	className,
	render,
	...props
}: useRender.ComponentProps<"span">) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				"aria-current": "page",
				className: cn("font-normal text-foreground", className),
			},
			props,
		),
		render,
	});
}

function BreadcrumbSeparator({
	children,
	className,
	...props
}: React.ComponentProps<"li">) {
	return (
		<li
			data-slot="breadcrumb-separator"
			role="presentation"
			aria-hidden="true"
			className={cn("[&>svg]:size-3.5", className)}
			{...props}
		>
			{children ?? <ChevronRight />}
		</li>
	);
}

function BreadcrumbEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="breadcrumb-ellipsis"
			className={cn("flex size-6 items-center justify-center", className)}
			role="presentation"
			aria-hidden="true"
			{...props}
		>
			<Slash className="size-3" />
		</span>
	);
}

function BreadcrumbSkeleton() {
	return <Badge variant="outline" className="h-5 px-1.5 text-xs" />;
}

export {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbSkeleton,
};
