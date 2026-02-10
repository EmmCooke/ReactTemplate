import { Link, NavLink } from "react-router";

export function Header() {
  return (
    <header className="border-b bg-white px-6 py-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          App
        </Link>
        <ul className="flex gap-6">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "font-medium text-blue-600" : "text-gray-600 hover:text-gray-900"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "font-medium text-blue-600" : "text-gray-600 hover:text-gray-900"
              }
            >
              Dashboard
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
