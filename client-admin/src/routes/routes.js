import React from "react";
import { Navigate } from "react-router-dom";
import Home from "../Component/Home/Home";
import Login from "../Component/Auth/Login";
import Register from "../Component/Auth/Register";
import RequestPasswordReset from "../Component/Auth/RequestPasswordReset";
import ResetPassword from "../Component/Auth/ResetPassword";
import ProductList from "../Component/Products/ProductList";
import CategoryList from "../Component/Categories/CategoryList";
import UserList from "../Component/User/UserList";
import OrderList from "../Component/Orders/OrderList";
import Verify from "../Component/Auth/Verify";

const routes = [
  { path: "/", element: <Navigate to="/admin/login" /> },
  // { path: "/", element: <Home /> },
  { path: "/admin/login", element: <Login /> },
  { path: "/admin/register", element: <Register /> },
  { path: "/admin/verify", element: <Verify /> },
  // request pass reset
  { path: "/admin/request-password-reset", element: <RequestPasswordReset /> },
  { path: "/admin/resetpassword", element: <ResetPassword /> },
  { path: "/admin/home", element: <Home /> },
  { path: "/admin/products", element: <ProductList /> },
  { path: "/admin/categories", element: <CategoryList /> },
  { path: "/admin/users", element: <UserList /> },
  { path: "/admin/orders", element: <OrderList /> },
];

export default routes;
