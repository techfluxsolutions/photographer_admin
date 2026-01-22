import React, { useEffect, useRef, useState } from "react";
import "../../Template/LayoutMain/LayoutMain/Layout.css";
import "./Chats.css";
import { VscSend } from "react-icons/vsc";
import Loader from "../../Loader/Loader";
import { useParams } from "react-router-dom";
import { getChatMessages, sendMessageApi } from "../../utils/APIs/chatApis";
import AddQuoteModal from "./AddQuoteModal/AddQuoteModal";
import SocketService from "./SocketService";

const Chats = ({ chatType }) => {
  const { bookingId, quoteId } = useParams();
  const targetId = chatType === "booking" ? bookingId : quoteId;
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  /* =========================
     HELPERS
  ========================= */
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  /* =========================
     CURRENT USER
  ========================= */
  useEffect(() => {
    const id = sessionStorage.getItem("myId");
    if (id) setCurrentUserId(String(id));
  }, []);

  /* =========================
     FETCH MESSAGES
  ========================= */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!targetId) return;
      try {
        setLoading(true);
        const res = await getChatMessages(targetId);
        if (res.data?.success) setMessages(res.data.data);
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

    SocketService.connect();
    SocketService.joinBookingChat(targetId);

    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    };

    SocketService.onReceiveMessage(handleReceiveMessage);

    return () => {
      SocketService.offReceiveMessage();
    };
  }, [targetId]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND TEXT MESSAGE
  ========================= */
  const handleSend = async () => {
    if (!input.trim() || !targetId) return;
    const text = input;
    setInput("");

    try {
      await sendMessageApi(targetId, text);
    } catch (err) {
      console.error("Message send failed", err);
    }
  };

  /* =========================
     SEND PAYMENT CARD
  ========================= */
  const handleQuoteSend = async (payload) => {
    if (!targetId) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = { ...payload, _id: tempId, messageType: "paymentCard" };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await sendMessageApi(targetId, payload);
      if (res.data?.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === tempId ? res.data.data : m))
        );
      }
    } catch (err) {
      console.error("Payment card send failed", err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  if (loading && messages.length === 0) return <Loader />;

  return (
    <div className="content-container sidebar-open" style={{ marginTop: "100px" }}>
      <div className="page-inner-wrapper">
        <h2 className="mb-4">
          Chat {chatType === "booking" ? "- Booking" : "- Quote"}
        </h2>

        <div className="chat-wrapper">
          {/* HEADER */}
          <div className="chat-header">
            <div className="chat-header-left">
              <img src="/ProjectLogo/WhiteLogo.png" alt="logo" style={{ height: "70px" }} />
              <div className="admin-info">
                <p className="admin-name mb-0">Conversation</p>
                <span className="admin-status">#{targetId}</span>
              </div>
            </div>

            <div className="chat-header-right">
              <button className="chat-header-btn" onClick={() => setShowPaymentModal(true)}>
                +
              </button>
            </div>

            <AddQuoteModal
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              onSubmit={handleQuoteSend}
            />
          </div>

          {/* BODY */}
          <div className="chat-body">
            {messages.map((msg) => {
              const isMe = msg.senderId === null;

              return (
                <div key={msg._id} className={`message-row ${isMe ? "right" : "left"}`}>
                  {!isMe && (
                    <img
                      src={msg.senderId?.avatar || "https://i.pravatar.cc/40"}
                      alt="avatar"
                      className="avatar"
                    />
                  )}

                  <div className={`message-bubble ${isMe ? "dark" : "light"}`}>
                    {/* TEXT MESSAGE */}
                    {msg.messageType === "text" && (
                      <div className="text-content">{msg.message}</div>
                    )}

                    {/* PAYMENT CARD (EXACT SAME UI) */}
                    {msg.messageType === "paymentCard" && (
                      <div className={`payment-card ${isMe ? "my-card" : "their-card"}`}>
                        <div className="payment-card-header">
                          <div className="header-content">
                            <div className="brand-text">
                              <span className="card-subtitle">Event Proposal</span>
                              <span className="card-title">Budget Summary</span>
                            </div>
                            <div className="amount-wrapper">
                              ₹{msg.budget}
                            </div>
                          </div>
                        </div>

                        <div className="payment-card-body">
                          <p>
                            <strong>From:</strong> {formatDate(msg.startDate)}
                          </p>
                          <p>
                            <strong>To:</strong> {formatDate(msg.endDate)}
                          </p>
                          <p>
                            <strong>Location:</strong> {msg.location}
                          </p>
                          {msg.message && <p>Note: {msg.message}</p>}
                        </div>
                      </div>
                    )}

                    <span className="time">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div className="chat-input">
            <div className="chat-input-inner">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Start Typing..."
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
