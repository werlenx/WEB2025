import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="container-card max-w-5xl mx-auto">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {user && (
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          )}
          <div className={`${user ? "lg:col-span-3" : "col-span-4"} bg-white p-6 rounded-xl shadow-lg min-h-[600px]`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
