import { useContext } from "react";
import useUserPosts from "../../hooks/useUserPosts";
import PostCard from "../../components/Post/PostContent";
import PostSkeleton from "../../components/Post/PostPlaceHolder";
import { UserContext } from "../../App";
import profileImg from "../../assets/Images/HomeImgs/defaultProfile.png";

export default function MyPosts() {
  const { posts, isLoadingPosts } = useUserPosts();
  const { userData } = useContext(UserContext);

  if (isLoadingPosts) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 10 }, (_, index) => <PostSkeleton key={index} />)}
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        You have not posted yet.
      </p>
    );
  }

  return (
    <div className="m-auto space-y-5">
      {posts.map((post) => <PostCard key={post.id || post._id} post={post} userData={userData} profileImg={profileImg} />)}
    </div>
  );
}
