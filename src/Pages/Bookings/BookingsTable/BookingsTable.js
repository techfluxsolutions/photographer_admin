import React from "react";
import "./BookingsTable.css";
import { useNavigate } from "react-router-dom";

const BookingsTable = ({ data, page, limit }) => {
  const navigate = useNavigate();
const handleChatClick = (shootId) => {
  console.log("shootId",shootId)
  navigate(`/chat/booking/${shootId}`);
};

  return (
    <div className="table-wrapper">
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Shoot ID</th>
            <th>Client ID</th>
            <th>Client Name</th>
            <th>Assigned Photographer</th>
            <th>Team / Studio</th>
            <th>Shoot Type</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Chat</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="10" className="no-data">
                No bookings found
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.shootId}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{item.shoot_id || "-"}</td>
                <td>{item.client_id || "-"}</td>
                <td>{item.client_name || "-"}</td>
                <td>{item.assigned_photographer || "-"}</td>
                <td>{item.team_studio || "-"}</td>
                <td>{item.shoot_type || "-"}</td>
                <td>
                  <span className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.notes || "-"}</td>
                <td>
                  <span
                    className="chat-btn"
                    onClick={() => handleChatClick(item.shoot_id)}
                  >
                    💬
                  </span>
                </td>

                {/* <td>
                  <span className="chat-btn" onClick={handleChatClick}>💬</span>
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
