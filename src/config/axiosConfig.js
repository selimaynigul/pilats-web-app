// axiosConfig.js
const getAxiosConfig = () => {
  const jwtToken = window.localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
};

export default getAxiosConfig;
