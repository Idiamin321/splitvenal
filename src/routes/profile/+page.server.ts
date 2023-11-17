import { db } from '$lib/db/db.server.js';
import { fail, redirect } from '@sveltejs/kit';
import fs from 'fs';
export const load = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(307, '/sign-in');
	}
	return { user };
};

export const actions = {
	logout: async ({ cookies }) => {
		cookies.delete('AuthorizationToken');
		throw redirect(302, '/sign-in');
	},
	upload: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('user-id');
		const file = formData.get('file-upload');

		if (!(file instanceof Object) || !file.name) {
			return fail(400, { missing: true });
		}

		const filename = Date.now() + '-' + file.name;
		const filepath = `upload/${filename}`;

		const buffer = Buffer.from(await file.arrayBuffer());
		fs.writeFileSync(`static/${filepath}`, buffer, 'base64');
		await db.user.update({
			where: { id: userId },
			data: {
				profilePic: filepath
			}
		});
		return {
			success: true
		};
	}
};
