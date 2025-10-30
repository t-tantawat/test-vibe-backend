const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (error: any) {
    const message = error?.message?.includes("Failed to fetch")
      ? "Could not reach the API server. Is it running?"
      : error?.message || "Network request failed";
    throw new Error(message);
  }
  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const err = await res.json();
      message = err?.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.status === 204 ? (undefined as unknown as T) : await res.json();
}

export const api = {
  transactions: {
    list: (params?: Record<string, string | number | undefined>) => {
      const q = params
        ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString()
        : "";
      return request(`/api/transactions${q}`);
    },
    get: (id: number) => request(`/api/transactions/${id}`),
    create: (data: unknown) => request(`/api/transactions`, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: unknown) => request(`/api/transactions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) => request(`/api/transactions/${id}`, { method: "DELETE" }),
  },
  categories: {
    list: () => request(`/api/categories`),
    create: (data: unknown) => request(`/api/categories`, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: unknown) => request(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) => request(`/api/categories/${id}`, { method: "DELETE" }),
  },
  stats: {
    summary: () => request(`/api/stats/summary`),
    monthly: () => request(`/api/stats/monthly`),
  },
};
