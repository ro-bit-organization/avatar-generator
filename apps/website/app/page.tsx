import Features from '~/components/landing/features';
import Hero from '~/components/landing/hero';
import HowItWorks from '~/components/landing/how-it-works';

export default function Home() {
	return (
		<main className="flex-1">
			<Hero />
			<Features />
			<HowItWorks />
		</main>
	);
}
