// ThemeRoutes.js
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Temporary from "../layouts/temporary.js";
import { element, exact } from "prop-types";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const OutsideLayout = lazy(() => import("../layouts/OutsideLayout.js"));

/***** Pages ****/

const Registration = lazy(() => import("../views/ui/Registration.js"));
const User = lazy(() => import("../views/ui/User.js"));
const Profile = lazy(() => import("../views/ui/Profile.js"));
const temp = lazy(() => import("../layouts/temporary.js"));
const Login = lazy(() => import("../views/ui/Login.js"));
const Result = lazy(() => import("../views/ui/Result.js"));



const ThemeRoutes = [
  {
    element: <FullLayout />,
    children: [
      { path: "/user", exact: true, element: <User/> }, 
      { path: "/profile", exact: true, element: <Profile/> },
    ],
  },
  {
    path: "/",
    element: <OutsideLayout />,
    children: [
      // { path: "/", element: <Navigate to="/temp" /> },
      // { path: "/temp", exact: true, element: <Temporary /> },
      { path: "/", element: <Navigate to="/user" /> },
      { path: "/user", exact: true, element: <User /> },
      { path: "/", element: <Navigate to="/login" /> },
      { path: "/login", exact: true, element: <Login /> },
      { path: "/register", exact: true, element: <Registration /> },
      { path: "/result", exact: true, element: <Result/> },
    ],
  },
];

export default ThemeRoutes;
