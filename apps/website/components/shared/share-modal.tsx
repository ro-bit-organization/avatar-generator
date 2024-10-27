'use client';

import { Base64 } from 'js-base64';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
	FacebookShareButton,
	LinkedinShareButton,
	PinterestShareButton,
	RedditShareButton,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappShareButton
} from 'react-share';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

type Props = {
	open: boolean;
	imageUrl: string | null;
	onOpenChange: (open: boolean) => void;
};

export default function ShareModal({ open, imageUrl, onOpenChange }: Props) {
	const t = useTranslations();
	const [copied, setCopied] = useState<boolean>();
	const { theme: _theme, setTheme: _setTheme } = useTheme();

	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 2500);
		}
	}, [copied]);

	let url = imageUrl;

	if (process.env.NEXT_PUBLIC_CDN_URL && imageUrl) {
		url = `${process.env.NEXT_PUBLIC_CDN_URL}/format:png/quality:100/${Base64.encode(imageUrl!, true)}.png`;
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-[400px]:max-w-md">
				<DialogHeader>
					<DialogTitle>{t('components.share_modal.title')}</DialogTitle>
				</DialogHeader>
				{url && (
					<div className="flex items-center space-x-2 py-4">
						<div className="grid flex-1 gap-2">
							<Label htmlFor="link" className="sr-only">
								Link
							</Label>
							<Input id="link" value={url as string} readOnly className="w-full" />
						</div>
						<Button
							type="submit"
							size="sm"
							className="px-3"
							onClick={() => {
								navigator.clipboard.writeText(url as string);
								setCopied(true);
							}}
						>
							{copied ? t('components.share_modal.copied') : t('components.share_modal.copy')}
						</Button>
					</div>
				)}

				<hr />

				<div className="flex justify-center gap-3 py-4 min-[400px]:justify-between min-[400px]:gap-2">
					<RedditShareButton
						title={t('components.share_modal.share.title', { appName: t('app.name') })}
						url={url!}
						about={t('components.share_modal.share.description', {
							appName: t('app.name'),
							websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL
						})}
					>
						<Image
							unoptimized
							src="/images/icons/reddit.webp"
							alt="Share on Reddit"
							width="24"
							height="24"
							className="h-8 w-8 hover:brightness-[1.10] min-[400px]:h-10 min-[400px]:w-10 dark:hover:brightness-[0.95]"
						/>
					</RedditShareButton>
					<FacebookShareButton url={url!} hashtag={`#${t('app.name')}`}>
						<Image
							unoptimized
							src="/images/icons/facebook.svg"
							alt="Share on Facebook"
							width="24"
							height="24"
							className="h-8 w-8 hover:brightness-[1.10] min-[400px]:h-10 min-[400px]:w-10 dark:hover:brightness-[0.95]"
						/>
					</FacebookShareButton>
					<TwitterShareButton
						title={t('components.share_modal.share.title', { appName: t('app.name') })}
						hashtags={[t('app.name'), 'ai avatars', 'cartoon avatars', 'avatar creator']}
						url={url!}
					>
						{_theme === 'dark' ? (
							<Image
								unoptimized
								src="/images/icons/twitter-dark.webp"
								alt="Share on X"
								width="24"
								height="24"
								className="h-8 w-8 hover:brightness-[1.10] min-[400px]:h-10 min-[400px]:w-10 dark:hover:brightness-[0.95]"
							/>
						) : (
							<Image
								unoptimized
								src="/images/icons/twitter.webp"
								alt="Share on X"
								width="24"
								height="24"
								className="h-8 w-8 hover:brightness-[1.10] min-[400px]:h-10 min-[400px]:w-10 dark:hover:brightness-[0.95]"
							/>
						)}
					</TwitterShareButton>
					<LinkedinShareButton
						title={t('components.share_modal.share.title', { appName: t('app.name') })}
						source={process.env.NEXT_PUBLIC_WEBSITE_URL}
						summary={t('components.share_modal.share.description', {
							appName: t('app.name'),
							websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL
						})}
						url={url!}
					>
						<Image
							unoptimized
							src="/images/icons/linkedin.webp"
							alt="Share on LinkedIn"
							width="24"
							height="24"
							className="h-8 w-8 hover:brightness-[1.10] min-[400px]:h-10 min-[400px]:w-10 dark:hover:brightness-[0.95]"
						/>
					</LinkedinShareButton>
					<PinterestShareButton
						title={t('components.share_modal.share.title', { appName: t('app.name') })}
						description={t('components.share_modal.share.description', {
							appName: t('app.name'),
							websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL
						})}
						media={url!}
						url={url!}
					>
						<Image
							unoptimized
							src="/images/icons/pinterest.webp"
							alt="Share on Pinterest"
							width="24"
							height="24"
							className="h-8 w-8 hover:brightness-[1.10] min-[400px]:h-10 min-[400px]:w-10 dark:hover:brightness-[0.95]"
						/>
					</PinterestShareButton>
					<TelegramShareButton title={t('components.share_modal.share.title', { appName: t('app.name') })} url={url!}>
						<Image
							unoptimized
							src="/images/icons/telegram.webp"
							alt="Share on Telegram"
							width="24"
							height="24"
							className="h-8 w-8 hover:brightness-[1.10] min-[400px]:h-10 min-[400px]:w-10 dark:hover:brightness-[0.95]"
						/>
					</TelegramShareButton>
					<WhatsappShareButton title={t('components.share_modal.share.title', { appName: t('app.name') })} url={url!}>
						<Image
							unoptimized
							src="/images/icons/whatsapp.webp"
							alt="Share on WhatsApp"
							width="24"
							height="24"
							className="h-8 w-8 hover:brightness-[1.10] min-[400px]:h-10 min-[400px]:w-10 dark:hover:brightness-[0.95]"
						/>
					</WhatsappShareButton>
				</div>
			</DialogContent>
		</Dialog>
	);
}
