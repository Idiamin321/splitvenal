import { db } from '$lib/db/db.server.js';
import { fail, redirect } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});
export const load = async ({ locals, url }) => {
	const gId = url.searchParams.get('g');
	const user = locals.user;

	if (!user) {
		throw redirect(307, '/sign-in');
	}
	return { user, gId };
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

		const buffer = Buffer.from(await file.arrayBuffer());

		const photoUrl = await cloudinaryUpload(buffer);
		console.log(photoUrl);
		await db.user.update({
			where: { id: userId },
			data: {
				profilePic: photoUrl.result.url
			}
		});

		return {
			success: true
		};
	}
};

async function cloudinaryUpload(file: any) {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload_stream({ resource_type: 'image' }, onDone).end(file);
		function onDone(error, result) {
			if (error) {
				return reject({ success: false, error });
			}
			return resolve({ success: true, result });
		}
	});
}
