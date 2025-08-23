import { prisma } from "@/lib/database/prisma";
import { getDownloadUserByEmail } from "@/services/user/getUserByEmail";
import { getLatestUpdate } from "@/services/version/getLatestUpdate";
import { handleApiErrors } from "@/utils/errors/handleApiErrors";
import { ErrorResponse, SuccessResponse } from "@/utils/next-response";
import { authSchema } from "@/utils/validation/auth";
import { env } from "@/env";

export async function POST(req: Request) {
  try {
    const body = authSchema.pick({ email: true }).parse(await req.json());
    const latestUpdate = await getLatestUpdate();

    if (!latestUpdate) {
      return ErrorResponse({
        message: "Latest update not found",
        data: null,
      });
    }

    let user = await getDownloadUserByEmail({
      email: body.email,
      id: latestUpdate.id,
    });

    if (!user) {
      user = await prisma.downloadUsers.create({
        data: {
          email: body.email,
          downloadedAt: new Date(),
          appVersionId: latestUpdate?.id,
        },
      });
    }

    await prisma.downloadUsers.update({
      where: { id: user?.id || "" },
      data: { downloadedAt: new Date() },
    });

    const getDownloadLink = `${env.NEXT_PUBLIC_BASE_URL}/release/kot-jingrwai.apk`;

    return SuccessResponse({
      data: { url: getDownloadLink },
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
