import { Env, AuthResult } from "./types";

// In-memory auth cache for high-frequency burst requests (30s TTL)
const authCache = new Map<string, { result: AuthResult; expiresAt: number }>();

export async function hashApiKey(key: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function extractApiKey(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  const xApiKey = request.headers.get("x-api-key");
  if (xApiKey) {
    return xApiKey.trim();
  }
  return null;
}

export async function authenticateKey(
  rawKey: string,
  env: Env
): Promise<{ auth: AuthResult; keyHash: string }> {
  const keyHash = await hashApiKey(rawKey);

  // Check in-memory cache first
  const now = Date.now();
  const cached = authCache.get(keyHash);
  if (cached && cached.expiresAt > now) {
    return { auth: cached.result, keyHash };
  }

  // Call Supabase RPC
  const rpcUrl = `${env.SUPABASE_URL}/rest/v1/rpc/authenticate_and_check_quota`;
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: {
      "apikey": env.SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${env.SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_key_hash: keyHash }),
  });

  if (!response.ok) {
    return {
      auth: { valid: false, error: "Authentication service unavailable" },
      keyHash,
    };
  }

  const authResult = (await response.json()) as AuthResult;

  // Cache valid auth responses for 15 seconds
  if (authResult.valid) {
    authCache.set(keyHash, {
      result: authResult,
      expiresAt: now + 15000,
    });
  }

  return { auth: authResult, keyHash };
}
