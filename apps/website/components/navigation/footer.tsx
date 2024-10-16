import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function Footer() {
	const t = await getTranslations();

	return (
		<footer className="border-t border-gray-200 bg-white pt-8 text-gray-600 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					<div>
						<div className="mb-4 flex items-center">
							<Image src="/images/logo.svg" width="36" height="36" alt="logo" className="rounded-md" />
							<h4 className="ml-2 text-lg font-semibold tracking-tighter text-gray-900 dark:text-white">{t('app.name')}</h4>
						</div>

						<p>{t('app.description')}</p>
					</div>
					<div>
						<h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('footer.quick_links.title')}</h4>
						<ul className="space-y-2">
							<li>
								<Link href="/#features" className="hover:text-blue-600 dark:hover:text-blue-400">
									{t('footer.quick_links.features')}
								</Link>
							</li>
							<li>
								<Link href="/#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400">
									{t('footer.quick_links.how_it_works')}
								</Link>
							</li>
							<li>
								<Link href="/generate" className="hover:text-blue-600 dark:hover:text-blue-400">
									{t('footer.quick_links.generate')}
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('footer.legal.title')}</h4>
						<ul className="space-y-2">
							<li>
								<Link href="/terms-of-service" className="hover:text-blue-600 dark:hover:text-blue-400">
									{t('footer.legal.terms_of_service')}
								</Link>
							</li>
							<li>
								<Link href="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400">
									{t('footer.legal.privacy_policy')}
								</Link>
							</li>
							<li>
								<Link href="/refund-policy" className="hover:text-blue-600 dark:hover:text-blue-400">
									{t('footer.legal.refund_policy')}
								</Link>
							</li>
							<li>
								<Link href="/cookie-policy" className="hover:text-blue-600 dark:hover:text-blue-400">
									{t('footer.legal.cookie_policy')}
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('footer.connect_with_us.title')}</h4>
						<div className="flex space-x-4">
							{process.env.TIKTOK_URL && (
								<Link
									href={process.env.TIKTOK_URL}
									target="_blank"
									className="rounded-sm bg-white p-[2px] hover:text-blue-600 dark:hover:text-blue-400"
								>
									<Image src="/images/icons/tiktok.svg" alt="TikTok" width="20" height="20" className="h-5 w-5" />
								</Link>
							)}
							{process.env.FACEBOOK_URL && (
								<Link href={process.env.FACEBOOK_URL} target="_blank" className="hover:text-blue-600 dark:hover:text-blue-400">
									<Image src="/images/icons/facebook.svg" alt="Facebook" width="24" height="24" className="h-6 w-6" />
								</Link>
							)}
							{process.env.INSTAGRAM_URL && (
								<Link href={process.env.INSTAGRAM_URL} target="_blank" className="hover:text-blue-600 dark:hover:text-blue-400">
									<Image src="/images/icons/instagram.svg" alt="Instagram" width="24" height="24" className="h-6 w-6" />
								</Link>
							)}
							{process.env.TWITTER_URL && (
								<Link href={process.env.TWITTER_URL} target="_blank" className="text-white hover:text-blue-600 dark:hover:text-blue-400">
									<Image src="/images/icons/twitter.svg" alt="Twitter" width="24" height="24" className="h-6 w-6" />
								</Link>
							)}
						</div>
					</div>
				</div>
				<div className="my-8 pt-8 text-center dark:border-gray-700">
					<p>
						&copy;{' '}
						{t('footer.all_rights_reserved', {
							year: new Date().getFullYear(),
							name: t('app.name')
						})}
					</p>
				</div>
			</div>
		</footer>
	);
}
