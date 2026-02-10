import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageWrapper() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
