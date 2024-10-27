import { getTranslations } from 'next-intl/server';
import { Skeleton } from '~/components/ui/skeleton';

export default async function Loading() {
	const t = await getTranslations();

	return (
		<main className="mx-auto w-screen max-w-screen-md flex-1 p-4">
			<div className="flex flex-col">
				<div className="mb-12 flex flex-col gap-2">
					<h1 className="text-3xl font-bold">{t('latest_generations.title')}</h1>
					<h2 className="text-muted-foreground">{t('latest_generations.description', { appName: t('app.name') })}</h2>
				</div>
				<div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-3 sm:grid-cols-5">
					{[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
						<Skeleton key={index} className="aspect-square w-full"></Skeleton>
					))}
				</div>
			</div>
		</main>
	);
}
