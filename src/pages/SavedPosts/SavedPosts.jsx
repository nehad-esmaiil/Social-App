import { useEffect, useState } from "react";
import PostCard from "../../components/Post/PostContent";
import PostSkeleton from "../../components/Post/PostPlaceHolder";
import { getBookmarks } from "../../services/getBookmarks";

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookmarks()
      .then(({ data }) => setPosts(data?.data?.bookmarks || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = (postId) => {
    setPosts((current) => current.filter((post) => (post.id || post._id) !== postId));
  };

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 10 }, (_, index) => <PostSkeleton key={index} />)}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        You have no bookmarked posts yet.
      </p>
    );
  }

  return (
    <div className="m-auto space-y-5">
      {posts.map((post) => (
        <PostCard
          key={post.id || post._id}
          post={post}
          isSavedPage
          onUnsave={removeBookmark}
        />
      ))}
    </div>
  );
}
