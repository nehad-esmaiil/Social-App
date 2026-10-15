import { useContext, useRef, useState } from "react";
import { FaImage, FaPaperPlane, FaRegSmile } from "react-icons/fa";
import { MdPublic } from "react-icons/md";
import { UserContext } from "../../App";
import { AddPost } from "../../services/createPost";
import fallbackAvatar from "../../assets/Images/HomeImgs/defaultProfile.png";
import { Button } from "@heroui/react";

export default function PostCreateCard() {
  const { userData } = useContext(UserContext);
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [audience, setAudience] = useState("public");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const submit = async () => {
    if (!body.trim() && !image) return;
    const data = new FormData();
    if (body.trim()) data.append("body", body.trim());
    if (image) data.append("image", image);
    data.append("privacy", audience);
    setLoading(true);
    try {
      await AddPost(data);
      setBody("");
      setImage(null);
      if (fileRef.current) fileRef.current.value = "";
      window.dispatchEvent(new Event("refreshPosts"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <img src={userData?.photo || fallbackAvatar} alt="profile-pic" className="h-11 w-11 rounded-full object-cover" />
        <div className="flex-1">
          <p className="text-base font-extrabold text-slate-900">{userData?.name || "Route User"}</p>
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
            <MdPublic className="text-sm" />
            <select value={audience} onChange={(event) => setAudience(event.target.value)} className="bg-transparent outline-none">
              <option value="public">Public</option>
              <option value="following">Followers</option>
              <option value="only_me">Only me</option>
            </select>
          </div>
        </div>
      </div>

      <textarea rows="4" value={body} onChange={(event) => setBody(event.target.value)} placeholder={`What's on your mind, ${userData?.name || "Route User"}?`} className="min-h-14 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white" />

      {image && <img src={URL.createObjectURL(image)} alt="post preview" className="max-h-125 w-full rounded-2xl object-cover" />}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            <FaImage className="text-medium text-green-500" />
            <span className="hidden sm:inline">Photo/Video</span>
            <input ref={fileRef} type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} className="hidden" />
          </label>
          <button type="button" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            <FaRegSmile className="text-medium text-yellow-500" /><span className="hidden sm:inline">Feeling/Activity</span>
          </button>
        </div>
        <Button type="button" onPress={submit} isLoading={loading} isDisabled={!body.trim() && !image} className="flex items-center gap-2 rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#166fe5] disabled:opacity-60">
          Post
          {!loading && <FaPaperPlane size={12} style={{ width: 12, height: 12, flexShrink: 0 }} />}
        </Button>
      </div>
    </div>
  );
}
