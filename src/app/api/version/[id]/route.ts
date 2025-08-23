import { getVersionById } from "@/services/version/getVersionById";
import { handleApiErrors } from "@/utils/errors/handleApiErrors";
import { requiredSuperAdminRole } from "@/utils/middleware/requiredSuperAdminRole";
import { SuccessResponse } from "@/utils/next-response";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requiredSuperAdminRole(req);
    const { id } = await params;
    const version = await getVersionById({ id });
    return SuccessResponse({ data: version });
  } catch (error) {
    return handleApiErrors(error);
  }
}
