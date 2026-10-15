import React, { useContext } from "react";
import UserProfileCard from "../../components/profile/UserProfileCard";
import UserPosts from "../../components/profile/UserPosts";
import useUserPosts from "../../hooks/useUserPosts";
import { UserContext } from "../../App";
import { uploadProfilePhoto } from "../../services/uploadProfile";
import { toast } from "react-toastify";

export default function Profile() {
  const { userData, setUserData } = useContext(UserContext);
  const { posts, isLoadingPosts } = useUserPosts();

  const handlePhotoUpload = (file) => {
    const toastId = toast.loading("Updating profile picture... ⏳");

    uploadProfilePhoto(file)
      .then((res) => {
        console.log(res);

        if (res.data.success === true) {
          toast.update(toastId, {
            render: "Photo updated successfully! ",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          if (setUserData) {
            setUserData((prev) => ({ ...prev, photo: res.data.data.photo }));
          }
        }
      })
      .catch((err) => {
        console.error(err);
        toast.update(toastId, {
          render: "Failed to upload photo ❌",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="container px-3 py-4">
        <UserProfileCard userData={userData} postsCounter={posts?.length || 0} onPhotoUpload={handlePhotoUpload} />
        <section>
          <div className="container">
            <div className="my-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#1877f2] shadow-sm transition">My Posts</button>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-slate-600 transition hover:text-slate-900">Saved</button>
              </div>
            </div>
          </div>
          <div className="space-y-3 pt-3">
            {isLoadingPosts ? (
              <div className="lg:w-[60%] m-auto"><UserPosts posts={[]} loading /></div>
            ) : posts?.length ? (
              <div className="m-auto space-y-5 lg:w-[60%]"><UserPosts posts={posts} loading={false} /></div>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">You have not posted yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
