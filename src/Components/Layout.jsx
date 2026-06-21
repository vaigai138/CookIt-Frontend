import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./ui/Navbar";
import Footer from "./footer";
import ChatBot from "./ChatBot";

// Shared chrome for content pages: sticky Navbar + routed content + Footer + chatbot.
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-clip">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Layout;
