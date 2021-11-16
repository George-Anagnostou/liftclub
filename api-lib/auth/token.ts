export const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  return token;
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};
