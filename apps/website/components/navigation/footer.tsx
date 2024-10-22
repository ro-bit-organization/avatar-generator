'use client';

import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export default function Footer() {
	const t = useTranslations();
	const { status } = useSession();

	return (
		<footer className="border-t border-gray-200 bg-white pt-8 text-gray-600 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					<div className="flex flex-col gap-4">
						<div className="flex items-center">
							<Image unoptimized src="/images/logo.webp" width="36" height="36" alt="Logo" className="rounded-md" />
							<h4 className="ml-2 text-lg font-semibold tracking-tighter text-gray-900 dark:text-white">{t('app.name')}</h4>
						</div>

						<p>{t('app.description')}</p>
						<a href={process.env.NEXT_PUBLIC_WEBSITE_URL} className="hover:text-foreground transition-colors">
							{process.env.NEXT_PUBLIC_WEBSITE_URL}
						</a>
					</div>
					<div>
						<h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('footer.quick_links.title')}</h4>
						<ul className="space-y-2">
							<li>
								<Link href="/#features" className="hover:text-foreground transition-colors">
									{t('footer.quick_links.features')}
								</Link>
							</li>
							<li>
								<Link href="/#how-it-works" className="hover:text-foreground transition-colors">
									{t('footer.quick_links.how_it_works')}
								</Link>
							</li>

							<li>
								{status === 'authenticated' ? (
									<Link href="/generate" className="hover:text-foreground transition-colors">
										{t('footer.quick_links.generate')}
									</Link>
								) : (
									<Button
										variant="link"
										className="hover:text-foreground text-md h-[24px] p-0 text-inherit !no-underline transition-colors"
										onClick={() =>
											signIn('google', {
												callbackUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/generate`
											})
										}
									>
										{t('footer.quick_links.generate')}
									</Button>
								)}
							</li>

							{status === 'authenticated' && (
								<li>
									<Link href="/generate" className="hover:text-foreground transition-colors">
										{t('footer.quick_links.my_generations')}
									</Link>
								</li>
							)}
							<li>
								<Link href="/community/latest-generations" className="hover:text-foreground transition-colors">
									{t('footer.quick_links.latest_generations')}
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('footer.legal.title')}</h4>
						<ul className="space-y-2">
							<li>
								<Link href="/terms-of-service" className="hover:text-foreground transition-colors">
									{t('footer.legal.terms_of_service')}
								</Link>
							</li>
							<li>
								<Link href="/privacy-policy" className="hover:text-foreground transition-colors">
									{t('footer.legal.privacy_policy')}
								</Link>
							</li>
							<li>
								<Link href="/refund-policy" className="hover:text-foreground transition-colors">
									{t('footer.legal.refund_policy')}
								</Link>
							</li>
							<li>
								<Link href="/cookie-policy" className="hover:text-foreground transition-colors">
									{t('footer.legal.cookie_policy')}
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('footer.connect_with_us.title')}</h4>
						<div className="flex space-x-4">
							{process.env.NEXT_PUBLIC_TIKTOK_URL && (
								<Link
									href={process.env.NEXT_PUBLIC_TIKTOK_URL}
									target="_blank"
									className="rounded-sm bg-white p-[2px] transition-transform hover:brightness-[1.1] dark:hover:brightness-[0.9]"
								>
									<Image unoptimized src="/images/icons/tiktok.svg" alt="TikTok" width="20" height="20" className="h-5 w-5" />
								</Link>
							)}
							{process.env.NEXT_PUBLIC_FACEBOOK_URL && (
								<Link
									href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
									target="_blank"
									className="transition-transform hover:brightness-[1.1] dark:hover:brightness-[0.9]"
								>
									<Image unoptimized src="/images/icons/facebook.svg" alt="Facebook" width="24" height="24" className="h-6 w-6" />
								</Link>
							)}
							{process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
								<Link
									href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
									target="_blank"
									className="transition-transform hover:brightness-[1.1] dark:hover:brightness-[0.9]"
								>
									<Image unoptimized src="/images/icons/instagram.svg" alt="Instagram" width="24" height="24" className="h-6 w-6" />
								</Link>
							)}
							{process.env.NEXT_PUBLIC_TWITTER_URL && (
								<Link
									href={process.env.NEXT_PUBLIC_TWITTER_URL}
									target="_blank"
									className="transition-transform hover:brightness-[1.1] dark:hover:brightness-[0.9]"
								>
									<Image unoptimized src="/images/icons/twitter.svg" alt="Twitter" width="24" height="24" className="h-6 w-6" />
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
