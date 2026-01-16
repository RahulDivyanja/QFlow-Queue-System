export const QFLOW_API_BASE_URL =
  process.env.NEXT_PUBLIC_QFLOW_API_BASE_URL ?? "http://localhost:8080";

function resolveUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = QFLOW_API_BASE_URL.replace(/\/$/, "");
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export async function postJson<TResponse>(
  pathOrUrl: string,
  body: unknown,
  init?: Omit<RequestInit, "method" | "body">
): Promise<TResponse> {
  const res = await fetch(resolveUrl(pathOrUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
    ...init,
  });

  if (!res.ok) {
    const detail = await safeReadText(res);
    throw new Error(detail || `Request failed with status ${res.status}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as TResponse;
  }

  return (await safeReadText(res)) as unknown as TResponse;
}
