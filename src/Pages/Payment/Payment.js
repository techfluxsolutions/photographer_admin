import React, { useEffect, useState } from "react";
import { getPaymentsAPI } from "../../utils/APIs/paymentApis";
import PaymentTable from "./PaymentTable/PaymentTable";
import Loader from "../../Loader/Loader";

const Payment = () => {
  const [payments, setPayments] = useState([]);
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

  const mapPaymentsResponse = (payments = []) =>
    payments.map((item) => {
      const total =
        (item.upfront_amount || 0) + (item.outstanding_amount || 0);

      return {
        id: item._id,
        bookingId: item.job_id || "-",
        invoiceId: item.invoice_number,
        invoiceDbId: item._id, // 👈 use correct backend id
        totalAmount: `₹${total.toLocaleString("en-IN")}`,
        paidAmount: `₹${item.upfront_amount.toLocaleString("en-IN")}`,
        pendingAmount: `₹${item.outstanding_amount.toLocaleString("en-IN")}`,
      };
    });

  const fetchPayments = async () => {
    setLoading(true);

    try {
      const res = await getPaymentsAPI(page, 10);
      setPayments(mapPaymentsResponse(res?.data?.data));
      setTotal(res?.data?.meta?.total);
    } catch (err) {
      console.error("Payments fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
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
        <h2 className="page-title">Payment</h2>

        <PaymentTable data={payments} />

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

export default Payment;
