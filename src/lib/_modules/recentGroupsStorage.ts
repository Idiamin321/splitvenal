import { deleteGroupFromDatabase } from '$lib/api/groups/deleteGroups';
import { getGroupsFromServer } from '$lib/api/groups/getGroups';
import { postGroupToServer } from '$lib/api/groups/postGroups';
import { MAX_RECENT_GROUPS_AMNT, RECENT_GROUPS_KEY } from './constants';

export function storeRecentGroup(groupId: string, secretKey: string, groupName: string) {
	const recentGroups: object[] = getRecentGroups();
	const otherGroups = recentGroups.filter((value) => value.groupId !== groupId);
	otherGroups.unshift({ groupId, secretKey, groupName });
	otherGroups.splice(MAX_RECENT_GROUPS_AMNT);
	storeAllRecentGroups(otherGroups);
}

export function getRecentGroups(): object[] {
	return JSON.parse(localStorage.getItem(RECENT_GROUPS_KEY) || '[]');
}

function storeAllRecentGroups(recentGroups: object[]) {
	localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(recentGroups));
}

export async function syncGroups() {
	const localGroups: object[] = getRecentGroups();
	const dbGroups = await getGroupsFromServer();
	
	dbGroups.forEach((dbGroup) => {
		const existsLocally = localGroups.some((localGroup) => localGroup.groupId === dbGroup.groupId);
		if (!existsLocally) {
			localGroups.push({
				groupId: dbGroup.groupId,
				secretKey: dbGroup.secretKey,
				groupName: dbGroup.groupName
			});
		}
	});

	storeAllRecentGroups(localGroups);
}

export async function startSyncInBackground() {
	await syncGroups();
	getRecentGroups();
	console.log('Groups synchronized successfully.');
}

export async function deleteGroupFromLocalStorage(groupId: string) {
	const recentGroups = JSON.parse(localStorage.getItem(RECENT_GROUPS_KEY) || '[]');
	const filteredGroups = recentGroups.filter(
		(group: { groupId: string }) => group.groupId !== groupId
	);

	try {
		await deleteGroupFromDatabase(groupId);
		storeAllRecentGroups(filteredGroups);
		console.log(`Group with ID ${groupId} deleted from the database.`);
	} catch (error) {
		console.error(`Error deleting group from the database: ${error}`);
	}
}

// function isSameGroup(oldGroup: object, newGroupId: string, newSecretKey: string, newGroupName: string) {
//     return oldGroup.groupId === newGroupId
//         && oldGroup.secretKey === newSecretKey
//         && oldGroup.groupName === newGroupName;
// }
