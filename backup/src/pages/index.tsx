import { NextPage } from 'next';
import LoginForm from '../components/LoginForm';

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <h1 className="text-2xl mb-4 text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default HomePage;
