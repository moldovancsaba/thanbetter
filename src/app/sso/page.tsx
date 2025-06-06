import Link from 'next/link';

export default function SSO() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">SSO</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/sso/documentation" className="text-blue-500 hover:underline">
            SSO Documentation
          </Link>
        </li>
        <li>
          <Link href="/sso/sample" className="text-blue-500 hover:underline">
            SSO Sample Page
          </Link>
        </li>
      </ul>
    </main>
  );
}

