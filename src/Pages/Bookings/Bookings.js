

import React, { useEffect, useState } from "react";
import "../../Template/LayoutMain/LayoutMain/Layout.css";
import "./Bookings.css";
import UpcommingBookingsTable from "./UpcommingBookingsTable/UpcommingBookingsTable";
import PreviousBookingsTable from "./PreviousBookingsTable/PreviousBookingsTable";


const Bookings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const stored = sessionStorage.getItem("isSidebarOpen");
    return stored !== null ? JSON.parse(stored) : true;
  });

  const [activeTab, setActiveTab] = useState("upcomming");

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = sessionStorage.getItem("isSidebarOpen");
      const parsed = stored !== null ? JSON.parse(stored) : true;

      if (parsed !== isSidebarOpen) {
        setIsSidebarOpen(parsed);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [isSidebarOpen]);

  return (
<div
  className={`content-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
  style={{ marginTop: "100px" }}
>
  <div className="page-inner-wrapper">

    <h2 className="mb-4">Shoot Bookings</h2>

    {/* Tabs */}
    <div className="custom-tabs">
      <div
        className={`tab-item ${activeTab === "upcomming" ? "active" : ""}`}
        onClick={() => setActiveTab("upcomming")}
      >
        Upcomming Bookings
      </div>

      <div
        className={`tab-item ${activeTab === "previous" ? "active" : ""}`}
        onClick={() => setActiveTab("previous")}
      >
        Previous Bookings
      </div>
    </div>

    {/* Table */}
    {activeTab === "upcomming" ? <UpcommingBookingsTable /> : <PreviousBookingsTable />}

  </div>
</div>

  );
};

export default Bookings;
