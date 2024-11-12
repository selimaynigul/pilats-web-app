// src/utils/apiHelpers.ts

export const handleError = (error: any) => {
  if (error.response) {
    // Server errors
    console.error("Server Error:", error.response.data);
    return error.response.data;
  } else if (error.request) {
    // Network errors
    console.error("Network Error:", error.request);
    return { message: "Network error, please try again later." };
  } else {
    // Other errors
    console.error("Error:", error.message);
    return { message: error.message };
  }
};
