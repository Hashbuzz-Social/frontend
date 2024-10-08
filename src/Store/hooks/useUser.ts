import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { CurrentUser } from "../../types";
import { useStore } from "./useStore";

export const useUser = () => {
  const { dispatch } = useStore();
  const [cookies] = useCookies(["aSToken"]);

  const checkAndUpdateLoggedInUser = useCallback(() => {
    const localData = localStorage.getItem("user");
    if (localData) {
      const currentUser = JSON.parse(localData) as CurrentUser;
      const { aSToken } = cookies;
      dispatch({
        type: "UPDATE_STATE",
        payload: { currentUser, auth: { ast: aSToken, auth: true, deviceId: localStorage.getItem("device_id") ?? "", message: "", refreshToken: "" } },
      });
    }
  }, [dispatch]);

  return {
    checkAndUpdateLoggedInUser,
  };
};

export default useUser;
