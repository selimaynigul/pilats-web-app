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

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const getUserName = () => {
  const user = getUser();
  if (!user || !user.ucGetResponse) return null;

  const name = capitalize(user.ucGetResponse.name || "");
  const surname = capitalize(user.ucGetResponse.surname || "");

  return `${name} ${surname}`.trim();
};

export const getToken = () => {
  const user = getUser();
  return user?.token || null;
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

  return Promise.resolve(null); // Default case for unsupported roles
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
