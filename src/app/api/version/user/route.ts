import { prisma } from "@/lib/database/prisma";
import { getDownloadUsers } from "@/services/download/getDownloadUsers";
import { handleApiErrors } from "@/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/utils/next-response";

// Get Download Or Install User
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;

    const versionId = searchParams.get("version");
    let installUser;

    if (versionId) {
      installUser = await prisma.appUser.findMany({
        where: { version: { id: versionId || "" } },
      });
    }

    const downloadUser = await getDownloadUsers();

    return SuccessResponse({
      message: "Kot Users",
      data: {
        download: downloadUser,
        install: installUser,
      },
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
