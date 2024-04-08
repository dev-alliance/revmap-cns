/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";

export const getList = async (id: any) => {
  return await baseURL.get(`/api/v1/contracts/list-compony/${id}`);
};

export const create = async (data: any) => {
  const response = await baseURL.post("/api/v1/contracts/create", data);
  return response.data;
};

export const deletecontract = async (id: string) => {
  const response = await baseURL.delete(`/api/v1/contracts/${id}`);
  return response.data;
};

export const updateStatus = async (id: any, data: any) => {
  const response = await baseURL.patch(
    `/api/v1/contracts/updte-status/${id}`,
    data
  );
  return response.data;
};

export const updatecontract = async (id: any, data: any) => {
  const response = await baseURL.patch(
    `/api/v1/contracts/createUpdate/${id}`,
    data
  );
  return response.data;
};

export const getcontractById = async (id: any) => {
  const response = await baseURL.get(`/api/v1/contracts/${id}`);
  return response.data;
};
