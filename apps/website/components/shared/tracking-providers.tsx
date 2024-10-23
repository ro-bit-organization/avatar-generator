import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { cookies } from 'next/headers';
import CookieConsent from '~/components/shared/cookie-consent';
import FacebookPixel from '~/components/shared/facebook-pixel';

export default function TrackingProviders() {
	const allowTracking = cookies().get('allow-tracking-consent');

	return (
		<>
			<CookieConsent />
			{allowTracking ? (
				<>
					{process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />}
					{process.env.NEXT_PUBLIC_G_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_G_ID} />}
					{process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && <FacebookPixel pixelId={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID} />}{' '}
				</>
			) : null}
		</>
	);
}
