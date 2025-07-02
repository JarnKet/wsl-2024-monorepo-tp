import React from "react";

// Third Party
import { Outlet } from "react-router";

// UI
import HeaderBar from "./HeaderBar";
import NavigationBar from "./NavigationBar";

const RootLayout = () => {
  return (
    <main className="container">
      <HeaderBar />
      <section className="main-content">
        <Outlet />
      </section>
      <NavigationBar />
    </main>
  );
};

export default RootLayout;
