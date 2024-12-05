import axios from 'axios';
import xior from 'xior';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
});

export const http = xior.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
});

export default axiosClient;
