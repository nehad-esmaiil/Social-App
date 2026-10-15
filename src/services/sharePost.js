import axios from "axios";

export const sharePost = (postId, body) => axios.post(
  `https://route-posts.routemisr.com/posts/${postId}/share`,
  { body },
  { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}`, "Content-Type": "application/json" } },
);
