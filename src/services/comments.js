import axios from "axios";

export const fetchComments = async (postId) => {
  return axios.get(
    `https://route-posts.routemisr.com/posts/${postId}/comments`,
    {
      params: {
        page: 1,
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
};

export const updateComment = (postId, commentId, content) => axios.put(
  `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
  { content },
  { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } },
);

export const deleteComment = (postId, commentId) => axios.delete(
  `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
  { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } },
);
