import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export default async function Loading() {
	const t = await getTranslations();

	return (
		<main className="mx-auto w-screen max-w-screen-md p-4">
			<div className="flex flex-col">
				<div className="mb-4 flex flex-col gap-2 border-b pb-4">
					<h1 className="text-3xl font-bold">{t('generations.title')}</h1>
					<h2 className="text-muted-foreground">{t('generations.description', { appName: t('app.name') })}</h2>
				</div>
				<div className="space-y-4">
					{[1, 2, 3].map((_, i) => (
						<Card key={`entry-${i}`} className="overflow-hidden rounded-md">
							<CardContent className="flex flex-col justify-between gap-8 p-4 md:flex-row md:gap-0">
								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-2">
										<Skeleton className="h-4 w-48"></Skeleton>
										<Skeleton className="h-4 w-20"></Skeleton>
									</div>
									<div className="flex space-x-4">
										{[1, 2, 3].map((_, j) => (
											<Skeleton key={`image-${j}`} className="h-20 w-20 rounded-md shadow-sm"></Skeleton>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</main>
	);
}
