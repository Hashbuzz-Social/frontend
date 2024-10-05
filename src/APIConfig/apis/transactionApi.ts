import useDebounncedRequests from "../hooks/useDebouncedRequest";
import { CreateTransactionByteBody, reimburseAmountBody, SetTransactionBody, TopUpResponse } from "../../types";

export const useTransactionApi = () => {
  const { post } = useDebounncedRequests();

  const Transaction = {
    createTransactionBytes: (data: CreateTransactionByteBody): Promise<Uint8Array> =>
      post<Uint8Array>("/api/transaction/create-topup-transaction", { ...data }).then((response) => {
        if (!response) {
          throw new Error("Failed to create transaction bytes");
        }
        return response;
      }),
    setTransactionAmount: (data: SetTransactionBody): Promise<TopUpResponse> =>
      post<TopUpResponse>("/api/transaction/top-up", { ...data }).then((response) => {
        if (!response) {
          throw new Error("Failed to set transaction amount");
        }
        return response;
      }),
    reimburseAmount: (data: reimburseAmountBody): Promise<any> => post("/api/transaction/reimbursement", { ...data }),
  };

  return { ...Transaction };
};

export default useTransactionApi;
