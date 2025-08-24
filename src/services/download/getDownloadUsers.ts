import { prisma } from "@/lib/database/prisma";

export async function getDownloadUsers() {
  return await prisma.downloadUsers.findMany({
    select: {
      downloadedAt: true,
      email: true,
    },
  });
}
