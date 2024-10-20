'use client';

import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export default function Hero() {
	const t = useTranslations();
	const { status } = useSession();

	return (
		<section className="relative min-h-[calc(100vh_-_440px)] bg-gradient-to-b from-white to-gray-100 py-20 text-center transition-colors duration-300 dark:from-gray-950 dark:to-gray-900">
			<div className="absolute inset-x-0 top-0 z-[1] transform-gpu overflow-hidden blur-3xl">
				<div
					className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 -translate-y-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-purple-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%'
					}}
				></div>
			</div>
			<div className="absolute inset-x-0 top-[calc(100%-13rem)] z-[1] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
				<div
					className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 -translate-y-1/4 bg-gradient-to-tr from-blue-400 to-purple-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
					}}
				></div>
			</div>
			<div className="container relative z-[2] mx-auto flex items-center justify-center gap-36 px-4 pt-8">
				<div>
					<h1 className="mb-8 text-6xl font-semibold tracking-tighter">
						{t('homepage.hero.greeting')}{' '}
						<span className="inline-block bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">{t('app.name')}</span>
					</h1>
					<h2 className="mx-auto mb-12 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
						<p>{t('homepage.hero.subtitles.subtitle_1', { name: t('app.name') })}</p>
						<p>{t('homepage.hero.subtitles.subtitle_2')}</p>
						<p>{t('homepage.hero.subtitles.subtitle_3')}</p>
					</h2>

					{status === 'authenticated' ? (
						<Link
							href="/generate"
							className={cn(
								buttonVariants({
									className:
										'h-14 bg-gradient-to-tl from-blue-500 via-purple-600 via-40% to-blue-500 bg-[length:200%_200%] bg-left-top px-8 py-3 text-lg font-semibold !text-white transition-all duration-500 hover:bg-right-bottom xl:w-64'
								})
							)}
						>
							{t('common.generate')}
						</Link>
					) : (
						<Button
							className="h-14 bg-gradient-to-tl from-blue-500 via-purple-600 via-40% to-blue-500 bg-[length:200%_200%] bg-left-top px-8 py-3 text-lg font-semibold !text-white transition-all duration-500 hover:bg-right-bottom xl:w-64"
							onClick={() =>
								signIn('google', {
									redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/generate`
								})
							}
						>
							{t('common.generate')}
						</Button>
					)}
				</div>
				<div className="relative hidden h-[320px] w-[485px] grid-cols-3 grid-rows-2 gap-2 xl:grid 2xl:h-[384px] 2xl:w-[582px]">
					<div className="relative col-span-2 row-span-2">
						<Image
							unoptimized
							src="/images/landing/avatar-1.webp"
							width="320"
							height="320"
							alt="1st presentation avatar"
							className="rounded-md 2xl:hidden"
						/>
						<Image
							unoptimized
							src="/images/landing/avatar-1.webp"
							width="384"
							height="384"
							alt="1st presentation avatar"
							className="hidden rounded-md 2xl:block"
						/>
					</div>
					<div className="relative">
						<Image
							unoptimized
							src="/images/landing/avatar-2.webp"
							width="156"
							height="156"
							alt="2nd presentation avatar"
							className="rounded-md 2xl:hidden"
						/>
						<Image
							unoptimized
							src="/images/landing/avatar-2.webp"
							width="188"
							height="188"
							alt="2nd presentation avatar"
							className="hidden rounded-md 2xl:block"
						/>
					</div>
					<div className="relative">
						<Image
							unoptimized
							src="/images/landing/avatar-3.webp"
							width="156"
							height="156"
							alt="3rd presentation avatar"
							className="rounded-md 2xl:hidden"
						/>
						<Image
							unoptimized
							src="/images/landing/avatar-3.webp"
							width="188"
							height="188"
							alt="3rd presentation avatar"
							className="hidden rounded-md 2xl:block"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
