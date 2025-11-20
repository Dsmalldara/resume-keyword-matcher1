import axios, { AxiosRequestConfig } from "axios";

const AXIOS_INSTANCE = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export const storeAccessToken = (newToken: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", newToken);

    const SEVEN_DAYS = 7 * 24 * 60 * 60;
    document.cookie = `access_token=${newToken}; path=/; samesite=lax; secure; max-age=${SEVEN_DAYS}`;
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
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            originalRequest.headers[`Authorization`] =
              `Bearer ${getAccessToken()}`;
            originalRequest.withCredentials = true;
            return AXIOS_INSTANCE(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        storeAccessToken(data.access_token);
        originalRequest.headers[`Authorization`] =
          `Bearer ${data.access_token}`;
        originalRequest.withCredentials = true;

        processQueue(null);
        isRefreshing = false;

        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          document.cookie = `access_token=; path=/; samesite=lax; secure; max-age=0`;
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

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
