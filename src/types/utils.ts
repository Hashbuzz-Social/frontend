export type ModalStatus = "Info" | "Success" | "Error";

export interface ModalState {
  status: ModalStatus;
  message: string;
  isLoading: boolean;
  data?: any;
}


export interface PingResponseData {
  device_id: string;
  hedera_wallet_id: string;
  personal_twitter_handle: string | null;
  available_budget: number;
  last_login: string;
}