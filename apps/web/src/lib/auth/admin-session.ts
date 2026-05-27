import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? "");
}

export async function createAdminSession(username: string) {
  return new SignJWT({ sub: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(getSecret());
}

export async function verifyAdminSession(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload;
}
