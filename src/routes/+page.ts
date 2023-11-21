export const ssr = false;

export async function load() {
	return {
		status: 301,
		redirect: `/`
	};
}
