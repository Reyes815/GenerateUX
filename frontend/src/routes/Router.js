// ThemeRoutes.js
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { element, exact } from "prop-types";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const OutsideLayout = lazy(() => import("../layouts/OutsideLayout.js"));
const NoSidebarLayout = lazy(() => import("../layouts/NoSidebarLayout.js"));

/***** Pages ****/

const Registration = lazy(() => import("../views/ui/Registration.js"));
const User = lazy(() => import("../views/ui/User.js"));
const Login = lazy(() => import("../views/ui/Login.js"));
const Result = lazy(() => import("../views/ui/Result.js"));



const ThemeRoutes = [
  {
    element: <FullLayout />,
    children: [
      { path: "/user", exact: true, element: <User/> }, 
    ],
  },
  {
    element: <NoSidebarLayout />,
    children: [
      { path: "/result", exact: true, element: <Result/> },
    ],
  },
  {
    path: "/",
    element: <OutsideLayout />,
    children: [
      { path: "/", element: <Navigate to="/user" /> },
      { path: "/login", exact: true, element: <Login /> },
      { path: "/register", exact: true, element: <Registration /> },
      
    ],
  },
];

export default ThemeRoutes;
