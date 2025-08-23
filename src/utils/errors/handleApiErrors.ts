import { ErrorResponse } from "@/utils/next-response";
import { ZodError } from "zod";
import { logger } from "@/utils/logger";
import { UnauthorizedError } from "@/utils/errors/unAuthError";
import { EmailError } from "@/utils/errors/EmailError";
import {
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const handleApiErrors = (error: unknown) => {
  if (error instanceof PrismaClientInitializationError) {
    return ErrorResponse({ message: error.message, error, status: 400 });
  }

  if (error instanceof PrismaClientValidationError) {
    return ErrorResponse({ message: error.message, error, status: 400 });
  }

  if (error instanceof PrismaClientUnknownRequestError) {
    return ErrorResponse({ message: error.message, error, status: 400 });
  }

  if (error instanceof ZodError) {
    logger.error({
      type: "ZodError",
      message: error.issues[0].message,
      error: error,
    });
    return ErrorResponse({
      message: error.issues[0].message,
      error: error.issues,
      status: 400,
    });
  }

  if (error instanceof EmailError) {
    return ErrorResponse({
      message: error.message || "Failed to send email",
      error,
      status: error.status,
    });
  }
  if (error instanceof UnauthorizedError) {
    return ErrorResponse({
      message: error.message || "Unauthorized",
      status: error.status,
    });
  }
  if (error instanceof Error) {
    logger.error({ type: "Error", message: error.message, error });
    return ErrorResponse({ message: error.message });
  }
  logger.error({
    type: "UnknownError",
    message: "Internal Server Error",
    error,
  });
  return ErrorResponse({ message: "Internal Server Error" });
};
