import { toast } from "react-toastify";
import { useApiInstance } from "../APIConfig/api";
import { useBalances } from "../Store/hooks/useBalances";
import { CreateTransactionEntity } from "../types";

export const useSmartContractServices = () => {
  // const { pairingData } = useHashconnectService();

  // const sendTransaction = useSendTransaction();
  const { Transaction } = useApiInstance();
  const { startBalanceQueryTimer } = useBalances();

  // const topUpAccount = async (entity: CreateTransactionEntity) => {
  // try {
  // if (pairingData?.accountIds) {
  // const transactionBytes = await Transaction.createTransactionBytes({ entity, connectedAccountId: pairingData?.accountIds[0] });
  // const updateBalanceTransaction = await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);
  // const transactionResponse = updateBalanceTransaction?.response;
  // console.log("Transaction of" + entity?.entityType, updateBalanceTransaction);
  // if (updateBalanceTransaction?.success) {
  //   const getBal = await Transaction.setTransactionAmount({
  //     entity,
  //     // response: typeof updateBalanceTransaction === "object" ? JSON.stringify(updateBalanceTransaction) : updateBalanceTransaction,
  //     //@ts-ignore
  //     transactionId: typeof transactionResponse === "object" ? transactionResponse.transactionId : "",
  //   });
  //   if (getBal.message) {
  //     getBal.error ? toast.error(getBal.message ?? "Error with request for balance update.") : toast.info(getBal.message);
  //   }
  //   startBalanceQueryTimer();
  //   // return updateBalanceTransaction;
  // }
  // }
  // } catch (err: any) {
  //   console.log(err, "top up error");
  //   toast.error(err?.response?.data?.message);
  // } finally {
  // }
  // };

  const topUpAccount = async (entity: CreateTransactionEntity) => { };

  return { topUpAccount };
};
