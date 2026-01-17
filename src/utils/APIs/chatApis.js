import { authorizeMe, axiosInstance } from "./commonHeadApiLogic";

const withAuthorization = async (apiFunction, ...args) => {
    try {
        await authorizeMe();
        return await apiFunction(...args);
    } catch (error) {
        console.error("Error in API request:", error);
        throw error;
    }
};

export async function getChatMessages(bookingId, params) {
    return withAuthorization(async () => {
        // params can include page, limit
        return await axiosInstance.get(`/api/chat/messages/${bookingId}`, { params });
    });
}

export async function getUserConversations() {
    return withAuthorization(async () => {
        return await axiosInstance.get("/api/chat/conversations");
    });
}

export async function createChatConversation(quoteId) {
    return withAuthorization(async () => {
        return await axiosInstance.post("/api/chat/create-conversation", { quoteId });
    });
}

export async function sendMessageApi(quoteId, message, type = "text") {
    return withAuthorization(async () => {
        return await axiosInstance.post("/api/chat/send-message", { quoteId, message, type });
    });
}
