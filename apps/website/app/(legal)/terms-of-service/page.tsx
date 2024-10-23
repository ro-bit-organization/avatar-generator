import { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();

	const title = `Terms of Service - ${t('app.name')}`;
	const description =
		'Review our Terms and Conditions to understand the rules and guidelines for using our services, including your rights, responsibilities, and our policies.';
	const url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/terms-of-service`;

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

export default async function TermsOfService() {
	const t = await getTranslations();
	const format = await getFormatter();

	return (
		<main className="mx-auto mb-24 flex max-w-screen-lg flex-1 flex-col gap-4 px-4 pt-12">
			<h1 className="text-4xl">Terms and Conditions</h1>
			<p>
				<strong>Last updated:</strong>{' '}
				{format.dateTime(new Date('2024-10-20'), {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</p>
			<p>Please read these terms and conditions thoroughly before using our service.</p>

			<h2>Interpretation and Definitions</h2>
			<h3>Interpretation</h3>
			<p>
				Words with capitalized letters carry specific meanings as defined below. The same meanings apply whether they appear in singular or plural form.
			</p>

			<h3>Definitions</h3>
			<ul className="list-inside list-disc">
				<li>
					<strong>Affiliate</strong>: Any entity that controls, is controlled by, or is under common control with a party. “Control” means ownership
					of 50% or more of the shares, equity, or other securities with voting power for election of directors or other managing authority.
				</li>
				<li>
					<strong>Country</strong>: Refers to Romania.
				</li>
				<li>
					<strong>Company</strong> (also referred to as "we," "us," or "our"): PixPersona.
				</li>
				<li>
					<strong>Device</strong>: Any device that can access the service, including computers, cellphones, or tablets.
				</li>
				<li>
					<strong>Service:</strong> The website, {t('app.name')}.
				</li>
				<li>
					<strong>Terms and Conditions</strong> (also referred to as "Terms"): This agreement between you and the company regarding the use of the
					service.
				</li>
				<li>
					<strong>Third-party Social Media Service</strong>: Any content, data, products, or services provided by third parties that may be displayed
					or made available through the service.
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

			<h2>Acceptance of Terms</h2>
			<p>
				These terms govern the use of our service and form the agreement between you and us. They set out the rights and responsibilities of all users.
			</p>
			<p>
				By using or accessing our service, you agree to abide by these terms. If you disagree with any part, please refrain from accessing the service.
			</p>
			<p>
				Your use of the service is also subject to our Privacy Policy, which outlines how we collect, use, and protect your personal information. Please
				review it carefully before proceeding.
			</p>

			<h2>Refund Policy</h2>
			<p>
				By purchasing credits on this site, you acknowledge and agree to our refund policy. You accept that AI-generated avatars may have limitations,
				such as inaccuracies with letters, deformed results, or misinterpretation of prompts. By purchasing, you understand and accept that not all
				avatars will be perfect.
			</p>

			<h2>Links to Other Websites</h2>
			<p>
				Our service may contain links to third-party websites or services we do not own or control. We are not responsible for the content, privacy
				policies, or practices of any third-party sites. You agree that we are not liable for any damages or losses incurred by using such third-party
				content, products, or services.
			</p>
			<p>We recommend reviewing the terms and privacy policies of any third-party websites you visit.</p>

			<h2>Avatar Generation</h2>
			<p>We may use avatars generated by you to promote our service across various channels, including online ads, physical ads, and social media.</p>

			<h2>Termination</h2>
			<p>
				We reserve the right to suspend or terminate your access immediately, without prior notice, for any reason, including if you breach these terms.
			</p>
			<p>Upon termination, your right to use the service will cease immediately.</p>

			<h2>Limitation of Liability</h2>
			<p>
				Our service uses AI technology provided by OpenAI to generate avatars. It is your responsibility to review copyright laws relevant to
				AI-generated art in your jurisdiction. We are not liable for the images generated or any damages or losses resulting from them.
			</p>
			<p>If you experience damages, our total liability is limited to the amount you paid for the service or $100 if no payment was made.</p>
			<p>
				To the fullest extent permitted by law, we and our suppliers are not responsible for any special, incidental, indirect, or consequential damages
				(including loss of profits, data, or privacy) related to the use or inability to use the service, even if advised of such damages.
			</p>
			<p>
				Some jurisdictions may not permit the exclusion of certain warranties or limitations on liability. In these cases, our liability will be limited
				to the maximum extent allowed by law.
			</p>

			<h2>"AS IS" and "AS AVAILABLE" Disclaimer</h2>
			<p>
				Our service is provided "as is" and "as available" without warranties of any kind. To the fullest extent permitted by law, we disclaim all
				warranties, including those of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee the service will
				meet your needs, be error-free, or be compatible with other systems.
			</p>
			<p>
				We also do not guarantee the accuracy, reliability, or availability of the service, nor that it will be free from harmful components like
				viruses or malware.
			</p>
			<p>Some jurisdictions may not allow these exclusions, so some of the above limitations may not apply to you.</p>

			<h2>Governing Law</h2>
			<p>
				These terms are governed by the laws of Romania, excluding its conflict of law rules. You may also be subject to other local, state, national,
				or international laws based on your location.
			</p>

			<h2>Dispute Resolution</h2>
			<p>If you have concerns or disputes, you agree to try resolving them informally by contacting us first.</p>

			<h2>EU Users</h2>
			<p>If you are an EU resident, you will benefit from any mandatory provisions of your local laws.</p>

			<h2>Compliance with U.S. Laws</h2>
			<p>
				You confirm that you are not located in a country subject to a U.S. government embargo or listed as a "terrorist-supporting" country. You also
				affirm that you are not on any U.S. government list of prohibited or restricted parties.
			</p>

			<h2>Severability and Waiver</h2>
			<h3>Severability</h3>
			<p>
				If any part of these terms is found to be unenforceable, the remaining sections will remain in effect. The unenforceable provision will be
				modified to achieve its intent as closely as possible.
			</p>

			<h3>Waiver</h3>
			<p>Failure to enforce any right or obligation does not waive the right to enforce it in the future.</p>

			<h2>Translation</h2>
			<p>If these terms are translated into other languages, the English version will prevail in the event of a dispute.</p>

			<h2>Changes to These Terms</h2>
			<p>
				We may update these terms at our discretion. If the changes are significant, we will provide at least 30 days' notice before they take effect.
				By continuing to use the service after revisions, you agree to the new terms. If you do not agree, please stop using the service.
			</p>

			<h2>Contact Us</h2>
			<p>
				If you have any questions about Terms of Service, you can reach us at: <br />
				<strong>Email</strong>:{' '}
				<Link href={`email:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} target="_blank" className="underline">
					{process.env.NEXT_PUBLIC_CONTACT_EMAIL}
				</Link>
			</p>
		</main>
	);
}
