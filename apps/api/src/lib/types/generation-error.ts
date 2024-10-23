import { StatusCode } from 'hono/utils/http-status';

export default class GenerationError extends Error {
	message: string;
	status: StatusCode;

	constructor(message: string, status: StatusCode = 500) {
		super();

		this.message = message;
		this.status = status;
	}
}
