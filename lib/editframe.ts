import { Client } from "@editframe/api";

if (!process.env.EF_API_TOKEN) {
  throw new Error("Missing EF_API_TOKEN environment variable");
}

export const editframeClient = new Client(process.env.EF_API_TOKEN);
