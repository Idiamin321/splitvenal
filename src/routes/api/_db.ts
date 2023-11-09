import { v4 as uuidv4 } from 'uuid';

interface User {
	email: string;
	password: string;
}

interface Session {
	id: string;
	email: string;
}

const users: User[] = [
	{
		email: 'owner@owner.com',
		// ⚠️ CAUTION: Do not store a plain password like this. Use proper hashing and salting.
		password: 'owner123'
	}
];

let sessions: Session[] = [];

export const getUserByEmail = async (email: string): Promise<User | null> => {
	const existingUser = users.find((user) => user.email === email);
	if (!existingUser) return Promise.resolve(null);
	return Promise.resolve(existingUser);
};

export const registerUser = (user: User): Promise<User> => {
	const existingUser = users.find((u) => u.email === user.email);
	if (existingUser) return Promise.reject(new Error('User already exists'));
	users.push(user);
	return Promise.resolve(user);
};

export const createSession = (email: string): Promise<Session> => {
	const session: Session = {
		id: uuidv4(),
		email
	};
	sessions.push(session);
	return Promise.resolve(session);
};

export const getSession = (id: string): Promise<Session | null> => {
	const session = sessions.find((session) => session.id === id);
	if (!session) return Promise.resolve(null);
	return Promise.resolve(session);
};

export const removeSession = (id: string): Promise<Session> => {
	const session = sessions.find((session) => session.id === id);
	if (!session) return Promise.reject(new Error('Session not found'));
	sessions = sessions.filter((session) => session.id !== id);
	return Promise.resolve(session);
};
