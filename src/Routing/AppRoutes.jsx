import React from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import MainLayout from "../LayOuts/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";
import AuthLayOut from "../LayOuts/AuthLayOut/AuthLayOut";
import Login from "../pages/Authntcation/Login/Login";
import Register from "../pages/Authntcation/Register/Register";
import Settings from "../pages/Settings/Settings";
import MyPosts from "../pages/MyPosts/MyPosts";
import Comunity from "../pages/ComunityPosts/Comunity";
import PostDetails from "../pages/PostDetails/PostDetails";
import SavedPosts from "../pages/SavedPosts/SavedPosts";
import Notifications from "../pages/Notifications/Notifications";
import Navbar from "../components/NavBar/NavBar";
import UserProfile from "../pages/Profile/UserProfile";

const ProtectedRoute = () => {
  const token = localStorage.getItem("userToken");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const token = localStorage.getItem("userToken");
  return token ? <Navigate to="/" /> : <Outlet />;
};

const StandaloneLayout = () => <><Navbar /><Outlet /></>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          {
            path: "saved",
            element: <SavedPosts />,
          },
          {
            path: "community",
            element: <Comunity />,
          },
          {
            path: "myPosts",
            element: <MyPosts />,
          },
        ],
      },
      {
        element: <StandaloneLayout />,
        children: [
          { path: "settings", element: <Settings /> },
          { path: "profile", element: <Profile /> },
          { path: "profile/:id", element: <UserProfile /> },
          { path: "notification", element: <Notifications /> },
          { path: "post/:id", element: <PostDetails /> },
          { path: "PostDetails/:id", element: <PostDetails /> },
        ],
      },
    ],
  },

  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayOut />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
], {
  basename: import.meta.env.BASE_URL,
});
