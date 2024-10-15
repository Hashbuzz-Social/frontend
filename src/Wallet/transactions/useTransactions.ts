import React from "react"
import useSession from '@wallet/hooks/useSessions';
import { Buffer } from 'buffer'
import { ExecuteTransactionParams } from "@hashgraph/hedera-wallet-connect";

export const useSendTransaction = () => {
    const { dAppConnector } = useSession();

    const handleExecuteTransactionFromBytes = async (trans: Uint8Array) => {
        const transactionList = Buffer.from(trans).toString('base64');
        const params: ExecuteTransactionParams = { transactionList };
        const transactionResponse = await dAppConnector!.executeTransaction(params);
        return transactionResponse;
    };

    return { handleExecuteTransactionFromBytes };
};
