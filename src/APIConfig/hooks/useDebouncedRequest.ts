import { AxiosRequestConfig } from "axios";
import useSatatefullRequest from "./useSatatefullRequest";

// Generic debounce function that preserves the types of the original function
const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>): ReturnType<T> | void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // Call the original function with the provided arguments
      func(...args);
    }, wait);
  };
};

const useDebounncedRequests = () => {
  const { isLoading, stateFullRequest } = useSatatefullRequest();
  // Defining the requests object using debounced methods and dynamic typing
  const requests = {
    get: async <T>(url: string, params?: {}, config?: AxiosRequestConfig) => {
      const debouncedRequest = debounce(stateFullRequest<T>("get", url, params, config), 500);
      return debouncedRequest();
    },
    post: async <T>(url: string, data?: {}, config?: AxiosRequestConfig) => {
      const debouncedRequest = debounce(stateFullRequest<T>("post", url, data, config), 500);
      return debouncedRequest();
    },
    put: async <T>(url: string, data?: {}, config?: AxiosRequestConfig) => {
      const debouncedRequest = debounce(stateFullRequest<T>("put", url, data, config), 500);
      return debouncedRequest();
    },
    patch: async <T>(url: string, data?: {}, config?: AxiosRequestConfig) => {
      const debouncedRequest = debounce(stateFullRequest<T>("patch", url, data, config), 500);
      return debouncedRequest();
    },
    deleteRequest: async <T>(url: string, data?: {}, config?: AxiosRequestConfig) => {
      const debouncedRequest = debounce(stateFullRequest<T>("delete", url, data, config), 500);
      return debouncedRequest();
    },
  };

  return { isLoading, ...requests };
};

export default useDebounncedRequests;
