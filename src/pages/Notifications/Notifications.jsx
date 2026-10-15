import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MdDoneAll } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { fetchNotifications, fetchUnreadCount, markAllNotificationsRead, markNotificationRead } from "../../services/getAllNotification";

const labels = {
  like_post: "liked your post",
  comment_post: "commented on your post",
  share_post: "shared your post",
  follow_user: "followed you!",
};

function relativeTime(value) {
  const seconds = Math.floor((Date.now() - new Date(value)) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return months < 12 ? `${months}mo` : `${Math.floor(months / 12)}y`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    const [{ data: list }, { data: count }] = await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    setNotifications(list?.data?.notifications || []);
    setUnreadCount(count?.data?.unreadCount || 0);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await markNotificationRead(id);
    await load();
  };

  const markAll = async () => {
    await markAllNotificationsRead();
    await load();
  };

  const visible = filter === "unread" ? notifications.filter((item) => !item.isRead) : notifications;

  return (
    <main className="min-h-screen bg-[#F0F2F5]">
      <div className="container px-3 py-4">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-xl font-black text-slate-900 sm:text-2xl">Notifications</h2><p className="mt-1 text-sm text-slate-500">Realtime updates for likes, comments, shares, and follows.</p></div>
              <button onClick={markAll} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"><MdDoneAll className="text-xl" />Mark all as read</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button onClick={() => setFilter("all")} className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${filter === "all" ? "bg-[#1877f2] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>All</button>
              <button onClick={() => setFilter("unread")} className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition ${filter === "unread" ? "bg-[#1877f2] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>Unread {unreadCount}</button>
            </div>
          </div>

          <div className="space-y-2 p-3 sm:p-4">
            {visible.length ? visible.map((item) => (
              <NavLink key={item._id} to={item.type === "follow_user" ? `/profile/${item.entity?._id}` : `/post/${item.entity?.post || item.entity?._id}`} className={`group relative flex gap-3 rounded-xl border p-3 transition sm:rounded-2xl sm:p-4 ${item.isRead ? "border-slate-200 bg-white hover:bg-slate-50" : "border-[#dbeafe] bg-[#edf4ff]"}`}>
                <div className="relative shrink-0"><img alt={item.actor?.name} className="h-11 w-11 rounded-full object-cover" src={item.actor?.photo} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
                    <p className="text-sm leading-6 text-slate-800"><span className="cursor-pointer font-extrabold hover:text-[#1877f2] hover:underline">{item.actor?.name}</span> {labels[item.type] || "interacted with your post"}</p>
                    <div className="flex items-center gap-1.5 sm:gap-2"><span className="text-xs font-semibold text-slate-500">{relativeTime(item.createdAt)}</span></div>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">{item.entity?.body || item.entity?.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {item.isRead ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600"><FaCheck />Read</span> : <button onClick={(event) => { event.preventDefault(); event.stopPropagation(); markRead(item._id); }} className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-bold text-[#1877f2] ring-1 ring-[#dbeafe] transition hover:bg-[#e7f3ff]">Mark as read</button>}
                  </div>
                </div>
              </NavLink>
            )) : <p className="p-4 text-sm text-slate-500">No notifications yet.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
