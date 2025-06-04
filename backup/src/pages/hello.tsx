import { GetServerSideProps } from 'next';
import { getUsers } from '../utils/users';

interface User {
  username: string;
  registrationTime: string;
}

interface Props {
  users: User[];
}

export default function Hello({ users }: Props) {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl mb-8">Hello World</h1>
      <div className="space-y-4">
        <h2 className="text-xl">Registered Users:</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.username} className="border p-4 rounded">
              <div>Username: {user.username}</div>
              <div>Registered: {user.registrationTime}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await getUsers();
  return {
    props: {
      users,
    },
  };
};
