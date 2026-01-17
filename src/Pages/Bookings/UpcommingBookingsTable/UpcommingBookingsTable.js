import React, { useEffect, useState } from "react";
import { getUpcomingBookings } from "../../../utils/APIs/bookingsApis";
import BookingsTable from "../BookingsTable/BookingsTable";

const LIMIT = 10;

const UpcommingBookingsTable = () => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("2026-01-15");
  const [toDate, setToDate] = useState("2026-12-31");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 🔹 USING YOUR fetchData (FIXED ONLY)
  const fetchData = async () => {
    const response = await getUpcomingBookings(
      fromDate,
      toDate,
      page,
      LIMIT
    );

    setData(response?.data?.data || []);
    setTotal(response?.data?.meta?.total || 0);
    setPage(response?.data?.meta?.page || page);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const applyFilters = () => {
    setPage(1);
  };

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

        <button onClick={applyFilters} className="filter-btn">
          Apply
        </button>
      </div>

      {/* Table */}
      <BookingsTable data={data} page={page}limit={LIMIT}/>

      {/* Pagination */}
      {total > LIMIT && (
        <div style={{ marginTop: 16 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span style={{ margin: "0 12px" }}>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default UpcommingBookingsTable;
