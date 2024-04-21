// ThemeRoutes.js
import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const OutsideLayout = lazy(() => import("../layouts/OutsideLayout.js"));

/***** Pages ****/

const Registration = lazy(() => import("../views/ui/Registration.js"));
const User = lazy(() => import("../views/ui/User.js"));
const Profile = lazy(() => import("../views/ui/Profile.js"));




const ThemeRoutes = [
  {
    element: <FullLayout />,
    children: [
      { path: "/user", exact: true, element: <User /> }, // Updated route for User with dynamic parameter
      { path: "/profile", exact: true, element: <Profile /> },
    ],
  },
  {
    path: "/",
    element: <OutsideLayout />,
    children: [
      { path: "/", element: <Navigate to="/user" /> },
      { path: "/user", exact: true, element: <User /> },
      // { path: "/", element: <Navigate to="/login" /> },
      // { path: "/login", exact: true, element: <Login /> },
      // { path: "/register", exact: true, element: <Registration /> },
    ],
  },
];

export default ThemeRoutes;
