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

export async function getRecentGroups(): Promise<object[]> {
	const groups = JSON.parse(localStorage.getItem(RECENT_GROUPS_KEY) || '[]');
	if (groups.length === 0) {
		const groupsDb = await getGroupsFromServer();
		storeAllRecentGroups(groupsDb);
		return groupsDb;
	}
	console.log(groups);

	return groups;
}

function storeAllRecentGroups(recentGroups: object[]) {
	localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(recentGroups));
}

export async function syncGroups() {
	const localGroups: object[] = await getRecentGroups();
	const dbGroups = await getGroupsFromServer();

	localGroups.forEach(async (localGroup) => {
		const existsInDB = dbGroups.some((dbGroup) => dbGroup.groupId === localGroup.groupId);
		if (!existsInDB) {
			await postGroupToServer(localGroup.groupId, localGroup.secretKey, localGroup.groupName);
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
}

const SYNC_INTERVAL = 3000;

export function startSyncInBackground() {
	setTimeout(async () => {
		await syncGroups();
		console.log('Groups synchronized successfully.');
	}, SYNC_INTERVAL);
}

// function isSameGroup(oldGroup: object, newGroupId: string, newSecretKey: string, newGroupName: string) {
//     return oldGroup.groupId === newGroupId
//         && oldGroup.secretKey === newSecretKey
//         && oldGroup.groupName === newGroupName;
// }
