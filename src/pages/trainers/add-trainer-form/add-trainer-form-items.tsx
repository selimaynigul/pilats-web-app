export const addTrainerFormItems = {
  name: {
    label: "Name",
    rules: [{ required: true, message: "Please enter the trainer's name" }],
  },
  surname: {
    label: "Surname",
    rules: [{ required: true, message: "Please enter the trainer's surname" }],
  },
  title: {
    label: "Title",
    rules: [{ required: true, message: "Please enter the trainer's title" }],
  },
  company: {
    label: "Company",
    rules: [{ required: true, message: "Please select the company" }],
  },
  branch: {
    label: "Branch",
    rules: [{ required: true, message: "Please select the branch" }],
  },
  birthdate: {
    label: "Birth Date",
  },
  gender: {
    label: "Gender",
  },
  email: {
    label: "Email",
    rules: [{ required: true, message: "Please enter a valid email address" }],
  },
  phoneNumber: {
    label: "Phone Number",
    rules: [{ required: true, message: "Please enter the phone number" }],
  },
};
