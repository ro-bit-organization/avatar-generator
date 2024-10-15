import { prisma } from '@repo/db';
import { CheckCircle, Package, Receipt, RefreshCw, Zap } from 'lucide-react';
import { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { auth } from '~/lib/auth';
import { cn } from '~/lib/utils';

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false
	}
};

type Props = {
	searchParams?: { 'payment-id'?: string };
};

export default async function ThankYou({ searchParams }: Props) {
	const format = await getFormatter();
	const t = await getTranslations();

	const paymentId = searchParams?.['payment-id'];

	if (!paymentId) {
		redirect('/');
	}

	const payment = await prisma.payment.findFirst({
		where: { id: paymentId }
	});

	if (!payment) {
		redirect('/');
	}

	const session = await auth();

	if (session?.user.id !== payment.userId) {
		redirect('/');
	}

	const creditPackage = payment.creditPackage as { credits: number; price: number; bonus: number };

	return (
		<main className="flex-1">
			<div className="flex items-center justify-center py-8">
				<Card className="w-full max-w-lg">
					<CardHeader className="text-center">
						<div className="mb-4 flex justify-center">
							<CheckCircle className="text-primary h-12 w-12" />
						</div>
						<CardTitle className="text-2xl font-bold">{t('thank_you.title')}</CardTitle>
						<CardDescription>{t('thank_you.description')}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert>
							<Receipt className="h-4 w-4" />
							<AlertTitle className="text-lg font-bold">{t('thank_you.transaction_details.title')}</AlertTitle>
							<AlertDescription className="text-muted-foreground">
								<p>{t('thank_you.transaction_details.id', { value: payment.id })}</p>
								<p>
									{t('thank_you.transaction_details.date', {
										value: format.dateTime(payment.updatedAt, {
											year: 'numeric',
											month: 'short',
											day: 'numeric'
										})
									})}
								</p>
							</AlertDescription>
						</Alert>
						<Alert>
							<Package className="h-4 w-4" />
							<AlertTitle className="text-lg font-bold">{t('thank_you.package_details.title')}</AlertTitle>
							<AlertDescription className="text-muted-foreground">
								<p className="space-x-2">
									<span>{t('thank_you.package_details.package', { value: format.number(creditPackage.credits, { style: 'decimal' }) })}</span>
									{creditPackage.bonus && (
										<span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
											{t('thank_you.package_details.bonus', { value: format.number(creditPackage.bonus, { style: 'decimal' }) })}
										</span>
									)}
								</p>
								<p>
									{t('thank_you.package_details.price', {
										value: format.number(creditPackage.price, { style: 'currency', currency: 'EUR' })
									})}
								</p>
							</AlertDescription>
						</Alert>
						<Alert>
							<RefreshCw className="h-4 w-4 animate-spin" />
							<AlertTitle className="text-lg font-bold">{t('thank_you.credits_pending.title')}</AlertTitle>
							<AlertDescription className="text-muted-foreground">{t('thank_you.credits_pending.description')}</AlertDescription>
						</Alert>
						<Alert>
							<Zap className="h-4 w-4" />
							<AlertTitle className="text-lg font-bold">{t('thank_you.what_is_next.title')}</AlertTitle>
							<AlertDescription className="text-muted-foreground">{t('thank_you.what_is_next.description')}</AlertDescription>
						</Alert>
					</CardContent>
					<CardFooter className="flex justify-center">
						<Link
							href="/generate"
							className={cn(
								buttonVariants({
									className:
										'h-14 bg-gradient-to-tl from-blue-500 via-purple-600 via-40% to-blue-500 bg-[length:200%_200%] bg-left-top px-8 py-3 text-lg font-semibold !text-white transition-all duration-500 hover:bg-right-bottom'
								})
							)}
						>
							{t('common.generate')}
						</Link>
					</CardFooter>
				</Card>
			</div>
		</main>
	);
}
