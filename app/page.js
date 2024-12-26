import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-12 text-center text-gray-200 drop-shadow-lg">
        Sirano
      </h1>

      {/* Links */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <Link
          href="/tables"
          className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition"
        >
          Tables
        </Link>
        <Link
          href="/drinks"
          className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
        >
          Drinks
        </Link>
      </div>
    </div>
  );
}
