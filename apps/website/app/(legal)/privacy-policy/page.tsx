import { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();

	const title = `Privacy Policy - ${t('app.name')}`;
	const description =
		'Find out how we collect, use, and protect your personal information in our Privacy Policy. Your privacy and security are important to us.';
	const url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/privacy-policy`;

	return {
		title,
		description,
		alternates: {
			canonical: url
		},
		openGraph: {
			title,
			description,
			url,
			siteName: title,
			images: [
				{
					url: `/images/logo.png`,
					width: 512,
					height: 512
				}
			],
			locale: 'en_US',
			type: 'website'
		}
	};
}

export default async function PrivacyPolicyPage() {
	const t = await getTranslations();
	const format = await getFormatter();

	return (
		<main className="mx-auto mb-24 flex max-w-screen-lg flex-1 flex-col gap-4 px-4 pt-12">
			<h1 className="text-4xl">Privacy Policy</h1>
			<p>
				<strong>Last updated:</strong>{' '}
				{format.dateTime(new Date('2024-10-20'), {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</p>

			<p>
				This Privacy Policy explains how we collect, use, and share your information when you use {t('app.name')}. It also details your privacy rights
				and how we protect your information.
			</p>

			<h2>How We Use Your Data</h2>
			<p>
				We use your data to improve our services. By using {t('app.name')}, you agree to our data collection practices as described in this Privacy
				Policy.
			</p>

			<h2>Definitions</h2>
			<ul className="list-inside list-disc">
				<li>
					<strong>Account:</strong> A unique account created for you to access our services.
				</li>
				<li>
					<strong>Affiliate:</strong> Any entity that controls, is controlled by, or is under common control with a party. “Control” means ownership
					of 50% or more of the shares, equity, or other securities with voting power for election of directors or other managing authority.
				</li>
				<li>
					<strong>Country:</strong> Refers to Romania.
				</li>
				<li>
					<strong>Company</strong> (also referred to as "we," "us," or "our"): PixPersona.
				</li>
				<li>
					<strong>Cookies:</strong> Small files placed on your device to store your browsing history and other information.
				</li>
				<li>
					<strong>Device:</strong> Any device that accesses the service, such as a computer or smartphone.
				</li>
				<li>
					<strong>Personal Data:</strong> Information related to an identified or identifiable person.
				</li>
				<li>
					<strong>Service:</strong> The website, {t('app.name')}.
				</li>
				<li>
					<strong>Service Provider:</strong> A third party that processes data on behalf of the company.
				</li>
				<li>
					<strong>Third-Party Social Media Service:</strong> A social network that allows you to log in to {t('app.name')}.
				</li>
				<li>
					<strong>Usage Data:</strong> Data collected automatically when using our service.
				</li>
				<li>
					<strong>Website:</strong> {t('app.name')}, accessible at{' '}
					<Link href={process.env.NEXT_PUBLIC_WEBSITE_URL!} target="_blank" className="underline">
						{process.env.NEXT_PUBLIC_WEBSITE_URL}
					</Link>
					.
				</li>
				<li>
					<strong>You:</strong> The user of the service.
				</li>
			</ul>

			<h2>Collecting and Using Your Data</h2>
			<ul className="list-inside list-disc">
				<li>
					<strong>Personal Data:</strong> We may collect personal information such as your email address, first and last name, and usage data to
					provide and improve our services.
				</li>
				<li>
					<strong>Usage Data:</strong> We collect data like your IP address, browser type, and device information when you use our service.
				</li>
			</ul>

			<h2>Third-Party Social Media Services</h2>
			<p>
				You can create an account using social media services like Google, Facebook, Twitter, or LinkedIn. We may access and collect data associated
				with your social media account, such as your name and email address.
			</p>

			<h2>Cookies and Tracking Technologies</h2>
			<p>We use cookies and similar technologies to track activity and improve our service.</p>
			<ul className="list-inside list-disc">
				<li>
					<strong>Cookies:</strong> Small files placed on your device. You can refuse cookies, but some parts of our service may not function
					properly.
				</li>
				<li>
					<strong>Web Beacons:</strong> Small electronic files used to count users and gather website statistics.
				</li>
			</ul>

			<h3>Types of Cookies</h3>
			<ul className="list-inside list-disc">
				<li>
					<strong>Essential Cookies:</strong> Necessary for website functionality.
				</li>
				<li>
					<strong>Acceptance Cookies:</strong> Identify if users have accepted cookies.
				</li>
				<li>
					<strong>Functionality Cookies:</strong> Store your preferences for a personalized experience.
				</li>
			</ul>

			<p>For more details, please visit our Cookies Policy.</p>

			<h2>Use of Your Data</h2>
			<p>We may use your data to:</p>
			<ul className="list-inside list-disc">
				<li>Provide and maintain our service.</li>
				<li>Manage your account.</li>
				<li>Contact you about updates and offers.</li>
				<li>Analyze usage trends and improve our service.</li>
				<li>Share your information with service providers, affiliates, business partners, and other users (with your consent).</li>
			</ul>

			<h2>Data Retention</h2>
			<p>We keep your personal data as long as needed to fulfill the purposes described in this policy and comply with legal obligations.</p>

			<h2>Data Transfer</h2>
			<p>Your information may be transferred to servers outside your region. We take necessary measures to protect your data during these transfers.</p>

			<h2>Deleting Your Data</h2>
			<p>You have the right to delete your data. You can manage your information through your account settings or contact us for assistance.</p>

			<h2>Data Disclosure</h2>
			<p>We may disclose your data:</p>
			<ul className="list-inside list-disc">
				<li>In business transactions, like mergers or sales.</li>
				<li>To comply with legal obligations.</li>
				<li>To protect users, public safety, or company rights.</li>
			</ul>

			<h2>Security of Your Data</h2>
			<p>While we strive to protect your data, no method is 100% secure. We take commercially reasonable measures to secure your information.</p>

			<h2>Children’s Privacy</h2>
			<p>
				Our service is not intended for children under 13. We do not knowingly collect data from children under 13. If you become aware that a child has
				provided us with personal data, please contact us.
			</p>

			<h2>Links to Other Websites</h2>
			<p>
				We are not responsible for the privacy practices of other websites. We encourage you to review the privacy policies of third-party sites you
				visit.
			</p>

			<h2>Changes to Our Privacy Policy</h2>
			<p>We may update this policy periodically. We will notify you of significant changes and update the "Last updated" date at the top of this page.</p>

			<h2>Contact Us</h2>
			<p>
				If you have any questions about the Privacy Policy, you can reach us at: <br />
				<strong>Email</strong>:{' '}
				<Link href={`email:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} target="_blank" className="underline">
					{process.env.NEXT_PUBLIC_CONTACT_EMAIL}
				</Link>
			</p>
		</main>
	);
}
