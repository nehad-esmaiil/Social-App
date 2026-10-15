import { NavLink } from "react-router-dom";
import { MdArticle } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import { TbWorld } from "react-icons/tb";
import { FaRegBookmark } from "react-icons/fa";

export default function SidebarNav({ mobile = false }) {
  const menuItems = [
    { name: "Feed", path: "/", icon: <MdArticle /> },
    {
      name: "My Posts",
      path: "/myPosts",
      icon: <BsStars />,
    },
    { name: "Community", path: "/community", icon: <TbWorld /> },
    { name: "Saved", path: "/saved", icon: <FaRegBookmark /> },
  ];

  const links = menuItems.map((item) => (
    <NavLink
      key={item.name}
      to={item.path}
      end
      className={({ isActive }) => mobile
        ? `${isActive ? "bg-[#e7f3ff] text-[#1877f2]" : "text-slate-700 hover:bg-slate-100"} flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold`
        : isActive ? "tabs-btn-active flex items-center gap-3" : "tabs-btn flex items-center gap-3"
      }
    >
      <span className="flex w-5 shrink-0 items-center justify-center text-lg font-extrabold">{item.icon}</span>
      <span>{item.name}</span>
    </NavLink>
  ));

  if (mobile) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><div className="grid grid-cols-2 gap-2">{links}</div></div>;
  }

  return <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">{links}</div>;
}
