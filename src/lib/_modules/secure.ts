import type { IGunChainReference } from 'gun/types/chain';
import { getSEA } from './initGun';
import { redirectToError } from './utils';

const SEA = getSEA();

export async function putSecure(
	node: IGunChainReference<any>,
	payload: any,
	secretKey: string,
	callback: Function
) {
	const secretPayload = await SEA.encrypt(payload, secretKey);

	node.put(secretPayload, callback);
}

export async function deleteSecure(node: IGunChainReference<any>, callback: Function) {
	node.put(null, callback);
}

export async function onSecure(node, secretKey: string, callback, emptyCallback) {
	node.on(async (data, key) => {
		if (data) {
			const plain = await handleDecrypt(data, secretKey);
			callback(plain, key);
		} else {
			emptyCallback(key);
		}
	});
}

async function handleDecrypt(payload, secretKey) {
	let res = undefined;
	res = await SEA.decrypt(payload, secretKey);
	if (!res) {
		console.error('Error decrypting payload, showing error...', SEA.err);
		redirectToError(
			'wrong key on URL, please check if you copied the link correctly and try again'
		);
	}
	return res;
}

export async function setSecure(node, payload: any, secretKey: string) {
	const secretPayload = await SEA.encrypt(payload, secretKey);
	node.set(secretPayload);
}
