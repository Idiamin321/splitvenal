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

export function deleteGroupFromLocalStorage(groupId: string) {
	const recentGroups = getRecentGroups();
	const filteredGroups = recentGroups.filter((group) => group.groupId !== groupId);
	storeAllRecentGroups(filteredGroups);
}

// function isSameGroup(oldGroup: object, newGroupId: string, newSecretKey: string, newGroupName: string) {
//     return oldGroup.groupId === newGroupId
//         && oldGroup.secretKey === newSecretKey
//         && oldGroup.groupName === newGroupName;
// }
