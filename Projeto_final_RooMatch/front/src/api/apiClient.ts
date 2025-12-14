const BASE_URL = "http://localhost:3333";

export const saveToken = (token: string) => {
  window.localStorage.setItem("authToken", token);
};

export const clearToken = () => {
  window.localStorage.removeItem("authToken");
};

const getAuthToken = (): string | null => {
  return typeof window !== "undefined"
    ? window.localStorage.getItem("authToken")
    : null;
};

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
  body?: any;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const token = getAuthToken();
  // Normalize HeadersInit into a plain object so we can safely index and modify it
  const normalizeHeaders = (h?: HeadersInit): Record<string, string> => {
    if (!h) return {};
    if (h instanceof Headers) {
      const out: Record<string, string> = {};
      h.forEach((value, key) => (out[key] = value));
      return out;
    }
    if (Array.isArray(h)) {
      const out: Record<string, string> = {};
      h.forEach(([key, value]) => (out[key] = value));
      return out;
    }
    return { ...h } as Record<string, string>;
  };

  const headersObj: Record<string, string> = {
    "Content-Type": "application/json",
    ...normalizeHeaders(options.headers),
  };

  // 1. Injeção do JWT no cabeçalho Authorization
  if (token) {
    headersObj["Authorization"] = `Bearer ${token}`;
  }

  // 2. Transforma o body de objeto para string JSON, se necessário
  const finalBody =
    options.body && typeof options.body === "object"
      ? JSON.stringify(options.body)
      : options.body;

  // 3. Monta a requisição
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: headersObj,
    body: finalBody,
  });

  // 4. Tratamento do Erro de Autenticação (401 Unauthorized)
  if (response.status === 401) {
    // 🚨 REGRA DE PRODUÇÃO: Limpa o token e força o redirecionamento
    console.error(
      "Erro 401: Sessão expirada ou não autorizada. Redirecionamento forçado."
    );
    clearToken();
    // Redirecionamento forçado (usando o nativo, já que estamos fora do React Router)
    window.location.href = "/login";

    // Lança um erro para que a chamada API seja interrompida
    throw new Error("Sessão expirada. Redirecionando...");
  }

  // 5. Tratamento de Outros Erros HTTP (4xx, 5xx)
  if (!response.ok) {
    let errorData: any;
    try {
      // Tenta ler a mensagem de erro do backend (JSON)
      errorData = await response.json();
    } catch {
      // Se não for JSON, usa o status e o texto
      errorData = {
        message: `Erro ${response.status}: ${response.statusText}`,
      };
    }

    const error = new Error(
      errorData.message || "Erro de servidor desconhecido"
    );
    (error as any).response = response; // Anexa a resposta para debug
    throw error;
  }

  // 6. Retorna o JSON da resposta (ou null/vazio para status 204 No Content)
  try {
    return await response.json();
  } catch {
    return {} as T; // Retorna objeto vazio se o corpo for vazio/inválido
  }
}
