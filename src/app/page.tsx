import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to ThanPerfect</h1>
      <div className="space-y-4">
        <Link 
          href="/login"
          className="block w-fit px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </Link>
        <Link 
          href="/sso"
          className="block w-fit px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          SSO
        </Link>
      </div>
    </main>
  );
}

