import { useStore } from "@store/hooks";
import axios, { AxiosInstance } from "axios";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/helpers";


const generateUniqueId = () => {
  // Simple random ID generator
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function getOrCreateUniqueID() {
  // Check if the user already has an ID stored in localStorage
  let userId = localStorage.getItem('device_id');

  // If no ID exists, generate one and store it
  if (!userId) {
    userId = generateUniqueId(); // Use a unique ID generator function
    localStorage.setItem('device_id', userId);
  }

  // Return the ID from localStorage
  return userId;
}



const refreshTokenInterval = 2 * 60 * 1000; // Refresh token every 12 minutes
const useRefreshToken = false; // Flag to enable/disable token refresh

// Create a context
export const AxiosContext = createContext<AxiosInstance | null>(null);

const AxiosProvider: React.FC = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["aSToken", "refreshToken"]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(getOrCreateUniqueID());
  const { auth, dispatch } = useStore();

  const axiosInstance = useRef<AxiosInstance>(
    axios.create({
      baseURL: process.env.REACT_APP_DAPP_API,
      timeout: 15000,
      headers: {
        "Content-type": "application/json",
      },
    })
  );

  const refreshAccessToken = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      // Your logic to refresh the token
      const response = await axiosInstance.current.post<{ ast: string; message: string }>("/auth/refresh-token", {
        refreshToken: cookies.refreshToken,
      });
      const newToken = response.data.ast;
      setCookie("aSToken", newToken, { path: "/" });
      toast.success("Token refreshed successfully.");
    } catch (error) {
      toast.error("Failed to refresh token. Please log in again.");
      // handleLogout(); // Uncomment and define this function if you need to handle logout
    } finally {
      setIsRefreshing(false);
    }
  };


  /** When 401  Error code found just invalidate and remove current tokens  */
  const inValidateAuthentication = () => {
    console.log("Unauthorized::Invalidating authentication and clearing cookies");
    removeCookie("aSToken");
    removeCookie("refreshToken");
    dispatch({ type: "RESET_STATE" });
  }

  useEffect(() => {
    if (useRefreshToken) {
      const intervalId = setInterval(() => {
        refreshAccessToken();
      }, refreshTokenInterval);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [cookies.refreshToken]);


  // Manage device client id and set it in the header
  useEffect(() => {

    // Ifd device id is not set or changed then set it
    if (!deviceId) {
      setDeviceId(getOrCreateUniqueID());
    }
  }, [deviceId]);

  useEffect(() => {
    const instance = axiosInstance.current;

    const requestInterceptor = instance.interceptors.request.use(
      (config) => {
        if (config.headers && deviceId) {
          config.headers["X-Device-ID"] = deviceId;
        }
        const token = cookies.aSToken;
        if (token && config.headers) {
          config.headers["Authorization"] = `aSToken ${token}`;
        } else if (!token && config.headers && auth?.ast) {
          config.headers["Authorization"] = `aSToken ${auth.ast}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log("error from instance", error);

        if (!error.response) {
          console.error("Network error or server is offline:", error.message);
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
            default:
              toast.error(getErrorMessage(error));
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on component unmount
    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [cookies.aSToken, auth?.ast, deviceId]);

  return <AxiosContext.Provider value={axiosInstance.current}>{children}</AxiosContext.Provider>;
};

export const useAxios = () => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};

export default AxiosProvider;
