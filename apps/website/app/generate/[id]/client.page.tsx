'use client';

import { Prisma } from '@repo/db';
import FinalizedGeneration from '~/components/generations/finalized-generation';
import FreshGeneration from '~/components/generations/fresh-generation';
import OngoingGeneration from '~/components/generations/ongoing-generation';
import { MAX_GENERATIONS } from '~/lib/const';

/* eslint-disable @typescript-eslint/no-unused-vars */
const Generation = Prisma.validator<Prisma.GenerationDefaultArgs>()({
	include: {
		entries: true
	}
});

type Props = {
	generation: Prisma.GenerationGetPayload<typeof Generation>;
};

export default function Generate({ generation }: Props) {
	if (generation.entries.length === MAX_GENERATIONS) {
		return <FinalizedGeneration generation={generation} />;
	}

	if (generation.entries.length > 0) {
		return <OngoingGeneration generation={generation} />;
	}

	return <FreshGeneration generation={generation} />;
}
