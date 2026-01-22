// import { useState } from "react";
// import "./LatestQuotes.css";

// const LatestQuotes = () => {
//   const [showAll, setShowAll] = useState(false);

//   const quotes = [
//     {
//       name: "Riya Mehta",
//       amount: "Rs. 47,000/-",
//       status: "Completed",
//       avatar: "https://i.pravatar.cc/150?img=47",
//     },
//     {
//       name: "Sahil Khurana",
//       amount: "Rs. 60,000/-",
//       status: "Completed",
//       avatar: "https://i.pravatar.cc/150?img=12",
//     },
//     {
//       name: "Riya Mehta",
//       amount: "Rs. 47,000/-",
//       status: "Completed",
//       avatar: "https://i.pravatar.cc/150?img=47",
//     },
//     {
//       name: "Sahil Khurana",
//       amount: "Rs. 60,000/-",
//       status: "Completed",
//       avatar: null,
//     },
//   ];

//   const visibleQuotes = showAll ? quotes : quotes.slice(0, 3);

//   return (
//     <div className="quotes-card">
//       <div className="quotes-header">
//         <h3>Latest Quotes</h3>
//         <span className="menu">⋮</span>
//       </div>

//       <div className={`quotes-list ${showAll ? "expanded" : ""}`}>
//         {visibleQuotes.map((item, index) => (
//           <div key={index} className="quote-row">
//             <div className="quote-left">
//               {item.avatar ? (
//                 <img src={item.avatar} alt={item.name} />
//               ) : (
//                 <div className="avatar-placeholder" />
//               )}

//               <div>
//                 <p className="quote-name">{item.name}</p>
//                 <span className="quote-status">{item.status}</span>
//               </div>
//             </div>

//             <div className="quote-amount">{item.amount}</div>
//           </div>
//         ))}
//       </div>

//       {quotes.length > 3 && (
//         <div
//           className="view-more"
//           onClick={() => setShowAll(!showAll)}
//         >
//           {showAll ? "View Less" : "View More"}
//           <span className={`arrow ${showAll ? "rotate" : ""}`}>⌄</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LatestQuotes;


import { useState } from "react";
import "./LatestQuotes.css"
const LatestQuotes = () => {
  const [showAll, setShowAll] = useState(false);

  const quotes = [
    {
      name: "Riya Mehta",
      amount: "Rs. 47,000/-",
      status: "Completed",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    {
      name: "Sahil Khurana",
      amount: "Rs. 60,000/-",
      status: "Completed",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      name: "Riya Mehta",
      amount: "Rs. 47,000/-",
      status: "Completed",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    {
      name: "Sahil Khurana",
      amount: "Rs. 60,000/-",
      status: "Completed",
      avatar: null,
    },
  ];

  const visibleQuotes = showAll ? quotes : quotes.slice(0, 3);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {/* <div className="d-flex justify-content-between align-items-center mb-3 "> */}
          {/* <h5 className="mb-0 dashboard-text-color">Latest Quotes</h5> */}
            <h5 className="dashboard-text-color upcoming-booking-text">Latest Quotes</h5>
          {/* <span className="fs-4">⋮</span> */}
        {/* </div> */}

        {visibleQuotes.map((item, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center py-2 border-bottom quotes-card"
          >
            <div className="d-flex align-items-center gap-3">
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="rounded-circle "
                  width="40"
                  height="40"
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary"
                  style={{ width: 40, height: 40 }}
                />
              )}

              <div>
                <div className="fw-semibold dashboard-text-color">{item.name}</div>
                <small 
                style={{ color: "#28AF38" }}
                >{item.status}</small>
              </div>
            </div>

            <div className="fw-semibold dashboard-text-color">{item.amount}</div>
          </div>
        ))}

        {quotes.length > 3 && (
          <div
            className="text-center mt-3 dashboard-text-color"
            //  style={{ color:  }}
            role="button"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "View Less" : "View More"}{" "}
            <div className={`ms-1 arrow-icon-quote ${showAll ? "rotate-180" : ""}`}>⌄</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestQuotes;
