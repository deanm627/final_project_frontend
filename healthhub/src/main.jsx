import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './routes/Navigation';
import Main from './components/Main';
import { BPdetail, loader as bpDetailLoader } from './components/BPdetail';
import { BPHome } from "./routes/BPhome";
import { Login } from "./routes/Login";
import { BPlist } from "./routes/BPlist";
import { Logout } from './routes/Logout';
import Register from './routes/Register';
import './interceptor/axios';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />,
    children: [
      {
        index: true,
        element: <Main />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/medprob/bplist",
        element: <BPlist />
      },
      {
        path: "/medprob/bp",
        element: <BPHome />
      },
      {
        path: "/medprob/bps/:bpId",
        element: <BPdetail />,
        loader: bpDetailLoader,
      },
      {
        path: "/logout",
        element: <Logout />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
