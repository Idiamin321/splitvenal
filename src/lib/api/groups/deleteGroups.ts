export async function deleteGroupFromDatabase(groupId: string) {
	try {
		const response = await fetch(`/api/groups/${groupId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			const result = await response.json();
			console.log(result.body.message);
		} else {
			const errorResult = await response.json();
			console.error(`Error deleting group: ${errorResult.error}`);
		}
	} catch (error) {
		console.error('Error:', error);
	}
}
