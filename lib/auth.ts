import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const TOKEN_NAME = 'admin_token';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(payload: { userId: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as { userId: string; email: string };
}

export async function getSessionUser() {
  const token = (await cookies()).get(TOKEN_NAME)?.value;
  if (!token) return null;

  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export { TOKEN_NAME };
