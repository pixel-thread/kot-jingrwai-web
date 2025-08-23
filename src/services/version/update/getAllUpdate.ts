import { prisma } from "@/lib/database/prisma";
import { Prisma } from "@/lib/database/prisma/generated/prisma";

type Props = {
  where: Prisma.AppVersionWhereInput;
};
export async function getAllUpdate({ where }: Props) {
  return await prisma.appVersion.findMany({ where });
}
