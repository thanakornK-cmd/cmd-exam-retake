import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

export async function createMemberSession(memberId: string) {
  return new SignJWT({ sub: memberId, role: "member" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyMemberSession(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
