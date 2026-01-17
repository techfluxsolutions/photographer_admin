import React, { useEffect, useState } from "react";
import { getCustomersAPI } from "../../utils/APIs/customerApis";
import Loader from "../../Loader/Loader";
import CustomerTable from "./CustomerTable/CustomerTable";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const stored = sessionStorage.getItem("isSidebarOpen");
    return stored !== null ? JSON.parse(stored) : true;
  });

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

  const mapCustomersResponse = (users = []) =>
    users.map((item) => ({
      id: item._id,
      name: item.username || "-",
      email: item.email || "-",
      mobile: item.mobileNumber || "-",
      dob: item.dateOfBirth || "-"
        ? new Date(item.dateOfBirth).toLocaleDateString("en-IN")
        : "-",
      state: item.state || "-",
      city: item.city || "-",
    }));

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomersAPI(page, 10);
      setCustomers(mapCustomersResponse(res?.data?.data));
      setTotal(res?.data?.meta?.total);
    } catch (err) {
      console.error("Customer fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  if (loading) return <Loader />;

  return (
    <div
      className={`content-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
      style={{ marginTop: "100px" }}
    >
      <div className="page-inner-wrapper">
        <h2 className="page-title">Customer</h2>

        <CustomerTable data={customers} />

        <div style={{ marginTop: 16 }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span style={{ margin: "0 12px" }}>Page {page}</span>
          <button
            disabled={page * 10 >= total}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customer;
