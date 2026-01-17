import React, { useEffect, useState } from "react";
import { getPreviousBookingsAPI } from "../../../utils/APIs/bookingsApis";
import BookingsTable from "../BookingsTable/BookingsTable";

const LIMIT = 10;

const PreviousBookingsTable = () => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2026-01-14");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pageNo = page) => {
    setLoading(true);
    try {
      const res = await getPreviousBookingsAPI(fromDate, toDate, pageNo, LIMIT);

      setData(res.data?.data || []);
      setTotal(res.data?.data?.meta?.total || 0);
      setPage(res.data?.data?.meta?.page || pageNo);
    } catch (err) {
      console.error("Previous bookings fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1); // load first page initially
  }, []);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      {/* Filters */}
      <div className="filters">
        <div>
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          onClick={() => fetchData(1)}
          className="filter-btn"
          disabled={loading}
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <BookingsTable data={data} page={page} limit={LIMIT}/>

      {/* Pagination */}
      {total > LIMIT && (
        <div className="pagination">
          <button
            disabled={page === 1 || loading}
            onClick={() => fetchData(page - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages || loading}
            onClick={() => fetchData(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default PreviousBookingsTable;
