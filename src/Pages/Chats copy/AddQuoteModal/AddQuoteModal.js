import React, { useState } from "react";
import "./AddQuoteModal.css";

const AddQuoteModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    budget: "",
    startDate: "",
    endDate: "",
    location: "",
    note: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = () => {
    onSubmit({
      messageType: "paymentCard",
    //   eventType: {
        budget: form.budget,
        startDate: form.startDate,
        endDate: form.endDate,
        location: form.location,
    //   },
      message: form.note,
       createdAt: new Date().toISOString(),

  // ✅ ADD THIS
  senderId: sessionStorage?.getItem("myId"),
    });
    onClose();
  };

const DELHI_CITIES = [
  // Central Delhi
  "Connaught Place",
  "Chandni Chowk",
  "Karol Bagh",
  "Paharganj",
  "Darya Ganj",
  
  // North Delhi
  "Sadar Bazar",
  "Civil Lines",
  "Shahdara",
  "Rohini",
  "Pitampura",
  "Ashok Vihar",
  "Narela",
  "Azadpur",
  
  // South Delhi
  "Hauz Khas",
  "Saket",
  "Defence Colony",
  "Vasant Kunj",
  "Greater Kailash",
  "Lajpat Nagar",
  "Malviya Nagar",
  "Chhatarpur",
  
  // West Delhi
  "Rajouri Garden",
  "Punjabi Bagh",
  "Janakpuri",
  "Vikaspuri",
  "Moti Nagar",
  
  // East Delhi
  "Mayur Vihar",
  "Preet Vihar",
  "Patparganj",
  "Kondli",
  "Shahdara",
  
  // New Delhi
  "Chanakyapuri",
  "Jor Bagh",
  "Vasant Vihar",
  "Dhaula Kuan",
  "Indraprastha",
  
  // Other areas
  "Nangloi",
  "Bawana",
  "Kanjhawala",
  "Burari",
  "Alipur",
  "Timarpur"
];




  return (
    <div className="aqm-backdrop">
      <div className="aqm-modal">
        {/* Budget */}
        <div className="aqm-row">
          <label>Budget</label>
          <input
            type="number"
            name="budget"
            placeholder="₹ Enter Budget"
            value={form.budget}
            onChange={handleChange}
          />
        </div>

        {/* Event Dates */}
        <div className="aqm-row">
          <label>Event Dates</label>
          <div className="aqm-dates">
            <span>From</span>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
            <span>To</span>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* City */}
        {/* <div className="aqm-row">
          <label>Event City</label>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
          >
            <option value="">Select City</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div> */}

            {/* const CITIES = ["Delhi"]; // ✅ Only Delhi available */}

<div className="aqm-row">
  <label>Event City</label>
  <select
    name="location"
    value={form.location}
    onChange={handleChange}
  >
    <option value="">Select City</option>
    {DELHI_CITIES.map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ))}
  </select>
</div>
        {/* Note */}
        <div className="aqm-row full">
          {/* <label>Any photography requests or extra details?</label> */}
          <label>Your Message (optional)</label>

          <textarea
            name="note"
            placeholder="Add Note"
            value={form.note}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className="aqm-actions">
          <button className="send" onClick={handleSend}>
            Send
          </button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuoteModal;
