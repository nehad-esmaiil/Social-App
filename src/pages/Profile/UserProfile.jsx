import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEnvelope, FaUsers } from "react-icons/fa";
import UserPosts from "../../components/profile/UserPosts";
import { fetchUserProfile } from "../../services/user";
import { getUserPosts } from "../../services/UserPosts";
import { toggleFollow } from "../../services/followUsers";

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchUserProfile(id), getUserPosts(id)]).then(([profileResponse, postsResponse]) => {
      const data = profileResponse.data?.data;
      setProfile(data?.user || null);
      setFollowing(Boolean(data?.isFollowing));
      setPosts(postsResponse?.data?.posts || []);
    });
  }, [id]);

  const follow = async () => {
    try {
      setFollowLoading(true);
      await toggleFollow(id);
      setFollowing((value) => !value);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="container py-4">
        <section className="container overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
          {profile?.cover ? <img src={profile.cover} alt={profile.name} className="relative h-44 w-full rounded-2xl object-cover sm:h-52 lg:h-60" /> : <div className="group/cover relative h-44 rounded-2xl bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60" />}
          <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
            <div className="rounded-3xl border border-white/60 bg-white/92 p-5 backdrop-blur-xl sm:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0"><div className="flex items-end gap-4"><div className="group/avatar relative shrink-0"><button type="button" className="cursor-zoom-in rounded-full"><img src={profile?.photo} alt={profile?.name} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]" /></button></div><div className="min-w-0 pb-1"><h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">{profile?.name}</h2><p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">@{profile?.username}</p><div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">Route Posts Member</div></div></div></div>
                <div className="flex w-full flex-wrap gap-2 lg:w-130">
                  <Stat label="Followers" value={profile?.followersCount || 0} />
                  <Stat label="Following" value={profile?.followingCount || 0} />
                  {following ? <button onClick={follow} disabled={followLoading} className="group flex min-w-20 flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center hover:bg-gray-200 sm:px-4 sm:py-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-sm"><span className="group-hover:hidden">Followed ✔</span><span className="hidden text-red-500 group-hover:block">UnFollow</span></p></button> : <button onClick={follow} disabled={followLoading} className="flex min-w-20 flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#d7e7ff] bg-[#eef6ff] px-3 py-3 text-center hover:bg-gray-200 sm:px-4 sm:py-4"><p className="text-[11px] font-bold uppercase tracking-wide text-[#0b57d0] sm:text-sm">Follow</p></button>}
                </div>
              </div>
              <div className="my-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><h3 className="text-sm font-extrabold text-slate-800">About</h3><div className="mt-3 space-y-2 text-sm text-slate-600"><p className="flex items-center gap-2"><FaEnvelope />{profile?.email}</p><p className="flex items-center gap-2"><FaUsers />Active on Route Posts</p></div></div>
                <div><div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3"><p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">{profile?.name} Posts</p><p className="mt-1 text-2xl font-black text-slate-900">{posts.length}</p></div></div>
              </div>
            </div>
          </div>
        </section>
        <section><div className="space-y-3 pt-3">{posts.length ? <div className="m-auto space-y-5 lg:w-[60%]"><UserPosts posts={posts} loading={false} /></div> : <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">{profile?.name} has not posted yet.</p>}</div></section>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return <div className="min-w-20 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">{label}</p><p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{value}</p></div>;
}
