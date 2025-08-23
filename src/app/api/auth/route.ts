import { handleApiErrors } from "@/utils/errors/handleApiErrors";
import { getUserById } from "@/services/user/getUserById";
import { SuccessResponse } from "@/utils/next-response";
import { logger } from "@/utils/logger";
import { createUser } from "@/services/user/createUser";
import { requiredAuthToken } from "@/utils/middleware/requiredAuthToken";
import { clientClerk } from "@/lib/clerk/client";

export async function GET(req: Request) {
  try {
    const id = await requiredAuthToken(req);
    let user = await getUserById({ id });

    if (!user) {
      const clerkUser = await clientClerk.users.getUser(id);
      if (clerkUser) {
        logger.info({ message: "Creating new user" });
        user = await createUser({
          data: {
            name: clerkUser.firstName ?? "",
            email: clerkUser.emailAddresses[0].emailAddress,
            clerkId: id,
            hasImage: clerkUser.hasImage,
            imageUrl: clerkUser.imageUrl,
          },
        });
      }
    }

    return SuccessResponse({
      data: user,
      message: "User verified (created if absent)",
    });
  } catch (err) {
    return handleApiErrors(err);
  }
}
