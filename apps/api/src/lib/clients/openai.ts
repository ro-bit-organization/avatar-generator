import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
	throw new Error('Could not initialize the OpenAI client!');
}

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

export default client;
