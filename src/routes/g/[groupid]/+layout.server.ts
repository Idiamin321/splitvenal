/**
 * @type {import('@sveltejs/kit').Load}
 */
export async function load({ params, locals }) {
	return {
		props: {
			groupId: params.groupid,
			user: locals.user
		}
	};
}
