import profileImg from "../../assets/Images/HomeImgs/defaultProfile.png";
import { useContext, useMemo } from "react";
import { UserContext } from "../../App";

// Components
import PostCard from "../Post/PostContent";
import PostSkeleton from "../Post/PostPlaceHolder";

export default function UserPosts({ posts, loading, emptyMessage = "There is no posts yet." }) {
  const { userData } = useContext(UserContext);

  const uniquePosts = useMemo(() => {
    if (!posts) return [];
    const seen = new Set();
    return posts.filter((post) => {
      const duplicate = seen.has(post._id);
      seen.add(post._id);
      return !duplicate;
    });
  }, [posts]);

  return (
    <>
      {/* Posts Logic */}
      {loading ? (
        <div className="space-y-6 lg:col-span-2">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : uniquePosts.length > 0 ? (
        uniquePosts.map((post) => (
          <PostCard
            key={post.id || post._id}
            post={post}
            profileImg={profileImg}
            userData={userData}
          />
        ))
      ) : (
        <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">{emptyMessage}</p>
      )}
    </>
  );
}
