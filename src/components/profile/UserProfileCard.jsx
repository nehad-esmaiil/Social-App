import { FaCamera, FaEnvelope, FaUsers } from "react-icons/fa";

export default function UserProfileCard({ userData, postsCounter = 0, onPhotoUpload, editable = true, action }) {
  const upload = (event) => {
    const file = event.target.files?.[0];
    if (file && onPhotoUpload) onPhotoUpload(file);
  };

  return (
    <section className="container overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
      <div className="group/cover relative h-44 rounded-2xl bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60">
        {editable && <div className="pointer-events-none absolute right-2 top-2 z-10 flex max-w-[90%] flex-wrap items-center justify-end gap-1.5 opacity-100 transition duration-200 sm:right-3 sm:top-3 sm:max-w-none sm:gap-2 sm:opacity-0 sm:group-hover/cover:opacity-100 sm:group-focus-within/cover:opacity-100">
          <label className="pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
            Add Cover photo
            <input type="file" className="hidden" accept="image/*" />
          </label>
        </div>}
      </div>

      <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
        <div className="rounded-3xl border border-white/60 bg-white/92 p-5 backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-end gap-4">
                <div className="group/avatar relative shrink-0">
                  <button type="button" className="rounded-full">
                    <img src={userData?.photo} alt={userData?.name} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]" />
                  </button>
                  {editable && <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white opacity-100 shadow-sm transition duration-200 hover:bg-[#166fe5] sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100">
                    <FaCamera />
                    <input onChange={upload} accept="image/*" className="hidden" type="file" />
                  </label>}
                </div>
                <div className="min-w-0 pb-1">
                  <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">{userData?.name}</h2>
                  <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">@{userData?.username}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">Route Posts Member</div>
                </div>
              </div>
              {action}
            </div>

            <div className="grid w-full grid-cols-3 gap-2 lg:w-130">
              <Stat label="Followers" value={userData?.followersCount || 0} />
              <Stat label="Following" value={userData?.followersCount || 0} />
              <Stat label="Bookmarks" value={userData?.bookmarksCount || 0} />
            </div>
          </div>

          <div className="my-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-extrabold text-slate-800">About</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2"><FaEnvelope />{userData?.email}</p>
                <p className="flex items-center gap-2"><FaUsers />Active on Route Posts</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Info label="My Posts" value={postsCounter} />
              <Info label="Saved Posts" value="0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">{label}</p><p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{value}</p></div>;
}

function Info({ label, value }) {
  return <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3"><p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">{label}</p><p className="mt-1 text-2xl font-black text-slate-900">{value}</p></div>;
}
