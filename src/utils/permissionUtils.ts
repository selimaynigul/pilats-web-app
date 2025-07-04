import { message } from "antd";
import {
  branchAdminService,
  companyAdminService,
  companyService,
} from "services";

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse user data from localStorage:", error);
    return null;
  }
};

export const getBranchId = () => {
  const user = getUser();
  return user?.branchId || null;
};

export const getCompanyId = () => {
  const user = getUser();
  return user?.companyId || null;
};

export const getCompanyName = () => {
  const user = getUser();

  if (hasRole(["BRANCH_ADMIN"])) {
    return `${user?.companyName} - ${user?.branchName}`;
  } else if (hasRole(["COMPANY_ADMIN"])) {
    return user?.companyName || null;
  }
};

export const capitalize = (str: string) =>
  str
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join the array back into a single string

export const getUserName = () => {
  const user = getUser();

  if (!user) return null;
  if (user.name) return user.name;
  if (!user.ucGetResponse) return null;

  const name = capitalize(user.ucGetResponse.name || "");
  const surname = capitalize(user.ucGetResponse.surname || "");

  return `${name} ${surname}`.trim();
};

export const getToken = () => {
  const user = getUser();
  return user?.token || null;
};

export const getUserRole = () => {
  const user = getUser();
  const role = user?.role;
  let res;

  if (role === "BRANCH_ADMIN") {
    res = "Branch Admin";
  } else if (role === "COMPANY_ADMIN") {
    res = "Company Admin";
  } else if (role === "ADMIN") {
    res = "Admin";
  }
  return res;
};

export const updateUser = () => {
  const user = getUser();
  const role = user?.role;

  if (role === "ADMIN") {
  } else if (role === "COMPANY_ADMIN") {
    companyAdminService
      .getById(user.userId)
      .then((res) => {
        const combinedData = { ...user, ...res.data };
        localStorage.setItem("user", JSON.stringify(combinedData));
      })
      .catch((err) => {
        console.error("Error fetching company admin data:", err);
      });
  } else if (role === "BRANCH_ADMIN") {
    branchAdminService
      .getById(user.userId)
      .then((res) => {
        const combinedData = { ...user, ...res.data };
        localStorage.setItem("user", JSON.stringify(combinedData));
      })
      .catch((err) => {
        console.error("Error fetching branch admin data:", err);
      });
  }

  return Promise.resolve(null);
};

const navigateToCompanyPage = (companyId: string) => {
  const route = `./companies/${companyId}`;
  window.location.href = route;
};

export const loginWithUpdate = (from: string) => {
  const user = getUser();
  const role = user?.role;

  if (role === "ADMIN") {
    const combinedData = { ...user, name: "Admin" };
    localStorage.setItem("user", JSON.stringify(combinedData));
    window.location.href = from || "./companies";
    return true;
  } else if (role === "COMPANY_ADMIN") {
    companyAdminService
      .getById(user.userId)
      .then((res) => {
        const combinedData = { ...user, ...res.data };
        localStorage.setItem("user", JSON.stringify(combinedData));
        const companyId = res.data?.companyId;
        if (companyId) {
          navigateToCompanyPage(companyId);
        } else {
          console.error("Company ID not found for Company Admin.");
        }
        return true;
      })
      .catch((err) => {
        console.error("Error fetching company admin data:", err);
        window.location.href = "./sessions";
        return false;
      });
  } else if (role === "BRANCH_ADMIN") {
    branchAdminService
      .getById(user.userId)
      .then((res) => {
        const combinedData = { ...user, ...res.data };
        localStorage.setItem("user", JSON.stringify(combinedData));
        const companyId = res.data?.companyId;
        if (companyId) {
          navigateToCompanyPage(companyId);
        } else {
          console.error("Company ID not found for Branch Admin.");
        }
        return true;
      })
      .catch((err) => {
        console.error("Error fetching branch admin data:", err);
        window.location.href = "./sessions";
        return false;
      });
  }
};

type UserRole = "BRANCH_ADMIN" | "COMPANY_ADMIN" | "ADMIN";

export const hasRole = (roles: UserRole[]) => {
  const user = getUser();
  if (!user || !user.role) {
    console.warn("User or role not found in user object.");
    return false;
  }

  return roles.includes(user.role);
};
