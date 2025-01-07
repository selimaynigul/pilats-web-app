import { branchAdminService, companyAdminService } from "services";

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
  console.log("branch id:", user);
  return user?.branchId || null;
};

export const getCompanyId = () => {
  const user = getUser();
  return user?.companyId || null;
};

export const updateUser = () => {
  const user = getUser();
  const role = user?.role;

  if (role === "ADMIN") {
    // Handle ADMIN case, if needed
  } else if (role === "COMPANY_ADMIN") {
    companyAdminService
      .getById(user.userId)
      .then((res) => {
        const combinedData = { ...user, ...res.data };
        console.log("Combined Data (COMPANY_ADMIN):", combinedData);
        // Use combinedData as needed
      })
      .catch((err) => {
        console.error("Error fetching company admin data:", err);
      });
  } else if (role === "BRANCH_ADMIN") {
    branchAdminService
      .getById(user.userId)
      .then((res) => {
        const combinedData = { ...user, ...res.data };
        console.log("Combined Data (BRANCH_ADMIN):", combinedData);
        localStorage.setItem("user", JSON.stringify(combinedData));
        // Use combinedData as needed
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
