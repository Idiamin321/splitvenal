import { getGroups } from '$lib/db/groups';
import { json } from '@sveltejs/kit';

export async function GET() {
	const groups = await getGroups();
	return json(groups);
}
