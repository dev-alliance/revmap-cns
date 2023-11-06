/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";
export const signU = async (data: any) => {
  const response = await baseURL.post("/api/v1/admin/create-user", data);
  return response.data;
};

export const login = async (data: any) => {
  const response = await baseURL.post("/api/v1/admin/login", data);
  return response.data;
};
export const forgotPass = async (data: any) => {
  const response = await baseURL.post(
    "/api/v1/admin/request-password-reset",
    data
  );
  return response.data;
};

export const verifyOtp = async (data: any) => {
  const response = await baseURL.post("/api/v1/admin/verify-otp", data);
  return response.data;
};

export const verifyForgotPass = async (data: any) => {
  const response = await baseURL.post(
    "/api/v1/admin/verify-ForgotPass-otp",
    data
  );
  return response.data;
};

export const resetPaasword = async (data: any) => {
  const response = await baseURL.post("/api/v1/admin/reset-password", data);
  return response.data;
};
export const CreateCompony = async (data: any) => {
  const response = await baseURL.post("/api/v1/companies/create", data);
  return response.data;
};

// export const fetchUserProfile = () => baseURL.get('/user/profile');

// Function to update user profile
// export const updateUserProfile = (userId, data) => baseURL.put(`/user/${userId}`, data);

// Similarly, you can define other API calls
