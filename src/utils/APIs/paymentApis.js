import axios from 'axios';
import { authorizeMe, axiosInstance, axiosInstanceNoAuth } from './commonHeadApiLogic.js';

// Ensure authorization header is set before making authenticated requests
const withAuthorization = async (apiFunction, ...args) => {
  try {
    await authorizeMe(); // Ensure the Authorization header is set
    return await apiFunction(...args);
  } catch (error) {
    // Handle errors as necessary
    console.error("Error in API request:", error);
    throw error;
  }
};


export const getPaymentsAPI = (page = 1, limit = 10) => {
  return withAuthorization(() =>
    axiosInstance.get(`/api/admins/payments?page=${page}&limit=${limit}`)
  );
};


// /api/admins/invoices/6969d90b4c3993209c584052

export const downloadInvoiceAPI = (invoiceId) => {
  return withAuthorization(() =>
    axiosInstance.get(`/api/admins/invoices/${invoiceId}`, {
      responseType: "blob", // IMPORTANT for file download
    })
  );
};
