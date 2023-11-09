import { serialize } from 'cookie';
import { createSession, getUserByEmail } from './_db';

interface User {
	email: string;
	password: string;
}

interface Session {
	id: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const post = async ({ request }: any) => {
	const { email, password } = (await request.json()) as { email: string; password: string };
	const user = (await getUserByEmail(email)) as User | null;
	// ⚠️ CAUTION: Do not store a plain password like this. Use proper hashing and salting.
	if (!user || user.password !== password) {
		return {
			status: 401,
			body: {
				message: 'Incorrect user or password'
			}
		};
	}
	const { id } = (await createSession(email)) as Session;
	return {
		status: 200,
		headers: {
			'Set-Cookie': serialize('session_id', id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // one week
			})
		},
		body: {
			user: {
				email
			}
		}
	};
};
