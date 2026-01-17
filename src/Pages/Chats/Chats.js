//With Socket
import React, { useEffect, useRef, useState } from "react";
import "../../Template/LayoutMain/LayoutMain/Layout.css";
import "./Chats.css";
import { VscSend } from "react-icons/vsc";
import Loader from "../../Loader/Loader";

import { useParams } from "react-router-dom";
import { connectChatSocket, disconnectChatSocket } from "../../socket/chatSocket";
import { getChatMessages, sendMessageApi } from "../../utils/APIs/chatApis";

const Chats = ({ chatType }) => {
  const { bookingId, quoteId } = useParams();

  const roomId =
    chatType === "booking"
      ? `booking_${bookingId}`
      : `quote_${quoteId}`;

  const chatEndRef = useRef(null);

  useEffect(() => {
  const socket = connectChatSocket(roomId);

  socket.on("receive_message", (message) => {
    setMessages((prev) => [...prev, message]);
  });

  return () => {
    socket.off("receive_message");
    disconnectChatSocket();
  };
}, [roomId]);


  /* =========================
     SIDEBAR STATE (same as Bookings)
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
    }, 10);

    return () => clearInterval(interval);
  }, [isSidebarOpen]);

  /* =========================
     CHAT STATE
  ========================= */
  const [messages, setMessages] = useState([
    { id: 1, text: "Your budget is very less for this event", sender: "admin", time: "11:34 AM" },
    { id: 2, text: "How much price for this event?", sender: "user", time: "11:35 AM" },
    { id: 3, text: "The price is ₹70,000", sender: "admin", time: "11:36 AM" },
    { id: 4, text: "My budget is ₹50,000 only, any negotiation?", sender: "user", time: "11:37 AM" },
    { id: 5, text: "Ok, we can do it for ₹60,000 if you're ok with this", sender: "admin", time: "11:38 AM" },
    { id: 6, text: "Ok", sender: "user", time: "11:39 AM" },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getChatMessages(
        chatType === "booking" ? bookingId : quoteId
      );

      setMessages(
        (res.data || []).map((msg) => ({
          id: msg.id,
          text: msg.message || msg.text,
          sender: msg.sender,
          time: new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      );
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  fetchMessages();
}, [bookingId, quoteId, chatType]);



useEffect(() => {
  const socket = connectChatSocket(roomId);

  socket.on("receive_message", (msg) => {
    setMessages((prev) => [
      ...prev,
      {
        id: msg.id || Date.now(),
        text: msg.text,
        sender: msg.sender,
        time: new Date(msg.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  });

  return () => {
    socket.off("receive_message");
    disconnectChatSocket();
  };
}, [roomId]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = async () => {
  if (!input.trim()) return;

  const newMessage = {
    id: Date.now(),
    text: input,
    sender: "user",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // 1️⃣ Optimistic UI
  setMessages((prev) => [...prev, newMessage]);
  setInput("");

  // 2️⃣ Socket emit
  const socket = connectChatSocket(roomId);
  socket.emit("send_message", {
    roomId,
    text: input,
    sender: "user",
  });

  // 3️⃣ Persist in DB
  try {
    await sendMessageApi(
      chatType === "booking" ? bookingId : quoteId,
      input
    );
  } catch (err) {
    console.error("Message save failed", err);
  }
};


  if (loading) return <Loader />;

  return (
    <div
      className={`content-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
      style={{ marginTop: "100px" }}
    >
      <div className="page-inner-wrapper">

        <h2 className="mb-4">Chat</h2>

        <div className="chat-wrapper">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="brand">
                Veroa <br /> Studios
              </div>
              <div className="admin-info">
                <p className="admin-name mb-0">Admin</p>
                <span className="admin-status">Online</span>
              </div>
            </div>
            <div className="menu">⋮</div>
          </div>

          {/* Chat Body */}
          <div className="chat-body">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`message-row ${
                  msg.sender === "user" ? "right" : "left"
                }`}
              >
                {msg.sender === "admin" && (
                  <img
                    src="https://i.pravatar.cc/40?img=12"
                    alt="avatar"
                    className="avatar"
                  />
                )}

                <div
                  className={`message-bubble ${
                    msg.sender === "user" ? "dark" : "light"
                  }`}
                >
                  {msg.text}
                  <span className="time">{msg.time}</span>
                </div>
              </div>
            ))}
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















//Without Scoket
// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../../Template/LayoutMain/LayoutMain/Layout.css";
// import "./Chats.css";
// import { VscSend } from "react-icons/vsc";
// import Loader from "../../Loader/Loader";

// const Chats = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const chatEndRef = useRef(null);

//   const { quoteId } = location.state || {};

//   /* =========================
//      SIDEBAR STATE (same as Bookings)
//   ========================= */
//   const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
//     const stored = sessionStorage.getItem("isSidebarOpen");
//     return stored !== null ? JSON.parse(stored) : true;
//   });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const stored = sessionStorage.getItem("isSidebarOpen");
//       const parsed = stored !== null ? JSON.parse(stored) : true;

//       if (parsed !== isSidebarOpen) {
//         setIsSidebarOpen(parsed);
//       }
//     }, 10);

//     return () => clearInterval(interval);
//   }, [isSidebarOpen]);

//   /* =========================
//      CHAT STATE
//   ========================= */
//   const [messages, setMessages] = useState([
//     { id: 1, text: "Your budget is very less for this event", sender: "admin", time: "11:34 AM" },
//     { id: 2, text: "How much price for this event?", sender: "user", time: "11:35 AM" },
//     { id: 3, text: "The price is ₹70,000", sender: "admin", time: "11:36 AM" },
//     { id: 4, text: "My budget is ₹50,000 only, any negotiation?", sender: "user", time: "11:37 AM" },
//     { id: 5, text: "Ok, we can do it for ₹60,000 if you're ok with this", sender: "admin", time: "11:38 AM" },
//     { id: 6, text: "Ok", sender: "user", time: "11:39 AM" },
//   ]);

//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* =========================
//      AUTO SCROLL
//   ========================= */
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* =========================
//      SEND MESSAGE
//   ========================= */
//   const handleSend = () => {
//     if (!input.trim()) return;

//     setMessages(prev => [
//       ...prev,
//       {
//         id: Date.now(),
//         text: input,
//         sender: "user",
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       },
//     ]);

//     setInput("");
//   };

//   if (loading) return <Loader />;

//   return (
//     <div
//       className={`content-container ${
//         isSidebarOpen ? "sidebar-open" : "sidebar-closed"
//       }`}
//       style={{ marginTop: "100px" }}
//     >
//       <div className="page-inner-wrapper">

//         <h2 className="mb-4">Chat</h2>

//         <div className="chat-wrapper">
//           {/* Header */}
//           <div className="chat-header">
//             <div className="chat-header-left">
//               <div className="brand">
//                 Veroa <br /> Studios
//               </div>
//               <div className="admin-info">
//                 <p className="admin-name mb-0">Admin</p>
//                 <span className="admin-status">Online</span>
//               </div>
//             </div>
//             <div className="menu">⋮</div>
//           </div>

//           {/* Chat Body */}
//           <div className="chat-body">
//             {messages.map(msg => (
//               <div
//                 key={msg.id}
//                 className={`message-row ${
//                   msg.sender === "user" ? "right" : "left"
//                 }`}
//               >
//                 {msg.sender === "admin" && (
//                   <img
//                     src="https://i.pravatar.cc/40?img=12"
//                     alt="avatar"
//                     className="avatar"
//                   />
//                 )}

//                 <div
//                   className={`message-bubble ${
//                     msg.sender === "user" ? "dark" : "light"
//                   }`}
//                 >
//                   {msg.text}
//                   <span className="time">{msg.time}</span>
//                 </div>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           {/* Chat Input */}
//           <div className="chat-input">
//             <div className="chat-input-inner">
//               <input
//                 type="text"
//                 placeholder="Start Typing..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               />
//               <button
//                 className={`send-btn ${input.trim() ? "active" : ""}`}
//                 onClick={handleSend}
//                 disabled={!input.trim()}
//               >
//                 <VscSend />
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chats;





