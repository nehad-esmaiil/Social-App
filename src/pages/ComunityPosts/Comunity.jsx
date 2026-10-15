import { useEffect, useState } from "react";
import { fetchFeedPosts } from "../../services/feedPosts";
import UserPosts from "../../components/profile/UserPosts";

export default function Comunity() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchFeedPosts()
      .then(({ data }) => setPosts(data?.data?.posts || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <UserPosts posts={posts} loading={loading} emptyMessage="There is no posts yet." />
    </div>
  );
}
