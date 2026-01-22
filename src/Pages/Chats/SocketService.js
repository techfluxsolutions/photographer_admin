import { io } from "socket.io-client";
import { getAccessToken } from "../../utils/APIs/commonHeadApiLogic copy";
import { decryptData } from "../../utils/CRYPTO/cryptoFunction";

const SOCKET_URL = (
  process.env.REACT_APP_PHOTOGRAPHY_ADMIN_BASE_API_URL || ""
).trim();

class SocketService {
  socket = null;

  connect() {
    let token = getAccessToken(); // ✅ CHANGE const → let

    console.log("TOKEN", token);

    if (!token) {
      console.error("❌ Socket: No token found");
      return null;
    }

    // decrypt if needed
    try {
      if (token.split(".").length !== 3) {
        token = decryptData(token);
      }
    } catch (e) {
      console.warn("⚠️ Token decrypt failed, using raw token");
    }

    token = token
      .replace(/^Bearer\s+/i, "")
      .replace(/^"(.*)"$/, "$1")
      .trim();

    // Prevent duplicate connections
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("🔌 Socket disconnected");
    }
  }

  /* =====================
     CHAT
  ===================== */
  joinBookingChat(bookingId) {
    this.socket?.emit("join_booking_chat", { bookingId });
  }

  sendMessage(payload) {
    this.socket?.emit("send_message", payload);
  }

  /* =====================
     LISTENERS
  ===================== */
  onReceiveMessage(cb) {
    this.socket?.off("receive_message");
    this.socket?.on("receive_message", cb);
  }

  onTyping(cb) {
    this.socket?.off("typing");
    this.socket?.on("typing", cb);
  }

  onStopTyping(cb) {
    this.socket?.off("stop_typing");
    this.socket?.on("stop_typing", cb);
  }

  /* =====================
     EMITS
  ===================== */
  sendTyping(bookingId) {
    this.socket?.emit("typing", { bookingId });
  }

  sendStopTyping(bookingId) {
    this.socket?.emit("stop_typing", { bookingId });
  }

  /* =====================
     CLEANUP
  ===================== */
  offReceiveMessage() {
    this.socket?.off("receive_message");
  }

  offTyping() {
    this.socket?.off("typing");
  }

  offStopTyping() {
    this.socket?.off("stop_typing");
  }
}

export default new SocketService();
