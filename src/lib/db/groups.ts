import { RECENT_GROUPS_KEY } from '$lib/_modules/constants';
import { getRecentGroups } from '$lib/_modules/recentGroupsStorage';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addGroup(groupId: string, secretKey: string, groupName: string) {
	const existingGroup = await prisma.group.findUnique({
		where: {
			groupId: groupId
		}
	});

	if (existingGroup) {
		throw new Error('Group with the same groupId already exists');
	}

	return prisma.group.create({
		data: {
			groupId,
			secretKey,
			groupName
		}
	});
}

export async function getGroups() {
	return prisma.group.findMany();
}

export async function syncGroups() {
	const localGroups: object[] = getRecentGroups();
	const dbGroups = await getGroups();

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

	localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(localGroups));
	console.log('Groups synchronized successfully.');
}
