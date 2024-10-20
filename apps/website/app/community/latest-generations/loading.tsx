import { getTranslations } from 'next-intl/server';
import { Skeleton } from '~/components/ui/skeleton';

export default async function Loading() {
	const t = await getTranslations();

	return (
		<main className="mx-auto w-screen max-w-screen-md p-4">
			<div className="flex flex-col">
				<h1 className="mb-4 text-2xl font-bold">{t('latest-generations.title')}</h1>

				<div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
					{[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
						<Skeleton key={index} className="aspect-square w-full"></Skeleton>
					))}
				</div>
			</div>
		</main>
	);
}
