import axios, { AxiosRequestConfig } from "axios";

const AXIOS_INSTANCE = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export const storeAccessToken = (newToken: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("access_token", newToken);
  }
};
export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("access_token");
  }
  return null;
};

// Add auth token to request
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => Promise.reject(error),
);

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error.response exists before accessing it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        storeAccessToken(data.access_token);
        originalRequest.headers[`Authorization`] =
          `Bearer ${data.access_token}`;
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Important: reject the error so it propagates
    return Promise.reject(error);
  },
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return AXIOS_INSTANCE({ ...config, ...options })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
