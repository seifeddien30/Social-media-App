export interface LoginDto {
  name: string;
  password: string;
  confirmPassword?: string | undefined;
  age?: number | undefined;
  email: string;
  gender?: string | undefined;
}
interface LoginTokens {
  token: string;
  refreshToken: string;
}
export interface LoginResponse {
  message: string;
  data: LoginTokens;
}

export interface SignupResponse {
  message: string;
  data: {
    name: string;
    email: string;
    phone: string;
    age?: number | undefined;
    gender?: string | undefined;
  };
}
