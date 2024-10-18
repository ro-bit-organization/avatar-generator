'use client';

import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';
import Typewriter from 'typewriter-effect';
import { stringSplitter } from '~/lib/utils';

type Props = {
	text: string;
	loading?: boolean;
	children?: ReactNode;
	onComplete?: () => void;
};

export default function ChatMessage({ text, loading, children, onComplete }: Props) {
	return (
		<>
			<div className="flex items-center justify-between">
				<Image src="/images/logo.webp" width="36" height="36" alt="logo" className="shrink-0 rounded-md" />
				{children}
			</div>
			<div className="flex items-center gap-2">
				<Typewriter
					options={{
						delay: 2,
						stringSplitter
					}}
					onInit={(typewriter) => {
						typewriter
							.typeString(text)
							.callFunction(() => (onComplete ? onComplete() : null))
							.start();
					}}
				/>

				{loading && <LoaderIcon className="h-4 w-4 animate-spin" />}
			</div>
		</>
	);
}
