import React, { useEffect, useRef, useState } from "react";
import "../../Template/LayoutMain/LayoutMain/Layout.css";
import "./Chats.css";
import { VscSend } from "react-icons/vsc";
import Loader from "../../Loader/Loader";

import { useParams } from "react-router-dom";
import { connectChatSocket, disconnectChatSocket } from "../../socket/chatSocket";
import { getChatMessages, sendMessageApi } from "../../utils/APIs/chatApis";
import { getAccessToken } from "../../utils/APIs/commonHeadApiLogic";

const Chats = ({ chatType }) => {
  const { bookingId, quoteId } = useParams();
  const targetId = chatType === "booking" ? bookingId : quoteId;
  const roomId = `booking_${targetId}`;

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
                Veroa <br /> Studios
              </div>
              <div className="admin-info">
                <p className="admin-name mb-0">Conversation</p>
                <span className="admin-status">#{targetId}</span>
              </div>
            </div>
            <div className="menu">⋮</div>
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
              console.log("currentUserId",currentUserId)
               console.log("senderId",msg?.senderId)
               console.log("isMe",isMe)
              return (
                <div
                  key={msg._id || Math.random()}
                  className={`message-row ${isMe ? "right" : "left"}`}
                >
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
                    <div className="text-content">{msg.message}</div>
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






