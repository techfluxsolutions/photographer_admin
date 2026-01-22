// import { useEffect, useState } from "react";
// import StatsCards from "./StateCards/StateCards";
// import UpcomingBookings from "./UpcomingBooking/UpcomingBooking";
// import LatestQuotes from "./LatestQuotes/LatestQuotes";
// import "./Dashboard.css"
// const Dashboard = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
//     const stored = sessionStorage.getItem("isSidebarOpen");
//     return stored !== null ? JSON.parse(stored) : true;
//   });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const stored = sessionStorage.getItem("isSidebarOpen");
//       const parsed = stored !== null ? JSON.parse(stored) : true;
//       if (parsed !== isSidebarOpen) setIsSidebarOpen(parsed);
//     }, 10);

//     return () => clearInterval(interval);
//   }, [isSidebarOpen]);

//   return (
//     <div
//       className={`content-container ${
//         isSidebarOpen ? "sidebar-open" : "sidebar-closed"
//       }`}
//       style={{ marginTop: "100px" }}
//     >
//       <div className="page-inner-wrapper">
//         <h2 className="mb-4">Welcome Back,</h2>
//         <p>Here’s what’s happening with your shoots</p>

//         <StatsCards />

//         <div className="dashboard-grid">
//           <UpcomingBookings />
//           <LatestQuotes />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import { useEffect, useState } from "react";
import StatsCards from "./StateCards/StateCards";
import UpcomingBookings from "./UpcomingBooking/UpcomingBooking";
import LatestQuotes from "./LatestQuotes/LatestQuotes";
import "./Dashboard.css";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const stored = sessionStorage.getItem("isSidebarOpen");
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = sessionStorage.getItem("isSidebarOpen");
      const parsed = stored !== null ? JSON.parse(stored) : true;
      if (parsed !== isSidebarOpen) setIsSidebarOpen(parsed);
    }, 10);

    return () => clearInterval(interval);
  }, [isSidebarOpen]);

  return (
    <div
      className={`content-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
      style={{ marginTop: "100px" }}
    >
      <div className="container-fluid px-3 px-md-4">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1 dashboard-title">Welcome Back,</h2>
          <p className="dashboard-subtitle">
            Here’s what’s happening with your shoots
          </p>
        </div>

        {/* Stats */}
        <div className="mb-4">
          <StatsCards />
        </div>

        {/* Main Grid */}
        <div className="row g-4">
          {/* Upcoming Bookings */}
          <div className="col-12 col-lg-7">
            <UpcomingBookings />
          </div>

          {/* Latest Quotes */}
          <div className="col-12 col-lg-5">
            <LatestQuotes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
