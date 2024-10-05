export type ModalStatus = "Info" | "Success" | "Error";

export interface ModalState {
  status: ModalStatus;
  message: string;
  isLoading: boolean;
  data?: any;
}
