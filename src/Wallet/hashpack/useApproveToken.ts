import { AccountAllowanceApproveTransaction } from "@hashgraph/sdk";
import { NETWORK } from "../../Utilities/helpers";
import { useHashconnectService } from "./useHashconnectServicce";

export const useApproveToken = () => {
  const { topic, hashconnect } = useHashconnectService();

  const approveToken = async (accountId: any, data: any) => {
    let contract_address: any = process.env.REACT_APP_CONTRACT_ADDRESS;
    const provider = hashconnect?.getProvider(NETWORK, topic!, accountId);
    if (provider) {
      const signer = hashconnect?.getSigner(provider);
      const approvedToken = new AccountAllowanceApproveTransaction().approveTokenAllowance(data?.entityId, accountId, contract_address, data.amount.value * Math.pow(10, data.decimals));
      if (signer) {
        const approveTokenSign = await approvedToken.freezeWithSigner(signer);
        const signApprove = await approveTokenSign.signWithSigner(signer);
        const responseApprove = await signApprove.executeWithSigner(signer);
        return responseApprove;
      } else return false;
    }
    return false;
  };

  return approveToken;
};
