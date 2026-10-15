import { useEffect, useState } from "react";
import { Pagination } from "@heroui/react";
import { fetchPosts } from "../../services/posts";
import UserPosts from "../../components/profile/UserPosts";
import PostCreateCard from "../../components/Post/PostCreateCard";

export default function Home() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPosts(page)
      .then(({ data }) => {
        setPosts(data?.data?.posts || []);
        setPages(data?.meta?.pagination?.numberOfPages || 1);
      })
      .finally(() => setLoading(false));
    window.scroll({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="space-y-5">
      <PostCreateCard />
      <UserPosts posts={posts} loading={loading} />
      <div className="flex justify-center py-3">
        <Pagination page={page} total={pages} onChange={setPage} />
      </div>
    </div>
  );
}
