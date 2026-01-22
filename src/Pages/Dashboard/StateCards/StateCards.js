

// const StatsCards = () => {
//   const stats = [
//     { label: "Total Visitors", value: 15 },
//     { label: "No. of Registrations", value: 5 },
//     { label: "Total Bookings", value: 23 },
//     { label: "Total Revenue", value: 12 },
//   ];


//   return (
//     <div className="stats-grid">
//       {stats.map((item, index) => (
//         <div key={index} className="stat-card">
//           <p className="stat-label">{item.label}</p>
//           <h3 className="stat-value">{item.value}</h3>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default StatsCards;

import "./StateCards.css"
const StatsCards = () => {
  const stats = [
    { label: "Total Visitors", value: 15 },
    { label: "No. of Registrations", value: 5 },
    { label: "Total Bookings", value: 23 },
    { label: "Total Revenue", value: 12 },
  ];

  return (
    <div className="container">
      <div className="row g-3">
        {stats.map((item, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="card text-center shadow-sm h-100">
              <div className="card-body">
                <p className="dashboard-text-color mb-1">{item.label}</p>
                <p className="fw-bold dashboard-text-color static-state">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
