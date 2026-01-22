import React, { useEffect, useState } from "react";
import { getQuotesAPI } from "../../utils/APIs/quoteApis";
import QuoteTable from "./QuoteTable/QuoteTable";
import Loader from "../../Loader/Loader";

const MyQuote = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const stored = sessionStorage.getItem("isSidebarOpen");
    return stored !== null ? JSON.parse(stored) : true;
  });
  const LIMIT = 10;

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

  const mapQuotesResponse = (quotes = []) =>
  quotes.map((item) => ({
    id: item._id || "-",
    eventType: item.eventType || "-",
    eventDate: new Date(item.eventDate).toLocaleDateString("en-IN") || "-",
    location: item.location || "-",
    duration: `${item.eventDuration} hrs` || "-",
    photography: item.photographyRequirements || "-",
    budget: `₹${Number(item.budget).toLocaleString("en-IN")}` || "-",
    name: item.clientId?.username || item.clientName || "-",
    phone: item.phoneNumber || "-",
    email: item.email || "-",
    status: item.quoteStatus || "-",
  }));


  const fetchQuotes = async () => {
  setLoading(true); // 🔴 missing

  try {
    const res = await getQuotesAPI(page, 10);

    setQuotes(mapQuotesResponse(res?.data?.data));
    setTotal(res?.data?.meta?.total);
  } catch (err) {
    console.error("Quotes fetch failed", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchQuotes();
  }, [page]);
  
   const totalPages = Math.ceil(total / LIMIT);

  if (loading) return <Loader/>;

  return (
  


    <div
  className={`content-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
  style={{ marginTop: "100px" }}
>
    <div className="my-quote-page page-inner-wrapper">
      <h2 className="page-title">My Quote</h2>

      <QuoteTable data={quotes} />

      {/* Pagination (basic) */}
      {/* <div style={{ marginTop: 16 }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span style={{ margin: "0 12px" }}>
          Page {page}
        </span>
        <button
          disabled={page * 10 >= total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div> */}

      {total > LIMIT && (
  <div className="pagination">
    <button
      className="pagination-btn"
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
    >
      Prev
    </button>

    <span className="pagination-info">
      Page {page} of {totalPages}
    </span>

    <button
      className="pagination-btn"
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
    >
      Next
    </button>
  </div>
)}
    </div>
</div>
  );
};

export default MyQuote;
