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
