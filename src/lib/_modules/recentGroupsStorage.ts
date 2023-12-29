import { getGroupsFromServer } from '$lib/api/groups/getGroups';
import { addGroup } from '$lib/db/groups';
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

	localGroups.forEach((localGroup) => {
		const existsInDB = dbGroups.some((dbGroup) => dbGroup.groupId === localGroup.groupId);
		if (!existsInDB) {
			addGroup(localGroup.groupId, localGroup.secretKey, localGroup.groupName);
		}
	});

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
	console.log('Groups synchronized successfully.');
}

// function isSameGroup(oldGroup: object, newGroupId: string, newSecretKey: string, newGroupName: string) {
//     return oldGroup.groupId === newGroupId
//         && oldGroup.secretKey === newSecretKey
//         && oldGroup.groupName === newGroupName;
// }
