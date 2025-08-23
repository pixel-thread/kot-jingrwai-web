import { prisma } from "@/lib/database/prisma";
import { getLatestUpdate } from "@/services/version/getLatestUpdate";
import { getAllUpdate } from "@/services/version/update/getAllUpdate";
import { handleApiErrors } from "@/utils/errors/handleApiErrors";
import { logger } from "@/utils/logger";
import { ErrorResponse, SuccessResponse } from "@/utils/next-response";
import { z } from "zod";

const schema = z.object({
  version: z.string(),
  title: z.string(),
  description: z.array(z.string()),
  mandatory: z.boolean(),
  platforms: z.array(z.enum(["ios", "android"])).optional(),
  releaseNotesUrl: z.string(),
  minSupportedVersion: z.string(),
  releaseDate: z.string(),
  author: z.string(),
  additionalInfo: z.object({
    estimatedDowntime: z.string(),
    rollbackAvailable: z.boolean(),
  }),
});

const uuid = z.uuid("uuid");

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const versionId = searchParams.get("version");
    const deviceId = searchParams.get("id");

    const version = getLatestUpdate();

    if (deviceId && uuid.safeParse(deviceId).success) {
      const isDeviceExist = await prisma.appUser.findUnique({
        where: { deviceId },
      });

      if (!isDeviceExist) {
        await prisma.appUser.create({
          data: {
            lastUsedAt: new Date(),
            deviceId,
            version: { connect: { id: versionId || "" } },
          },
        });
      }
      await prisma.appUser.update({
        where: { deviceId: deviceId },
        data: { lastUsedAt: new Date() },
      });
    }

    return SuccessResponse({ message: "latest update", data: version });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const isVersionExists = await getAllUpdate({
      where: { version: body.version },
    });

    if (isVersionExists.length > 0) {
      return ErrorResponse({
        message: "Version already exists || other update is still active",
        data: { isVersionExists },
      });
    }

    const latestUpdate = await getLatestUpdate();

    if (latestUpdate) {
      await prisma.appVersion.update({
        where: { id: latestUpdate.id },
        data: { status: "INACTIVE" },
      });
    }

    const version = await prisma.appVersion.create({
      data: {
        version: body.version,
        title: body.title,
        description: body.description,
        mandatory: body.mandatory,
        platforms: body.platforms,
        releaseNotesUrl: body.releaseNotesUrl,
        minSupportedVersion: body.minSupportedVersion,
        releaseDate: new Date(),
        author: body.author,
        additionalInfo: body.additionalInfo,
      },
    });
    return SuccessResponse({ message: "version created", data: version });
  } catch (error) {
    return handleApiErrors(error);
  }
}
