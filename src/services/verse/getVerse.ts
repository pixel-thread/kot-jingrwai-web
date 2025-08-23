import { prisma } from "@/lib/database/prisma";

export async function getVerse() {
  return await prisma.bibleVerse.findFirst({
    take: 1,
    where: { quote: { not: "" }, verse: { not: "" } },
    orderBy: { createdAt: "asc" },
  });
}
