import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import App from "./App.tsx";
import Ranking from "./pages/Ranking";
import Market from "./pages/Market";
import Wheel from "./pages/Wheel";
import Accounts from "./pages/Accounts";
import Members from "./pages/Members";
import History from "./pages/History";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CreateTask from "./pages/CreateTask";
import HouseFlow from "./pages/HouseFlow";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <ProtectedRoute>
            <App />
        </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/ranking",
        element: <Ranking />,
      },
      {
        path: "/market",
        element: <Market />,
      },
      {
        path: "/punishment",
        element: <Wheel />,
      },
      {
        path: "/accounts",
        element: <Accounts />,
      },
      {
        path: "/members",
        element: <Members />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/create-task",
        element: <CreateTask />,
      },
      {
        path: "/house-flow",
        element: <HouseFlow />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
