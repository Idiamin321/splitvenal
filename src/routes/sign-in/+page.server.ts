import { fail, redirect } from '@sveltejs/kit';
import { setAuthToken } from '../../lib/db/helpers';
import { loginUser } from '../../lib/db/user';

export const load = async ({ locals }) => {
	const user = locals.user;

	if (user) {
		throw redirect(307, '/');
	}
	return { user };
};

export const actions = {
	login: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { email, password } = formData;

		const { error, token } = await loginUser(email, password);

		if (error) {
			return fail(500, { error });
		}

		setAuthToken({ cookies, token });

		throw redirect(302, '/');
	}
};
