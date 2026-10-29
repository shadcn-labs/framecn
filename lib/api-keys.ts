import "server-only";
import { createHash, randomBytes } from "node:crypto";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { apiKey, user } from "@/lib/db/schema";

const KEY_PREFIX = "fcn_";

const hashKey = (key: string) => createHash("sha256").update(key).digest("hex");

export interface ApiKeyInfo {
  prefix: string;
  createdAt: number;
}

export const getApiKeyInfo = async (
  userId: string
): Promise<ApiKeyInfo | null> => {
  const [row] = await getDb()
    .select({ createdAt: apiKey.createdAt, prefix: apiKey.prefix })
    .from(apiKey)
    .where(eq(apiKey.userId, userId))
    .limit(1);
  return row ?? null;
};

/** Creates a new key for the user, replacing any existing one. The plaintext key is only returned here. */
export const createApiKey = async (
  userId: string
): Promise<ApiKeyInfo & { key: string }> => {
  const secret = randomBytes(32).toString("base64url");
  const key = `${KEY_PREFIX}${secret}`;
  const prefix = `${KEY_PREFIX}${secret.slice(0, 8)}`;
  const createdAt = Date.now();
  const values = { createdAt, keyHash: hashKey(key), prefix };
  await getDb()
    .insert(apiKey)
    .values({ ...values, userId })
    .onConflictDoUpdate({ set: values, target: apiKey.userId });
  return { createdAt, key, prefix };
};

export const revokeApiKey = async (userId: string) => {
  await getDb().delete(apiKey).where(eq(apiKey.userId, userId));
};

export interface ApiKeyOwner {
  email: string;
  emailVerified: boolean;
}

/** Looks up the key by its SHA-256 hash, so no plaintext comparison happens. */
export const verifyApiKey = async (
  token: string
): Promise<ApiKeyOwner | null> => {
  if (!token.startsWith(KEY_PREFIX) || token.length > 128) {
    return null;
  }
  const [owner] = await getDb()
    .select({ email: user.email, emailVerified: user.emailVerified })
    .from(apiKey)
    .innerJoin(user, eq(user.id, apiKey.userId))
    .where(eq(apiKey.keyHash, hashKey(token)))
    .limit(1);
  return owner ?? null;
};
