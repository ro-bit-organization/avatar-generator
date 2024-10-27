'use client';

import { Menu as MenuIcon, Moon, Sun } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import BuyCreditsModal from '~/components/buy-credits-modal/buy-credits-modal';
import Menu from '~/components/menu/menu';
import { Button } from '~/components/ui/button';

export default function Header() {
	const t = useTranslations();
	const { data: session, status } = useSession();
	const { systemTheme, theme: _theme, setTheme: _setTheme } = useTheme();
	const currentTheme = _theme === 'system' ? systemTheme : _theme;
	const [theme, setTheme] = useState<string | undefined>();

	useEffect(() => {
		setTheme(currentTheme);
	}, [theme]);

	function changeTheme(theme: string) {
		_setTheme(theme);
		setTheme(theme);
	}

	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [menuOpen, setMenuOpen] = useState<boolean>(false);

	return (
		<>
			<div className="relative isolate flex items-center justify-center gap-x-6 overflow-hidden border-b bg-gray-50 px-6 py-2.5 sm:px-3.5 dark:bg-gray-900">
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-center">
					<p className="flex flex-col items-center text-sm leading-6 text-gray-900 lg:flex-row dark:text-white">
						<strong className="font-semibold">{t('navigation.beta_banner.title')}</strong>
						<svg viewBox="0 0 2 2" className="mx-2 hidden h-0.5 w-0.5 fill-current lg:inline">
							<circle cx="1" cy="1" r="1" />
						</svg>
						{t('navigation.beta_banner.description')}
					</p>
				</div>
			</div>
			<header className="flex h-14 items-center justify-between border-b border-gray-200 px-4 lg:px-6 dark:border-gray-800">
				<nav className="flex w-full items-center justify-between gap-2">
					<Link href="/" className="lg:hidden">
						<Image unoptimized src="/images/logo.webp" width="36" height="36" alt="Logo" className="rounded-md" />
					</Link>
					<div className="hidden gap-4 text-lg font-medium lg:flex lg:flex-row lg:items-center lg:gap-6 lg:text-sm">
						<Link href="/" className="mr-2 flex items-center justify-center">
							<Image unoptimized src="/images/logo.webp" width="36" height="36" alt="Logo" className="rounded-md" />
							<span className="ml-2 inline-block text-xl font-semibold tracking-tighter text-gray-900 dark:text-white">{t('app.name')}</span>
						</Link>
						<Link href="/" className="text-muted-foreground hover:text-foreground font-bold tracking-tight transition-colors">
							{t('navigation.menu.home')}
						</Link>

						{status === 'authenticated' ? (
							<Link href="/generate" className="text-muted-foreground hover:text-foreground font-bold tracking-tight transition-colors">
								{t('navigation.menu.generate')}
							</Link>
						) : (
							<Button
								variant="link"
								className="text-muted-foreground hover:text-foreground p-0 font-bold tracking-tight !no-underline transition-colors"
								onClick={() =>
									signIn('google', {
										callbackUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/generate`
									})
								}
							>
								{t('navigation.menu.generate')}
							</Button>
						)}

						{status === 'authenticated' && (
							<>
								<Link href="/generations" className="text-muted-foreground hover:text-foreground font-bold tracking-tight transition-colors">
									{t('navigation.menu.my_generations')}
								</Link>
							</>
						)}
						<Link
							href="/community/latest-generations"
							className="text-muted-foreground hover:text-foreground font-bold tracking-tight transition-colors"
						>
							{t('navigation.menu.latest_generations')}
						</Link>
						{process.env.NEXT_PUBLIC_BLOG_URL && (
							<Link
								href={process.env.NEXT_PUBLIC_BLOG_URL}
								className="text-muted-foreground hover:text-foreground font-bold tracking-tight transition-colors"
							>
								{t('navigation.menu.blog')}
							</Link>
						)}
					</div>
					<div className="flex items-center gap-2">
						<div className="hidden items-center gap-2 lg:flex">
							{status === 'authenticated' ? (
								<>
									<span className="mr-2 text-sm">{t('common.credits_left', { value: session?.user?.credits })}</span>
									<Button
										variant="default"
										size="sm"
										className="bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
										onClick={() => setModalOpen(true)}
									>
										{t('common.buy_credits')}
									</Button>
									<Button size="sm" onClick={() => signOut()}>
										{t('common.sign_out')}
									</Button>
								</>
							) : (
								<Button size="sm" onClick={() => signIn('google')}>
									{t('common.sign_in')}
								</Button>
							)}
						</div>
						{theme && (
							<Button
								size="sm"
								variant="link"
								className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
								onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}
							>
								{theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
							</Button>
						)}
						<MenuIcon
							className="h-5 w-5 cursor-pointer hover:text-blue-600 lg:hidden dark:hover:text-blue-400"
							onClick={() => setMenuOpen(!menuOpen)}
						/>
					</div>
				</nav>
			</header>

			<Menu open={menuOpen} onOpenChange={setMenuOpen}>
				<div className="flex flex-col gap-2">
					<div className="mb-6 flex items-center">
						<Image unoptimized src="/images/logo.webp" width="36" height="36" alt="Logo" className="rounded-md" />
						<span className="ml-2 inline-block text-xl font-semibold tracking-tighter text-gray-900 dark:text-white">{t('app.name')}</span>
					</div>

					{status === 'authenticated' && (
						<>
							<div className="flex items-center justify-between">
								<span className="mr-2">{t('common.credits_left', { value: session?.user?.credits })}</span>
								<Button
									variant="default"
									size="sm"
									className="bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
									onClick={() => {
										setModalOpen(true);
										setMenuOpen(false);
									}}
								>
									{t('common.buy_credits')}
								</Button>
							</div>
							<hr className="my-2" />
						</>
					)}

					<Link href="/" onClick={() => setMenuOpen(false)}>
						{t('navigation.menu.home')}
					</Link>

					{status === 'authenticated' ? (
						<Link href="/generate" onClick={() => setMenuOpen(false)}>
							{t('navigation.menu.generate')}
						</Link>
					) : (
						<Button
							variant="link"
							className="text-md h-[24px] items-center justify-start p-0 !no-underline"
							onClick={() =>
								signIn('google', {
									callbackUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/generate`
								})
							}
						>
							{t('navigation.menu.generate')}
						</Button>
					)}

					{status === 'authenticated' && (
						<Link href="/generations" onClick={() => setMenuOpen(false)}>
							{t('navigation.menu.my_generations')}
						</Link>
					)}

					<Link href="/community/latest-generations" onClick={() => setMenuOpen(false)}>
						{t('navigation.menu.latest_generations')}
					</Link>
					{process.env.NEXT_PUBLIC_BLOG_URL && (
						<Link href={process.env.NEXT_PUBLIC_BLOG_URL!} target="_blank" onClick={() => setMenuOpen(false)}>
							{t('navigation.menu.blog')}
						</Link>
					)}
				</div>

				{status === 'authenticated' ? (
					<Button className="w-full" onClick={() => signOut()}>
						{t('common.sign_out')}
					</Button>
				) : (
					<Button onClick={() => signIn('google')}>{t('common.sign_in')}</Button>
				)}
			</Menu>

			{status === 'authenticated' && <BuyCreditsModal open={modalOpen} onOpenChange={setModalOpen} />}
		</>
	);
}
