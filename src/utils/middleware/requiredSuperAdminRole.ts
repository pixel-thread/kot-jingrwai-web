import { getUserById } from "@/services/user/getUserById";
import { NextRequest } from "next/server";
import { requiredAuthToken } from "./requiredAuthToken";
import { UnauthorizedError } from "@/utils/errors/unAuthError";

export async function requiredSuperAdminRole(req: Request | NextRequest) {
  const id = await requiredAuthToken(req);

  const user = await getUserById({ id: id });

  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  if (user.role !== "SUPER_ADMIN") {
    throw new UnauthorizedError("Unauthorized");
  }

  return user;
}
