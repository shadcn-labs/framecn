import fs from "node:fs";
import path from "node:path";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  const resolvedParams = await params;
  const [name, fileName] = resolvedParams.path;

  if (!name) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "registry",
    "bases",
    "hyperframes",
    name,
    fileName || "index.html"
  );

  const basePath = path.join(process.cwd(), "registry", "bases", "hyperframes");
  if (!filePath.startsWith(basePath)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const content = fs.readFileSync(filePath, "utf-8");

  return new NextResponse(content, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
};
