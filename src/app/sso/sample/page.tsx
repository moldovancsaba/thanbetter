import { useState } from 'react';

export default function SSOSample() {
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    const response = await fetch('/api/auth/sso-login');
    const data = await response.json();
    setToken(data.token);
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">SSO Sample</h1>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleLogin}
      >
        SSO Login
      </button>
      {token && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Token</h2>
          <p>{token}</p>
        </div>
      )}
    </main>
  );
}

