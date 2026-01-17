import { io } from "socket.io-client";
import { getAccessToken } from "../utils/APIs/commonHeadApiLogic";

const SOCKET_URL = process.env.REACT_APP_PHOTOGRAPHY_ADMIN_BASE_API_URL;

let socket = null;

export const connectChatSocket = () => {
  if (!socket) {
    const token = getAccessToken();

    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token, // backend should read socket.handshake.auth.token
      },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }

  return socket;
};

export const disconnectChatSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
