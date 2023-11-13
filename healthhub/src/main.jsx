import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './routes/Navigation';
import Main from './components/Main';
import { BPHome } from "./routes/BPhome";
import { Login } from "./routes/Login";
import { BPlist } from "./routes/BPlist";
import { Logout } from './routes/Logout';
import Register from './routes/Register';
import Meds from './routes/Meds';
import Home from './routes/Home';
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
        path: "/userhome",
        element: <Home />
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
        path: "/meds/",
        element: <Meds />,
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
