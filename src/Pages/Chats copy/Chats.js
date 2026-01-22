import React, { useEffect, useRef, useState } from "react";
import "../../Template/LayoutMain/LayoutMain/Layout.css";
import "./Chats.css";
import { VscSend } from "react-icons/vsc";
import Loader from "../../Loader/Loader";

import { useParams } from "react-router-dom";
import { connectChatSocket, disconnectChatSocket } from "../../socket/chatSocket";
import { getChatMessages, sendMessageApi } from "../../utils/APIs/chatApis";
// import { getAccessToken } from "../../utils/APIs/commonHeadApiLogic";
import AddQuoteModal from "./AddQuoteModal/AddQuoteModal";

const Chats = ({ chatType }) => {
  const { bookingId, quoteId } = useParams();
  const targetId = chatType === "booking" ? bookingId : quoteId;
  const roomId = `booking_${targetId}`;
  const [showPaymentModal, setShowPaymentModal] = useState(false);


  {/* Helper functions (put these outside the component) */}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

 

  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  /* =========================
     GET CURRENT USER ID FROM TOKEN
  ========================= */
  // useEffect(() => {
  //   const token = getAccessToken();
  //   if (token) {
  //     try {
  //       const payload = JSON.parse(atob(token.split(".")[1]));
  //       setCurrentUserId(payload.id);
  //     } catch (e) {
  //       console.error("Failed to decode token", e);
  //     }
  //   }
  // }, []);


  useEffect(() => {
    const id = sessionStorage.getItem("myId");
    if (id) setCurrentUserId(String(id));
  }, []);
  /* =========================
     SIDEBAR STATE
  ========================= */
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const stored = sessionStorage.getItem("isSidebarOpen");
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = sessionStorage.getItem("isSidebarOpen");
      const parsed = stored !== null ? JSON.parse(stored) : true;
      if (parsed !== isSidebarOpen) {
        setIsSidebarOpen(parsed);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isSidebarOpen]);

  /* =========================
     FETCH MESSAGES
  ========================= */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!targetId) return;
      try {
        setLoading(true);
        const res = await getChatMessages(targetId);
        if (res.data?.success) {
          setMessages(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [targetId]);

  /* =========================
     SOCKET CONNECTION
  ========================= */
  useEffect(() => {
    if (!targetId) return;

    const socket = connectChatSocket();

    // Join room
    socket.emit("join_booking_chat", { bookingId: targetId });

    const handleReceiveMessage = (newMessage) => {
      // Prevent duplicates if already added optimistically
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === newMessage._id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      // We don't disconnect globally here because other components might use it
      // but we can leave the room if backend supports it
    };
  }, [targetId]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = async () => {
    if (!input.trim() || !targetId) return;

    const messageText = input;
    setInput("");

    // Optimistic UI update (optional, but good for UX)
    // Note: The backend will broadcast the message back via socket, 
    // which will add it to the state in handleReceiveMessage if not already present.

    try {
      const res = await sendMessageApi(targetId, messageText);
      if (res.data?.success) {
        // The message is added to state via socket listener
      }
    } catch (err) {
      console.error("Message send failed", err);
      // Maybe show a toast error
    }
  };


const handleQuoteSend = async (payload) => {
  if (!targetId) return;

  // 1️⃣ Add temporary _id for optimistic rendering
  const tempId = `temp-${Date.now()}`;
  const tempMessage = { ...payload, _id: tempId };

  setMessages((prev) => [...prev, tempMessage]);

  try {
    // 2️⃣ Send to backend
    const res = await sendMessageApi(targetId, payload);

    // Optional: Replace tempId with real _id from backend
    if (res.data?.success) {
      const realMessage = res.data.data; // make sure backend returns saved message
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? realMessage : msg))
      );
    }
  } catch (err) {
    console.error("Payment card send failed", err);
    // Remove temp message or mark as failed
    setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
  }
};





  if (loading && messages.length === 0) return <Loader />;

  return (
    <div
      className={`content-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      style={{ marginTop: "100px" }}
    >
      <div className="page-inner-wrapper">
        <h2 className="mb-4">Chat {chatType === "booking" ? "- Booking" : "- Quote"}</h2>

        <div className="chat-wrapper">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="brand">
                {/* Veroa <br /> Studios */}
                <img
                  src="/ProjectLogo/WhiteLogo.png"
                  alt="Hire Roofer Logo"
                  className="navbar-brand-logo"
                  style={{ height: "70px", cursor: "pointer" }}
                />
              </div>
              <div className="admin-info">
                <p className="admin-name mb-0">Conversation</p>
                <span className="admin-status">#{targetId}</span>
              </div>
            </div>
            {/* <div className="menu">⋮</div> */}
            {/* RIGHT SIDE BUTTONS */}
            <div className="chat-header-right">
              <button
                className="chat-header-btn"
                onClick={() => setShowPaymentModal(true)}
              >
                +
              </button>


              {/* <div className="menu">⋮</div> */}
            </div>
            <AddQuoteModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  onSubmit={handleQuoteSend}
/>

          </div>

          {/* Chat Body */}
          <div className="chat-body">
            {messages.length === 0 && !loading && (
              <div className="text-center text-muted mt-5">No messages yet. Start the conversation!</div>
            )}
            {messages.map((msg) => {
              const sender = msg.senderId;
              // const isMe = sender?._id === currentUserId || sender === currentUserId;
              const isMe = msg?.senderId === null
              console.log("currentUserId", currentUserId)
              console.log("senderId", msg?.senderId)
              console.log("isMe", isMe)
              return (
                <div
                  key={msg._id || Math.random()}
                  className={`message-row ${isMe ? "right" : "left"}`}
                >
                  {/* isme */}
                  {!isMe && (
                    <img
                      src={sender?.avatar || "https://i.pravatar.cc/40?img=12"}
                      alt="avatar"
                      className="avatar"
                      onError={(e) => { e.target.src = "https://i.pravatar.cc/40?img=12"; }}
                    />
                  )}

                  <div className={`message-bubble ${isMe ? "dark" : "light"}`}>
                    <small className="sender-name">
                      {isMe ? "You" : (sender?.username || "User")}
                    </small>
                    {/* <div className="text-content">{msg.message}</div> */}
         <div className="text-content">
  {msg.messageType === "text" && msg.message}

  {msg.messageType === "paymentCard" && (
    <div className={`payment-card ${isMe ? "my-card" : "their-card"}`}>
      
      {/* Premium Header with Branding */}
      <div className="payment-card-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" 
                  fill="currentColor" opacity="0.9"/>
              </svg>
            </div>
            <div className="brand-text">
              <span className="card-subtitle">Event Proposal</span>
              <span className="card-title">Budget Summary</span>
            </div>
          </div>
          <div className="amount-section">
            <div className="amount-wrapper">
              <span className="currency">₹</span>
              <span className="card-amount">{msg.budget}</span>
            </div>
            <span className="amount-label">Total Budget</span>
          </div>
        </div>
      </div>

      {/* Decorative Separator */}
      <div className="card-separator">
        <div className="separator-line"></div>
        <div className="separator-dot"></div>
      </div>

      {/* Content with Clear Visual Hierarchy */}
      <div className="payment-card-body">
        {/* Dates Section */}
        <div className="info-section">
          <div className="section-header">
            <div className="section-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 6h14v2H5V6zm7 7h5v5h-5z" 
                  fill="currentColor" opacity="0.8"/>
              </svg>
            </div>
            <span className="section-title">Event Schedule</span>
          </div>
          <div className="section-content">
            <div className="date-range">
              <div className="date-item">
                <span className="date-label">From</span>
                <span className="date-value">{formatDate(msg.startDate)}</span>
              </div>
              <div className="arrow-icon">→</div>
              <div className="date-item">
                <span className="date-label">To</span>
                <span className="date-value">{formatDate(msg.endDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="info-section">
          <div className="section-header">
            <div className="section-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                  fill="currentColor" opacity="0.8"/>
              </svg>
            </div>
            <span className="section-title">Venue</span>
          </div>
          <div className="section-content">
            <div className="location-text">{msg.location}</div>
          </div>
        </div>

        {/* Note Section (Conditional) */}
        {msg.message && (
          <div className="note-section">
            <div className="note-header">
              <div className="note-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" 
                    fill="currentColor" opacity="0.8"/>
                </svg>
              </div>
              <span className="note-title">Special Notes</span>
            </div>
            <div className="note-content">
              <p className="note-text">"{msg.message}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with Timestamp */}
      <div className="payment-card-footer">
        <div className="footer-content">
          <div className="timestamp">
            <span className="time-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" 
                  fill="currentColor" opacity="0.7"/>
              </svg>
            </span>
            <span className="time-text">
              {msg.createdAt ? formatTime(msg.createdAt) : 'Just now'}
            </span>
          </div>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span className="status-text">Sent</span>
          </div>
        </div>
      </div>
    </div>
  )}
</div>




                    <span className="time">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input">
            <div className="chat-input-inner">
              <input
                type="text"
                placeholder="Start Typing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className={`send-btn ${input.trim() ? "active" : ""}`}
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <VscSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;






