'use client';

import { Button } from '~/components/ui/button';
import { resetCookiePreference } from '~/lib/actions/cookie-preference-reset';

export default function CookiePreferenceReset() {
	return (
		<p>
			To reset your cookie preferences or restore default settings,{' '}
			<Button
				type="submit"
				variant="link"
				className="text-md h-[24px] p-0 underline underline-offset-1"
				onClick={async () => {
					await resetCookiePreference();
					window.location.reload();
				}}
			>
				click here
			</Button>
			.
		</p>
	);
}
