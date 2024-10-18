import { Ghost, Home, RefreshCw } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '~/components/ui/button';
import { authOptions } from '~/lib/auth';
import { cn } from '~/lib/utils';

export default async function NotFound() {
	const t = await getTranslations();
	const session = await getServerSession(authOptions);

	return (
		<div className="bg-background text-foreground flex flex-col items-center justify-center p-4 py-16">
			<Image src="/images/logo.webp" alt="logo" width="96" height="96" className="h-24 w-24 animate-bounce rounded-md"></Image>
			<h1 className="mb-8 text-center text-4xl font-bold">{t('404.title')}</h1>
			<p className="mb-12 max-w-lg text-center text-lg">{t('404.description')}</p>
			<div className="flex flex-col gap-4 sm:flex-row">
				<Link className={cn(buttonVariants())} href="/">
					<Home className="mr-2 h-4 w-4" />
					{t('404.home')}
				</Link>

				{session?.user && (
					<Link
						href="/generate"
						className={cn(
							buttonVariants({
								className:
									'mx-auto overflow-hidden bg-gradient-to-tl from-blue-500 via-purple-600 via-40% to-blue-500 bg-[length:200%_200%] bg-left-top px-8 py-3 font-semibold !text-white transition-all duration-500 hover:bg-right-bottom'
							})
						)}
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						{t('404.new_generation')}
					</Link>
				)}
			</div>
		</div>
	);
}
