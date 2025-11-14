// lib/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

export function signJwt(payload: object) {
  return jwt.sign(
    payload,
    JWT_SECRET as jwt.Secret,
    {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions
  );
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET as jwt.Secret) as T;
}
