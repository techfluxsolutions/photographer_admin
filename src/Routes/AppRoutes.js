import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../AuthModule/Login/Login";
import Layout from "../Template/LayoutMain/LayoutMain/Layout";
import InternetChecker from "../utils/InternetChecker/InternetChecker";
import ScrollToTop from "../utils/scrollToTop/ScrollToTop";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Bookings from "../Pages/Bookings/Bookings";
import MyQuote from "../Pages/MyQuote/MyQuote";
import Payment from "../Pages/Payment/Payment";
import Customer from "../Pages/Customer/Customer";
import Chats from "../Pages/Chats/Chats";

const AppRoutes = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // ✅ UI-ONLY PRIVATE ROUTE
  const PrivateRoute = ({ children }) => {
    const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <>
      <ScrollToTop />
      {isOffline && <InternetChecker />}

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        {/* Protected Routes */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/my-quote" element={<MyQuote />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/chat/booking/:bookingId" element={<Chats chatType="booking" />} />
          <Route path="/chat/quote/:quoteId" element={<Chats chatType="quote" />} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
