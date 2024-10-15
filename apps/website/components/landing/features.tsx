import { Palette, Shield, UndoDot, Zap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function Features() {
	const t = await getTranslations();

	const features = [
		{ icon: Zap, title: t('homepage.features.feature_1.title'), description: t('homepage.features.feature_1.description') },
		{ icon: Palette, title: t('homepage.features.feature_2.title'), description: t('homepage.features.feature_2.description') },
		{ icon: UndoDot, title: t('homepage.features.feature_3.title'), description: t('homepage.features.feature_3.description') },
		{ icon: Shield, title: t('homepage.features.feature_4.title'), description: t('homepage.features.feature_4.description') }
	];

	return (
		<section id="features" className="bg-gray-100 py-20 transition-colors duration-300 dark:bg-gray-900">
			<div className="container mx-auto px-4">
				<h2 className="mb-12 text-center text-3xl font-bold tracking-tighter text-gray-900 dark:text-white">{t('homepage.features.title')}</h2>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					{features.map((feature, index) => (
						<div key={index} className="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-700 dark:shadow-gray-900">
							<feature.icon className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
							<h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
							<p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
