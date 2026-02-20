export async function apiGet<T>(path: string): Promise<T> {
  const resp = await fetch(path, { cache: "no-store" });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `GET ${path} failed`);
  }
  return resp.json();
}

export async function apiSend<T>(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
  const resp = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `${method} ${path} failed`);
  }

  return resp.json();
}
