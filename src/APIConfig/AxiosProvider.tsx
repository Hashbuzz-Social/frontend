import { useStore } from "@store/hooks";
import axios, { AxiosInstance } from "axios";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/helpers";

const generateUniqueId = () => {
  return "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

function getOrCreateUniqueID() {
  let userId = localStorage.getItem("device_id");
  if (!userId) {
    userId = generateUniqueId();
    localStorage.setItem("device_id", userId);
  }
  return userId;
}

const refreshTokenInterval = 2 * 60 * 1000;
const useRefreshToken = false;

export const AxiosContext = createContext<AxiosInstance | null>(null);

const AxiosProvider: React.FC = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["aSToken", "refreshToken"]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(getOrCreateUniqueID());
  const { auth, dispatch } = useStore();

  // Memoized axios instance
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: process.env.REACT_APP_DAPP_API,
      timeout: 15000,
      headers: {
        "Content-type": "application/json",
      },
    });
  }, []);

  // Memoized function to refresh access token
  const refreshAccessToken = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const response = await axiosInstance.post<{ ast: string; message: string }>("/auth/refresh-token", {
        refreshToken: cookies.refreshToken,
      });
      const newToken = response.data.ast;
      setCookie("aSToken", newToken, { path: "/" });
      toast.success("Token refreshed successfully.");
    } catch (error) {
      toast.error("Failed to refresh token. Please log in again.");
      // Optionally handle logout
    } finally {
      setIsRefreshing(false);
    }
  }, [cookies.refreshToken, isRefreshing, setCookie, axiosInstance]);

  // Memoized function to invalidate authentication
  const inValidateAuthentication = useCallback(() => {
    console.log("Unauthorized::Invalidating authentication and clearing cookies");
    removeCookie("aSToken");
    removeCookie("refreshToken");
    dispatch({ type: "RESET_STATE" });
  }, [removeCookie, dispatch]);

  useEffect(() => {
    if (useRefreshToken) {
      const intervalId = setInterval(() => {
        refreshAccessToken();
      }, refreshTokenInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshAccessToken]);

  useEffect(() => {
    if (!deviceId) {
      setDeviceId(getOrCreateUniqueID());
    }
  }, [deviceId]);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (config.headers && deviceId) {
          config.headers["X-Device-ID"] = deviceId;
        }
        const token = cookies.aSToken;
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        } else if (!token && config.headers && auth?.ast) {
          config.headers["Authorization"] = `Bearer ${auth.ast}`;
        }
        console.log(`Request config::${config.url}`, config.headers);
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          toast.error("Unable to connect to the server. Please check your network connection or try again later.");
        } else {
          const status = error.response.status;
          switch (status) {
            case 401:
              inValidateAuthentication();
              toast.error("Unauthorized access OR Session expired. Authentication required.");
              break;
            case 500:
              toast.error("An internal server error occurred. Please try again later.");
              break;
            case 429:
              toast.warn(
                <div>
                  <strong>Too many requests!</strong>
                  <p>Please try again later.</p>
                </div>
              );
              break;
            default:
              toast.error(getErrorMessage(error));
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [cookies.aSToken, auth?.ast, deviceId, inValidateAuthentication, axiosInstance]);

  return <AxiosContext.Provider value={axiosInstance}>{children}</AxiosContext.Provider>;
};

export const useAxios = () => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};

export default AxiosProvider;
