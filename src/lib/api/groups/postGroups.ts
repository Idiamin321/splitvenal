export async function postGroupToServer(groupId: any, secretKey: any, groupName: any) {
	const response = await fetch('/api/groups', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			groupId,
			secretKey,
			groupName
		})
	});

	const groups = await response.json();
	return groups;
}
