import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostDetails } from "../../services/getPostDetails";
import PostCard from "../../components/Post/PostContent";
import PostSkeleton from "../../components/Post/PostPlaceHolder";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPostDetails(id)
      .then((res) => {
        setPost(res.data.data.post);
      })
      .catch((err) => {
        console.error("Error fetching post details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  return (
    <div className="min-h-screen bg-[#F0F2F5] p-5">
      {loading ? (
        <div className="container max-w-3xl"><PostSkeleton /></div>
      ) : post ? (
        <div className="container max-w-3xl"><PostCard post={post} /></div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Post not found or has been deleted.
        </div>
      )}
    </div>
  );
}
