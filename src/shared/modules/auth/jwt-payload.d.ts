export interface IJWTPayload {
  id: number;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}
