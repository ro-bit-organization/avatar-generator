'use client';

import { LoaderIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ReactNode, useEffect, useRef } from 'react';
import Typewriter, { TypewriterClass } from 'typewriter-effect';
import { cn, stringSplitter } from '~/lib/utils';

type Props = {
	text: string;
	loading?: boolean;
	children?: ReactNode;
	classNames?: { text?: string };
	onComplete?: () => void;
};

export default function ChatMessage({ text, loading, children, classNames, onComplete }: Props) {
	const t = useTranslations();
	const typewriter = useRef<TypewriterClass | null>(null);
	const skipped = useRef<boolean>(false);
	const completed = useRef<boolean>(false);

	const stopTyping = () => {
		if (!typewriter?.current) {
			return;
		}

		const { cursor, wrapper } = (typewriter.current as any).state.elements;
		wrapper.innerHTML = text;

		cursor.setAttribute('hidden', 'hidden');
		typewriter.current.stop();

		skipped.current = true;
		completed.current = true;

		if (onComplete) {
			onComplete();
		}

		clearEvent();
	};

	function clearEvent() {
		document.removeEventListener('click', stopTyping);
	}

	useEffect(() => {
		document.addEventListener('click', stopTyping);

		return clearEvent;
	}, []);

	return (
		<>
			<div className="flex items-center justify-between">
				<Image unoptimized src="/images/logo.webp" width="36" height="36" alt="Logo" className="shrink-0 rounded-md" />
				{children}
			</div>
			<div className="flex items-center gap-2">
				<Typewriter
					options={{
						delay: 15,
						wrapperClassName: cn('Typewriter__wrapper', classNames?.text),
						stringSplitter
					}}
					onInit={(_typewriter) => {
						typewriter.current = _typewriter;

						_typewriter
							.typeString(text)
							.callFunction(() => {
								completed.current = true;

								if (skipped.current) {
									return;
								}

								if (onComplete) {
									onComplete();
								}

								clearEvent();
							})
							.start();
					}}
				/>

				{loading && <LoaderIcon className="h-4 w-4 animate-spin" />}
			</div>
			{!completed.current && <span className="text-muted-foreground text-end text-sm">{t('generate.common.skip_message')}</span>}
		</>
	);
}
