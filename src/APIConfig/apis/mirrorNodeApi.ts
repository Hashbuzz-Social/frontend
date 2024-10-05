import { TokenInfo } from "@hashgraph/sdk";
import axios from "axios";
import { BalanceResponse } from "../../types";

export const useMirrorNodeApi = () => {
  const MirrorNodeRestAPI = {
    getTokenInfo: (tokenId: string) => axios.get<TokenInfo>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/tokens/${tokenId}`),
    getBalancesForAccountId: (accountId: string) => axios.get<BalanceResponse>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/balances?account.id=${accountId}`),
  };

  return { ...MirrorNodeRestAPI };
};

export default useMirrorNodeApi;
