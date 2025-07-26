import axiosInstance from './axiosSetup';

export const callLoginAPI = async (payload: { email: string; password: string }) => {
  const response = await axiosInstance.post('/v1/user/login', payload);
  return response.data;
};
export const callRegisterAPI = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/v1/user/register", payload);
  return response.data;
};