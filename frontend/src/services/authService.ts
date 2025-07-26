import axiosInstance from './axiosSetup';

export const callLoginAPI = async (payload: { email: string; password: string }) => {
  const response = await axiosInstance.post('/users/login', payload);
  return response.data;
};
export const callRegisterAPI = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/users/register", payload);
  return response.data;
};