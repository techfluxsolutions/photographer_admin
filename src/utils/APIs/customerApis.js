import axios from 'axios';
import { authorizeMe, axiosInstance } from './commonHeadApiLogic.js';

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


export const getCustomersAPI  = (page = 1, limit = 10) => {
  return withAuthorization(() =>
    axiosInstance.get( `/api/admins/customers?page=${page}&limit=${limit}`)
  );
};