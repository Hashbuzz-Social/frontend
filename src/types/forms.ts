import { CurrentUser } from "./users";

export interface FormFelid<T> {
  value: T;
  error: boolean;
  helperText: string;
  showPassword?: boolean;
}

export type  AdminPasswordFormState = {
  email: FormFelid<string>;
  password: FormFelid<string>;
};

export type AdminUpdatePassword = {
  email?: string;
  password: string;
};

export type UpdatePasswordResponse = {
  message:string,
  user?:CurrentUser
}

export type AdminLoginResponse  = {
  message:string,
  user:CurrentUser,
  adminToken:string
}