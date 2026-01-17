import React from "react";
import "./QuoteTable.css";
import { useNavigate } from "react-router-dom";

const QuoteTable = ({ data }) => {
  const navigate = useNavigate();
  const handleChatClick = (quoteId) => {
  navigate(`/chat/quote/${quoteId}`);
};

  return (
    <div className="quote-table-wrapper">
      <table className="quote-table">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Event Type</th>
            <th>Event Date</th>
            <th>Event Location</th>
            <th>Duration</th>
            <th>Photography</th>
            <th>Budget</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Chat</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.eventType}</td>
              <td>{item.eventDate}</td>
              <td>{item.location}</td>
              <td>{item.duration}</td>
              <td>{item.photography}</td>
              <td>{item.budget}</td>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td className="email">{item.email}</td>
              <td>
                <button
                  className="chat-btn"
                  onClick={() => handleChatClick(item.id)} // use unique quote id
                >
                  💬
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuoteTable;
