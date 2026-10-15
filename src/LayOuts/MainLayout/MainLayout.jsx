import { Outlet, Navigate } from "react-router-dom";
import UserDataCard from "../../components/Home/UserDataCard";
import FollowSuggest from "../../components/Home/FollowSuggest";
import Navbar from "../../components/NavBar/NavBar";

export default function MainLayout() {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />

      <section className="container pt-5 pb-5">
        <div className="container grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          <aside className="hidden lg:block xl:sticky xl:top-20">
            <UserDataCard />
          </aside>

          <main className="min-w-0 space-y-5">
            <div className="lg:hidden">
              <UserDataCard mobile />
            </div>
            <Outlet />
          </main>

          <aside className="hidden xl:sticky xl:top-20 xl:block">
            <FollowSuggest />
          </aside>
        </div>
      </section>
    </div>
  );
}
