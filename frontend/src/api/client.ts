import axios, { AxiosRequestConfig } from "axios";

const AXIOS_INSTANCE = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export const storeAccessToken = (newToken: string) => {
  if (typeof window !== "undefined") {
    const token = getAccessToken();
    if (!token) {
      // Store in localStorage for client-side access
      localStorage.setItem("access_token", newToken);
      // Also store in a readable cookie for middleware access
      const SEVEN_DAYS = 7 * 24 * 60 * 60; // 604800 seconds

      document.cookie = `access_token=${newToken}; path=/; samesite=lax; secure; max-age=${SEVEN_DAYS}`;
    }
  }
};

export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
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
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");

          document.cookie = `access_token=; path=/; samesite=lax; secure; max-age=0`;

          // Use window.location for client-side redirect
          window.location.href = "/auth/login";
        }

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
