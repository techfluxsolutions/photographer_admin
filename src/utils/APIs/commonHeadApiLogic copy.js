// commonHeadApiLogic.js
import axios from "axios";
import { decryptData } from "./../CRYPTO/cryptoFunction";

// Setup axios instances
const baseURL = process.env.REACT_APP_PHOTOGRAPHY_ADMIN_BASE_API_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
});

const axiosInstanceNoAuth = axios.create({
  baseURL,
  timeout: 30000,
});
// 🔥🔥🔥 ADD THIS EXACT LINE
axiosInstance.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
// Response interceptor (keeps your existing behavior)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // NOTE: don't import react-router-dom at top-level in some setups; require inside
    try {
      const { navigate } = require("react-router-dom");
      if (error?.response?.data?.message === "Expired token") {
        console.log("Expired token error....");
        localStorage.clear();
        navigate("/");
      }
    } catch (e) {
      // ignore navigate errors in non-browser contexts (e.g. tests)
    }
    return Promise.reject(error);
  }
);

export function getAccessToken() {
  const encrypted = sessionStorage.getItem("token");
  if (!encrypted) return null;
  const decryptToken=decryptData(encrypted)
  console.log("decryptToken",decryptToken)
  return decryptToken; // 🔑 THIS IS THE FIX
}
// authorizeMe now defensive and returns token or null
export function authorizeMe() {
  try {
    const stored = sessionStorage.getItem("token");
    
      // axiosInstance.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

    if (!stored) {
      delete axiosInstance.defaults.headers.common["Authorization"];

      return null;
    }

    // Try to decrypt
    let token = decryptData(stored);

    // Fallback: if decryptData returns null but stored value looks like a JWT (a.b.c)
    if (!token && typeof stored === "string" && /^\S+\.\S+\.\S+$/.test(stored)) {
      token = stored; // assume plain JWT was stored accidentally
      console.warn("authorizeMe: using plain token fallback (stored token not decryptable).");
    }

    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return token;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
      return null;
    }
  } catch (err) {
    console.error("authorizeMe error:", err);
    delete axiosInstance.defaults.headers.common["Authorization"];
    return null;
  }
}

// Request interceptor ensures header is set before a request
axiosInstance.interceptors.request.use(async (config) => {
  // authorizeMe() is synchronous here (returns token), kept async in case you later want async behavior
  authorizeMe();
  return config;
});

export { axiosInstance, axiosInstanceNoAuth };