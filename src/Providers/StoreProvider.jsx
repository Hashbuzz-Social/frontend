import React from "react";
import { useCookies } from "react-cookie";
import { useDappAPICall } from "../APIConfig/dAppApiServices";
import { delay } from "../Utilities/Constant";

const StoreContext = React.createContext({
  state: {},
  setStore: Function,
});

export const StoreProvider = ({ children }) => {
  const [state, setState] = React.useState({
    available_budget: 0,
    username: "",
    brandAccount: "",
    token: "",
    user: {},
  });
  const { dAppAPICall } = useDappAPICall();
  const [cookies] = useCookies(["token"]);

  const getBalances = React.useCallback(async () => {
    let localData = localStorage.getItem("user");
    if (localData) {
      localData = JSON.parse(localData);
      setState((_d) => ({ ..._d, user: localData, token: cookies.token }));
    }
    try {
      const data = await dAppAPICall({
        url: "users/get-balances",
        method: "POST",
        data: {
          accountId: localData.hedera_wallet_id,
          contractBal: false,
        },
      });
      if (data.available_budget) setState((p) => ({ ...p, available_budget: data.available_budget }));
    } catch (error) {
      console.log(error);
    }
  }, [cookies.token, dAppAPICall]);

  React.useEffect(() => {
    (async () => {
      await delay(1500);
      await getBalances();
    })();
  }, []);

  const value = React.useMemo(
    () => ({
      state,
      setState,
    }),
    [state]
  );

  return <StoreContext.Provider value={{ state: value.state, setStore: value.setState }}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const value = React.useContext(StoreContext);
  return value;
};