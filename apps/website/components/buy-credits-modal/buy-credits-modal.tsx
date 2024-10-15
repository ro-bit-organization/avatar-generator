'use client';

import { CreditPackage as _CreditPackage } from '@repo/db';
import { CreditCard, LoaderIcon } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { cn } from '~/lib/utils';

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

type CreditPackage = Pick<_CreditPackage, 'id' | 'credits' | 'bonus' | 'price'>;

export default function BuyCreditsModal({ open, onOpenChange }: Props) {
	const t = useTranslations('components.buy_credits_modal');
	const format = useFormatter();
	const router = useRouter();

	const [creditPackages, setCreditPackages] = useState<CreditPackage[] | undefined>();
	const [selectedCreditPackageId, setSelectedCreditPackageId] = useState<string | undefined>();

	async function getPackages(): Promise<void> {
		try {
			const { data: packages, error } = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credit-packages`, {
				credentials: 'include'
			}).then((response) => response.json());

			if (error) {
				throw error;
			}

			setCreditPackages(packages);
		} catch {
			//show toast
			setCreditPackages([]);
		}
	}

	useEffect(() => {
		if (open) {
			getPackages();
		}
	}, [open]);

	async function handlePurchase(creditPackageId: string | undefined): Promise<void> {
		if (!creditPackageId) {
			return;
		}

		try {
			const {
				data: { paymentUrl },
				error
			} = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({
					packageId: creditPackageId
				})
			}).then((response) => response.json());

			if (error) {
				throw error;
			}

			router.push(paymentUrl);
		} catch {
			//show toast
		}
	}

	function render(): React.ReactNode {
		if (creditPackages === undefined) {
			return <LoaderIcon className="mx-auto h-6 w-6 animate-spin" />;
		}

		const DialogHeaderComponent = (
			<DialogHeader>
				<DialogTitle>{t('title')}</DialogTitle>
				<DialogDescription>{t('description')}</DialogDescription>
			</DialogHeader>
		);

		const DialogFooterComponent = (
			<DialogFooter>
				<Button onClick={() => handlePurchase(selectedCreditPackageId)} disabled={!selectedCreditPackageId} className="w-full">
					<CreditCard className="mr-2 h-4 w-4" />
					{t('action')}
				</Button>
			</DialogFooter>
		);

		if (!creditPackages.length) {
			return (
				<>
					{DialogHeaderComponent}
					<span className="my-2 block text-sm">{t('no_credit_packages')}</span>
					{DialogFooterComponent}
				</>
			);
		}

		return (
			<>
				{DialogHeaderComponent}
				<div className="grid gap-4 py-4">
					<RadioGroup defaultValue={selectedCreditPackageId} onValueChange={setSelectedCreditPackageId} className="grid grid-cols-1 gap-4">
						{creditPackages?.map((creditPackage) => (
							<Label
								key={creditPackage.id}
								htmlFor={`option-${creditPackage.id}`}
								className={cn('hover:bg-muted flex items-center justify-between space-x-2 rounded-lg border p-4', {
									'bg-gradient-to-r from-blue-500 to-purple-600': selectedCreditPackageId === '' + creditPackage.id
								})}
							>
								<RadioGroupItem value={creditPackage.id} id={`option-${creditPackage.id}`} className="sr-only" />
								<span className="flex items-center space-x-2">
									<span
										className={cn('text-lg font-semibold', {
											'!text-white': selectedCreditPackageId === '' + creditPackage.id
										})}
									>
										{format.number(creditPackage.price, { style: 'currency', currency: 'EUR' })}
									</span>
									<span
										className={cn('text-muted-foreground text-sm', {
											'!text-white': selectedCreditPackageId === '' + creditPackage.id
										})}
									>
										{t('credits_value', { value: format.number(creditPackage.credits, { style: 'decimal' }) })}
									</span>
								</span>
								{!!creditPackage.bonus && (
									<span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
										{t('bonus', { value: format.number(creditPackage.bonus, { style: 'decimal' }) })}
									</span>
								)}
							</Label>
						))}
					</RadioGroup>
				</div>
				{DialogFooterComponent}
			</>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="lg:max-w-[550px]">{render()}</DialogContent>
		</Dialog>
	);
}
