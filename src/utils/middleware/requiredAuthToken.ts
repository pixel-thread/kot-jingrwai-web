import { verifyToken } from "@clerk/backend";
import { NextRequest } from "next/server";
import { env } from "@/env";
import { UnauthorizedError } from "../errors/unAuthError";

export async function requiredAuthToken(
  req: NextRequest | Request,
): Promise<string> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Unauthorized");
  }

  const claims = await verifyToken(token, {
    secretKey: env.CLERK_SECRET_KEY, // never expose in client code
  });

  if (!claims?.sub) {
    throw new UnauthorizedError("Unauthorized");
  }

  return claims.sub;
}
