import { addVerse } from "@/services/verse/addVerse";
import { deleteVerse } from "@/services/verse/deleteVerse";
import { getVerse } from "@/services/verse/getVerse";
import { handleApiErrors } from "@/utils/errors/handleApiErrors";
import http from "@/utils/http";
import { logger } from "@/utils/logger";
import { ErrorResponse, SuccessResponse } from "@/utils/next-response";

// Fetch random verse from API
const randomVerse = async (): Promise<{
  verse: string | null | any;
  success: boolean;
  error?: any;
}> => {
  try {
    const response = await http.get("https://beta.ourmanna.com/api/v1/get");
    logger.log(response);
    // extract the actual text from response.data
    const verseText = response?.data ?? null;
    return { success: true, verse: verseText };
  } catch (error) {
    return { success: false, verse: null, error };
  }
};

const isVerse = (verse: string | null): boolean => {
  if (verse === null || verse === undefined || verse === "") {
    return false;
  }
  return true;
};

export async function GET(request: Request) {
  try {
    logger.info("Fetching random verse");
    const response = await randomVerse();

    if (!isVerse(response?.verse) || !response?.success) {
      logger.info("Failed to fetch random verse from api");
      const dbVerse = await getVerse();
      return SuccessResponse({
        data: dbVerse,
        message: "Successfully fetched verse",
      });
    }

    logger.info("Successfully fetched random verse from api");
    const [quoteText, author] = response?.verse
      ? response?.verse.split(/-\s*/)
      : ["", ""];
    logger.info("Adding verse to db");
    const verse = await addVerse({
      quote: quoteText,
      verse: author,
    });

    return SuccessResponse({
      data: verse,
      message: "Successfully fetched verse",
    });
  } catch (error) {
    handleApiErrors(error);
  }
}

export async function DELETE(request: Request) {
  try {
    logger.info("Deleting all verses");
    const searchParams = new URL(request.url).searchParams;
    const isAll = searchParams.get("isAll") === "true";
    const id = searchParams.get("id");
    if (isAll) {
      const response = await deleteVerse({ isAll: true });
      return SuccessResponse({
        data: response,
        message: "Successfully deleted all verses",
      });
    } else if (id) {
      const response = await deleteVerse({ id });
      return SuccessResponse({
        data: response,
        message: "Successfully deleted verse",
      });
    }
    return ErrorResponse({
      data: null,
      message: "Successfully deleted verse",
    });
  } catch (error) {
    handleApiErrors(error);
  }
}
