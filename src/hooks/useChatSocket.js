import { useEffect, useRef } from "react";
import { connectChatSocket, disconnectChatSocket } from "../socket/chatSocket";
import { sendMessageApi } from "../utils/APIs/chatApis";

const useChatSocket = ({ roomId, onMessage, entityId }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = connectChatSocket(roomId);

    socketRef.current.on("receive_message", (msg) => {
      onMessage(msg);
    });

    return () => {
      socketRef.current.off("receive_message");
      disconnectChatSocket();
    };
  }, [roomId, onMessage]);

  const sendMessage = async (text) => {
    const payload = {
      roomId,
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // 1️⃣ realtime
    socketRef.current.emit("send_message", payload);

    // 2️⃣ persist
    try {
      await sendMessageApi(entityId, text);
    } catch (err) {
      console.error("Message persist failed", err);
    }
  };

  return { sendMessage };
};

export default useChatSocket;



// import { useEffect, useRef } from "react";
// import { connectChatSocket, disconnectChatSocket } from "../socket/chatSocket";

// const useChatSocket = ({ onMessage }) => {
//   const socketRef = useRef(null);

//   useEffect(() => {
//     socketRef.current = connectChatSocket();

//     socketRef.current.on("receive_message", (message) => {
//       onMessage(message);
//     });

//     return () => {
//       socketRef.current.off("receive_message");
//       disconnectChatSocket();
//     };
//   }, [onMessage]);

//   const sendMessage = (data) => {
//     socketRef.current.emit("send_message", data);
//   };

//   return { sendMessage };
// };

// export default useChatSocket;
