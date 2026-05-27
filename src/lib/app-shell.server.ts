import "server-only";

import { headers } from "next/headers";

export const getRequestPathname = async (): Promise<string> => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  if (pathname && pathname.length > 0) {
    return pathname;
  }
  return "/";
};
