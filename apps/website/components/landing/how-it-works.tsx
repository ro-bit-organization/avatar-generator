import { Download, Upload, Wand2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function HowItWorks() {
	const t = await getTranslations();

	const steps = [
		{ icon: Upload, title: t('homepage.how_it_works.step_1.title'), description: t('homepage.how_it_works.step_1.description') },
		{ icon: Wand2, title: t('homepage.how_it_works.step_2.title'), description: t('homepage.how_it_works.step_2.description') },
		{ icon: Download, title: t('homepage.how_it_works.step_3.title'), description: t('homepage.how_it_works.step_3.description') }
	];

	return (
		<section id="how-it-works" className="bg-white py-20 transition-colors duration-300 dark:bg-gray-900">
			<div className="container mx-auto px-4">
				<h2 className="mb-12 text-center text-3xl font-bold tracking-tighter text-gray-900 dark:text-white">{t('homepage.how_it_works.title')}</h2>
				<div className="flex flex-col items-center justify-center space-y-8 md:flex-row md:space-x-12 md:space-y-0">
					{steps.map((step, index) => (
						<div key={index} className="max-w-xs text-center">
							<div className="mb-4 inline-block rounded-full bg-gray-100 p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900">
								<step.icon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
							</div>
							<h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
							<p className="text-gray-600 dark:text-gray-300">{step.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
