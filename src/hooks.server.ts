import { JWT_ACCESS_SECRET } from '$env/static/private';
import { db } from '$lib/db/db.server';
import jwt from 'jsonwebtoken';

export const handle = async ({ event, resolve }) => {
	const authCookie = event.cookies.get('AuthorizationToken');

	if (authCookie) {
		const token = authCookie.split(' ')[1];

		try {
			const jwtUser = jwt.verify(token, JWT_ACCESS_SECRET);
			const user = await db.user.findUnique({
				where: {
					id: jwtUser.id
				},
				select: {
					id: true,
					email: true,
					profilePic: true
				}
			});

			if (user) {
				event.locals.user = user;
			}
		} catch (error) {
			console.log(error);
		}
	}
	return await resolve(event);
};
