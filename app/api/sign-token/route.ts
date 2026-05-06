"use server";

import { createURLToken } from "@editframe/api";

import { editframeClient } from "@/lib/editframe";

export const POST = async (request: Request) => {
  const { url } = await request.json();
  const token = await createURLToken(editframeClient, url);
  return Response.json(
    { token },
    {
      headers: { "content-type": "application/json" },
    }
  );
};
