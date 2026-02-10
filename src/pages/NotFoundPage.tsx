import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found.</p>
      <Link to="/" className="mt-6 text-blue-600 hover:underline">
        Go home
      </Link>
    </div>
  );
}
