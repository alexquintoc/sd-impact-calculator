export async function fetchJsonWithFallback<T>(
  primaryUrl: string,
  fallbackUrl: string,
) {
  try {
    return await fetchJson<T>(primaryUrl);
  } catch (primaryError) {
    try {
      return await fetchJson<T>(fallbackUrl);
    } catch {
      throw primaryError;
    }
  }
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load ${url}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Expected JSON from ${url}`);
  }

  return (await response.json()) as T;
}
