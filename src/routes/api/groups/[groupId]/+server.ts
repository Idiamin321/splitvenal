import { deleteGroups } from '$lib/db/groups.js';
import { json } from '@sveltejs/kit';

export async function DELETE({ params: { groupId } }) {
	const deletedGroup = await deleteGroups(groupId);
	return json(deletedGroup);
}
