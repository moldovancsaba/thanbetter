import fs from 'fs/promises';
import path from 'path';

const USER_FILE_PATH = path.join(process.cwd(), 'data', 'users.json');

interface User {
  username: string;
  registrationTime: string;
}

export async function ensureUserFile() {
  try {
    await fs.access(USER_FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(USER_FILE_PATH), { recursive: true });
    await fs.writeFile(USER_FILE_PATH, JSON.stringify([]));
  }
}

export async function getUsers(): Promise<User[]> {
  await ensureUserFile();
  const data = await fs.readFile(USER_FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function addUser(username: string, timestamp: string): Promise<User> {
  const users = await getUsers();
  const newUser = {
    username,
    registrationTime: timestamp
  };
  
  await fs.writeFile(USER_FILE_PATH, JSON.stringify([...users, newUser], null, 2));
  return newUser;
}
