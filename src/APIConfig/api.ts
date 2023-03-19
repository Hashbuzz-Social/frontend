import axios, { AxiosInstance, AxiosResponse } from "axios";
import React, { useRef } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { AdminLoginResponse, AdminUpdatePassword, AuthCred, CurrentUser, LogoutResponse, UpdatePasswordResponse } from "../types";
import { forceLogout, getErrorMessage } from "../Utilities/Constant";

export const getCookie = (cname: string) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const useApiInstance = () => {
  const [cookies] = useCookies(["token", "refreshToken", "adminToken"]);
  const instance = useRef<AxiosInstance>(
    axios.create({
      baseURL: process.env.REACT_APP_DAPP_API,
      timeout: 15000,
      headers: {
        Authorization: `Token ${cookies.token}${cookies.adminToken ? " " + cookies.adminToken : ""}`,
        "Content-type": "application/json",
      },
    })
  );

  instance.current.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("error from instance", error);
      // whatever you want to do with the error
      if (error?.response?.status === 401) forceLogout();
      // throw error;
      toast.error(getErrorMessage(error));
    }
  );

  const responseBody = (response: AxiosResponse) => response.data;

  React.useEffect(() => {
    instance.current = axios.create({
      baseURL: process.env.REACT_APP_DAPP_API,
      timeout: 15000,
      headers: {
        Authorization: `Token ${cookies.token}`,
        "Content-type": "application/json",
      },
    });
  }, [cookies.token]);

  const requests = {
    get: (url: string) => instance.current.get(url).then(responseBody),
    post: (url: string, body: {}) => instance.current.post(url, body).then(responseBody),
    put: (url: string, body: {}) => instance.current.put(url, body).then(responseBody),
    delete: (url: string) => instance.current.delete(url).then(responseBody),
    patch: (url: string, body: {}) => instance.current.patch(url, body).then(responseBody),
  };
  const User = {
    getCurrentUser: (): Promise<CurrentUser> => requests.get("/api/users/current"),
    updateConsent: (userData: { consent: boolean }): Promise<CurrentUser> => requests.patch(`/api/users/update-concent`, { ...userData }),
    updateWalletId: (userData: { walletId: string }): Promise<CurrentUser> => requests.put(`/api/users/update/wallet`, { ...userData }),
  };

  const Auth = {
    refreshToken: (refreshToken: string): Promise<AuthCred> => requests.post("/auth/refreshToken", { refreshToken }),
    doLogout: (refreshToken: string): Promise<LogoutResponse> => requests.post("/auth/logout", { refreshToken }),
    adminLogin: (data: { email: string; password: string }): Promise<AdminLoginResponse> => requests.post("/auth/admin-login", { ...data }),
  };

  const Admin = {
    updatePassword: (data: AdminUpdatePassword): Promise<UpdatePasswordResponse> => requests.put("/api/admin/update-password", { ...data }),
  };
  return { User, Auth, Admin };
};
