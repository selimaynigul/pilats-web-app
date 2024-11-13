// src/api/constants.ts

export const API_URL =
  "http://193.140.134.43/tomcat/internship-process-management/api";

export const API = {
  INTERNSHIP_PROCESS: {
    INIT: `${API_URL}/internship-process/init`,
    GET_ALL: `${API_URL}/internship-process/get-all`,
    GET: (processId: string) =>
      `${API_URL}/internship-process/get?processId=${processId}`,
    // Add other endpoints...
  },
  // Define other sections (e.g., STUDENT, ACADEMICIAN) similarly
};
