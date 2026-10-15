import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { IoMdPersonAdd } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { getFollowSuggestions } from "../../services/getFollowSuggestions";
import { toggleFollow } from "../../services/followUsers";

export default function FollowSuggest() {
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const loadSuggestions = () => getFollowSuggestions()
    .then(({ data }) => setUsers(data?.data?.suggestions?.slice(0, 5) || []))
    .catch(() => setUsers([]));

  useEffect(() => {
    loadSuggestions();
  }, []);

  const follow = async (userId) => {
    try {
      setLoadingId(userId);
      await toggleFollow(userId);
      await loadSuggestions();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2"><FiUsers /><h3>Suggested Users</h3></div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">5</span>
      </div>
      {users.map((user) => (
        <div className="space-y-3" key={user._id}>
          <div className="rounded-xl border border-slate-200 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <NavLink to={`/profile/${user._id}`} className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-slate-50">
                <img src={user.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900 hover:underline">{user.name}</p><p className="truncate text-xs text-slate-500">@{user.username}</p></div>
              </NavLink>
              <button onClick={() => follow(user._id)} disabled={loadingId === user._id} className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#e7f3ff] px-3 py-1.5 text-xs font-bold text-[#1877f2] transition hover:bg-[#d8ebff] disabled:opacity-60">
                {loadingId === user._id ? <span className="mr-0.5 animate-spin">⏳</span> : <IoMdPersonAdd className="mr-0.5" />}{loadingId === user._id ? "Following..." : "Follow"}
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-slate-500">
              {user.followersCount > 0 && <span className="rounded-full bg-slate-100 px-2 py-0.5">{user.followersCount} Followers</span>}
              {user.mutualFollowersCount > 0 && <span className="rounded-full bg-[#edf4ff] px-2 py-0.5 text-[#1877f2]">{user.mutualFollowersCount} Mutual</span>}
            </div>
          </div>
        </div>
      ))}
      <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100">View more</button>
    </div>
  );
}
