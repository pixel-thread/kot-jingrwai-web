import { prisma } from "@/lib/database/prisma";

type Props = {
  verse: string;
  quote: string;
};
export async function addVerse({ verse, quote }: Props) {
  await prisma.bibleVerse.create({
    data: {
      quote,
      verse,
    },
  });
}
