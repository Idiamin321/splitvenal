import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addGroup(groupId: string, secretKey: string, groupName: string) {
	const existingGroup = await prisma.group.findUnique({
		where: {
			groupId: groupId
		}
	});

	if (existingGroup) {
		return { message: 'Group with the same groupId already exists' };
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

export async function deleteGroups(groupId) {
	const existingGroup = await prisma.group.findUnique({
		where: {
			groupId: groupId
		}
	});

	if (!existingGroup) {
		return {
			status: 404,
			body: { message: 'Group Not found ' + JSON.stringify(existingGroup) }
		};
	}
	await prisma.group.delete({
		where: { groupId: groupId }
	});

	return {
		status: 200,
		body: { message: `Group with ID ${groupId} deleted successfully.` }
	};
}
