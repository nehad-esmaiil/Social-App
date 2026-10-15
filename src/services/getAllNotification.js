import axios from "axios";

export const fetchNotifications = () => {
  return axios.get(
    `https://route-posts.routemisr.com/notifications?page=1&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
};

const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("userToken")}` });

export const fetchUnreadCount = () => axios.get("https://route-posts.routemisr.com/notifications/unread-count", { headers: headers() });
export const markNotificationRead = (id) => axios.patch(`https://route-posts.routemisr.com/notifications/${id}/read`, {}, { headers: headers() });
export const markAllNotificationsRead = () => axios.patch("https://route-posts.routemisr.com/notifications/read-all", {}, { headers: headers() });
