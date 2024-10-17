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
					<p className="flex flex-col items-center text-sm leading-6 text-gray-900 md:flex-row dark:text-white">
						<strong className="font-semibold">{t('navigation.beta_banner.title')}</strong>
						<svg viewBox="0 0 2 2" className="mx-2 hidden h-0.5 w-0.5 fill-current md:inline">
							<circle cx="1" cy="1" r="1" />
						</svg>
						{t('navigation.beta_banner.description')}
					</p>
				</div>
			</div>
			<header className="flex h-14 items-center justify-between border-b border-gray-200 px-4 lg:px-6 dark:border-gray-800">
				<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-7 md:text-sm lg:gap-8">
					<Link href="/" className="flex items-center justify-center">
						<Image src="/images/logo.svg" width="36" height="36" alt="logo" className="rounded-md" />
						<span className="ml-2 inline-block text-xl font-semibold tracking-tighter text-gray-900 dark:text-white">{t('app.name')}</span>
					</Link>
					{status === 'authenticated' && (
						<Link href="/generations" className="text-muted-foreground hover:text-foreground font-bold transition-colors">
							{t('navigation.menu.generations')}
						</Link>
					)}
				</nav>
				<nav className="hidden items-center gap-2 md:flex">
					{status === 'authenticated' ? (
						<>
							<span className="mr-2">{t('common.credits_left', { value: session?.user?.credits })}</span>
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
						<Button
							size="sm"
							onClick={() =>
								signIn('google', {
									redirectTo: process.env.NEXT_PUBLIC_WEBSITE_URL
								})
							}
						>
							{t('common.sign_in')}
						</Button>
					)}
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
				</nav>
				<MenuIcon className="h-5 w-5 cursor-pointer hover:text-blue-600 md:hidden dark:hover:text-blue-400" onClick={() => setMenuOpen(!menuOpen)} />
			</header>

			<Menu open={menuOpen} onOpenChange={setMenuOpen}>
				<div className="flex flex-col gap-2">
					<div className="mb-6 flex items-center">
						<Image src="/images/logo.svg" width="36" height="36" alt="logo" className="rounded-md" />
						<span className="ml-2 inline-block text-xl font-semibold tracking-tighter text-gray-900 dark:text-white">{t('app.name')}</span>
					</div>

					{status === 'authenticated' && (
						<>
							<Link href="/generations">{t('navigation.menu.generations')}</Link>
							<hr className="my-2" />
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
						</>
					)}
					<div className="flex items-center justify-between">
						<span className="mr-2">{t('navigation.theme')}</span>
						<Button size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
							{theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
						</Button>
					</div>
				</div>

				{status === 'authenticated' ? (
					<Button className="w-full" onClick={() => signOut()}>
						{t('common.sign_out')}
					</Button>
				) : (
					<Button
						onClick={() =>
							signIn('google', {
								redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/generate`
							})
						}
					>
						{t('common.sign_in')}
					</Button>
				)}
			</Menu>

			{status === 'authenticated' && <BuyCreditsModal open={modalOpen} onOpenChange={setModalOpen} />}
		</>
	);
}
