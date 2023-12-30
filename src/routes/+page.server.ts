export const ssr = false;
export async function load({ params, locals }) {
	return {
		props: {
			user: locals.user,
			status: 301,
			redirect: `/`
		}
	};
}
