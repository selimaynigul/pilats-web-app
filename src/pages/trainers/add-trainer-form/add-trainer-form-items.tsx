import { hasRole } from "utils/permissionUtils";

export const addTrainerFormItems = {
  name: {
    rules: [{ required: true, message: "Please enter the trainer's name" }],
  },
  surname: {
    rules: [{ required: true, message: "Please enter the trainer's surname" }],
  },
  title: {
    rules: [{ required: true, message: "Please enter the trainer's title" }],
  },
  company: {},
  branch: {
    rules: [
      {
        required: !hasRole(["BRANCH_ADMIN"]),
        message: "Please select the branch",
      },
    ],
  },
  birthdate: {},
  gender: {},
  email: {
    rules: [{ required: true, message: "Please enter a valid email address" }],
  },
  phoneNumber: {
    rules: [{ required: true, message: "Please enter the phone number" }],
  },
};
