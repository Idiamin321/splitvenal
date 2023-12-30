import { addGroup, getGroups } from '$lib/db/groups';
import { json } from '@sveltejs/kit';

export async function GET() {
	const groups = await getGroups();
	return json(groups);
}

export async function POST({ request }) {
	const { groupId, secretKey, groupName } = await request.json();
	const createdGroup = addGroup(groupId, secretKey, groupName);

	return json(createdGroup);
}
