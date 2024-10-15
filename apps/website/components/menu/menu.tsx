'use client';

import { Sheet, SheetContent } from '~/components/ui/sheet';

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
};

export default function Menu({ open, children, onOpenChange }: Props) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="flex flex-col justify-between">
				{children}
			</SheetContent>
		</Sheet>
	);
}
