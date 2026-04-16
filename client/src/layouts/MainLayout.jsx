import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {
  const [filterStatus, setFilterStatus] = useState("submitted"); // default filter

  return (
    <div className="app-container">
      <Sidebar filterStatus={filterStatus} onFilterChange={setFilterStatus} />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <Outlet context={{ filterStatus }} />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;