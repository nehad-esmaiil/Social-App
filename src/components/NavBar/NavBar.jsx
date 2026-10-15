import { useContext, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";
import { IoChatbubbleSharp } from "react-icons/io5";
import logo from "../../assets/Images/FavIcon/route.png";
import { UserContext } from "../../App";
import { Avatar } from "@heroui/react";

const itemClass = ({ isActive }) => isActive ? "nav-link-active" : "nav-link";

export default function Navbar() {
  const { userData, setUserData } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setUserData(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div className="container">
      <div className="container mx-auto flex items-center justify-between gap-2 py-1.5 sm:gap-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-9 w-9 rounded-xl object-cover" />
          <h1 className="hidden text-xl font-extrabold text-slate-900 sm:block">Route Posts</h1>
        </Link>

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
          <NavLink to="/" end className={itemClass}>
            <FaHome className="text-current font-extrabold" />
            <span className="hidden md:inline">Feed</span><span className="sr-only md:hidden">Feed</span>
          </NavLink>
          <NavLink to="/profile" className={itemClass}>
            <FaUser className="text-current font-extrabold" />
            <span className="hidden md:inline">Profile</span><span className="sr-only md:hidden">Profile</span>
          </NavLink>
          <NavLink to="/notification" className={itemClass}>
            <IoChatbubbleSharp className="text-current font-extrabold" />
            <span className="hidden md:inline">Notification</span><span className="sr-only md:hidden">Notification</span>
          </NavLink>
        </nav>

        <div className="relative" ref={menuRef}>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="primary"
            name={userData?.name || "User"}
            size="sm"
            src={userData?.photo}
            onClick={() => setOpen((value) => !value)}
          />
          {open && <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            <div className="h-14 px-4 py-2"><p className="text-sm font-semibold">Signed in as</p><p className="truncate text-xs font-semibold text-slate-500">{userData?.email}</p></div>
            <Link to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">My Profile</Link>
            <Link to="/settings" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Settings</Link>
            <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><FaSignOutAlt /> Log Out</button>
          </div>}
        </div>
      </div>
      </div>
    </header>
  );
}
