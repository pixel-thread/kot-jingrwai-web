import { prisma } from "@/lib/database/prisma";

export async function getLatestUpdate() {
  return prisma.appVersion.findFirst({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });
}
