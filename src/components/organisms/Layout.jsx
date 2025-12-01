import React from "react";
import { Outlet } from "react-router-dom";
import BottomNavigation from "@/components/organisms/BottomNavigation";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 safe-top">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;