import { toast } from "react-toastify";
import { useApiInstance } from "../APIConfig/api";
import { CreateTransactionEntity } from "../types";
import useSession from "./hooks/useSessions";
import { useSendTransaction } from "./transactions/useTransactions";
import { useBalances } from "@store/hooks";

export const useSmartContractServices = () => {
  const { state: wcState } = useSession();
  const { selectedSigner } = wcState;
  const pairedAccount = selectedSigner?.getAccountId().toString();

  const { handleExecuteTransactionFromBytes } = useSendTransaction();
  const { Transaction } = useApiInstance();
  const { startBalanceQueryTimer } = useBalances();

  const topUpAccount = async (entity: CreateTransactionEntity) => {
    try {
      if (pairedAccount) {
        const transactionBytes = await Transaction.createTransactionBytes({ entity, connectedAccountId: pairedAccount });
        const updateBalanceTransaction = await handleExecuteTransactionFromBytes(transactionBytes);

        const transactionId = updateBalanceTransaction.result?.transactionId;

        console.log(updateBalanceTransaction, "top up response");

        if (transactionId) {
          const getBal = await Transaction.setTransactionAmount({
            entity,
            response: typeof updateBalanceTransaction === "object" ? JSON.stringify(updateBalanceTransaction) : updateBalanceTransaction,
            transactionId,
          });

          if (getBal.message) {
            getBal.error ? toast.error(getBal.message ?? "Error with request for balance update.") : toast.info(getBal.message);
          }
          startBalanceQueryTimer();
          return updateBalanceTransaction;
        }
      }
    } catch (err: any) {
      console.log(err, "top up error");
      toast.error(err?.response?.data?.message);
    }
  };

  return { topUpAccount };
};
