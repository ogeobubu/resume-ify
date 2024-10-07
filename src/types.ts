export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}
