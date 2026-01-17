import React from "react";
import { downloadInvoiceAPI } from "../../../utils/APIs/paymentApis";
import "./PaymentTable.css";

const PaymentTable = ({ data }) => {

  const handleDownload = async (invoiceId) => {
    console.log("data",data)
    console.log("invoiceId",invoiceId)
    try {
      const res = await downloadInvoiceAPI(invoiceId);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice download failed", err);
      alert("Failed to download invoice");
    }
  };

  return (
    <div className="quote-table-wrapper">
      <table className="quote-table">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Booking ID</th>
            <th>Invoice ID</th>
            <th>Total Amount</th>
            <th>Paid Amount</th>
            <th>Pending Amount</th>
            <th>Invoice</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.bookingId}</td>
              <td>{item.invoiceId}</td>
              <td>{item.totalAmount}</td>
              <td>{item.paidAmount}</td>
              <td>{item.pendingAmount}</td>

              <td>
                <button
                  className="download-btn"
                  onClick={() => handleDownload(item.invoiceDbId)}
                >
                  ⬇
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
