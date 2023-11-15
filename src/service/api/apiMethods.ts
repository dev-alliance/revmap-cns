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

export const createBranch = async (data: any) => {
  const response = await baseURL.post("/api/v1/branches/create-branch", data);
  return response.data;
};

export const getBranchList = async () => {
  return await baseURL.get("/api/v1/branches/list-branch");
};

export const getBranchByid = async (id: any) => {
  const response = await baseURL.get(`/api/v1/branches/${id}`);
  return response.data;
};
export const updateBranch = async (id: any, data: any) => {
  const response = await baseURL.put(`/api/v1/branches/upadte/${id}`, data);
  return response.data;
};
export const deleteBranch = async (id: string) => {
  console.log({ id });
  const response = await baseURL.delete(`/api/v1/branches/${id}`);
  return response.data;
};

export const branchFilter = async (data: any) => {
  const response = await baseURL.post(
    "/api/v1/branches/update-general-settings",
    data
  );
  return response.data;
};

export const archiveBranch = async (id: any, data: any) => {
  const response = await baseURL.patch(`/api/v1/branches/archive/${id}`, data);
  return response.data;
};

export const createTeam = async (data: any) => {
  const response = await baseURL.post("/api/v1/teams/create-team", data);
  return response.data;
};

export const getTeamsList = async () => {
  return await baseURL.get("/api/v1/teams/list-teams");
};

export const deleteTeam = async (id: string) => {
  console.log({ id });
  const response = await baseURL.delete(`/api/v1/teams/${id}`);
  return response.data;
};

export const getTeamByid = async (id: any) => {
  const response = await baseURL.get(`/api/v1/teams/${id}`);
  return response.data;
};
export const updateTeam = async (id: any, data: any) => {
  const response = await baseURL.put(`/api/v1/teams/update/${id}`, data);
  return response.data;
};

export const archiveTeam = async (id: any, data: any) => {
  const response = await baseURL.patch(`/api/v1/teams/archive/${id}`, data);
  return response.data;
};

export const getUserList = async () => {
  return await baseURL.get("/api/v1/users/list-user");
};

// Function to update user profile
// export const updateUserProfile = (userId, data) => baseURL.put(`/user/${userId}`, data);

// Similarly, you can define other API calls
