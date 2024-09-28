// hooks/useDebouncedRequests.ts
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { useState } from "react";
import { useAxios } from "../AxiosProvider";

let cancelTokens: Record<string, CancelTokenSource> = {};

export const useSatatefullRequest = () => {
  const axiosInstance = useAxios();
  const [isLoading, setIsLoading] = useState(false);

  const cancelRequest = (key: string) => {
    if (cancelTokens[key]) {
      cancelTokens[key].cancel(`Cancelled request for ${key}`);
      delete cancelTokens[key];
    }
  };

  const stateFullRequest = <T>(method: string, url: string, bodyOrParams?: {}, config?: AxiosRequestConfig): (() => Promise<T | undefined>) => {
    return async () => {
      setIsLoading(true);
      cancelRequest(method + url);
      const cancelTokenSource = axios.CancelToken.source();
      cancelTokens[method + url] = cancelTokenSource;

      try {
        const response = await axiosInstance({
          method,
          url,
          data: method !== "get" ? bodyOrParams : undefined,
          params: method === "get" ? bodyOrParams : undefined,
          cancelToken: cancelTokenSource.token,
          ...config,
        });

        return response.data as T;
      } catch (error) {
        if (axios.isCancel(error)) {
          //@ts-ignore
          console.log("Request cancelled:", error.message);
        } else {
          console.error("Error:", error);
          throw error;
        }
      } finally {
        setIsLoading(false);
        delete cancelTokens[method + url];
      }
    };
  };

  return { isLoading, stateFullRequest };
};

export default useSatatefullRequest;
