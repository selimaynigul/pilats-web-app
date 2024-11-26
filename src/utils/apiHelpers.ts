import { message } from "antd";

export const handleError = (error: any) => {
  if (error.response) {
    // Server errors
    const { status, data } = error.response;
    const errorMessage =
      data?.message || `Server error occurred (Code: ${status})`;
    message.error(errorMessage);
    return data;
  } else if (error.request) {
    // Network errors
    const errorMessage = "Network error, please check your connection.";
    message.error(errorMessage);
    return { message: errorMessage };
  } else {
    // Other errors
    const errorMessage = error.message || "An unexpected error occurred.";
    message.error(errorMessage);
    return { message: errorMessage };
  }
};
