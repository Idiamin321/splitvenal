/**
 * @type {import('@sveltejs/kit').Load}
 */
export const ssr = false;
export async function load({ params }) {
	return {
		props: {
			groupId: params.groupid
		}
	};
}
