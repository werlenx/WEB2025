import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:3333/";

const getAuthToken = (): string | null => {
  // Evita acesso a `window`/`localStorage` durante Server Side Rendering
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem("authToken");
  } catch (err) {
    // Em alguns ambientes (ex.: modos restritos) o acesso pode lançar.
    console.warn(
      "Não foi possível acessar localStorage para obter token.",
      err
    );
    return null;
  }
};

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor de Requisição: Adiciona o JWT a todas as chamadas
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getAuthToken();

    if (token) {
      config.headers = config.headers || {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore -- permitir atribuição direta no header (diversos formatos possíveis)
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de Resposta: Trata erros globais, como 401 Unauthorized
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      console.error(
        "Sessão expirada ou não autorizada. Redirecionando para login."
      );
      // Em uma aplicação real, você forçaria o redirecionamento:
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Funções auxiliares para simular o armazenamento do token no frontend.
 * Em um projeto real, estas estariam no seu AuthContext.
 */
export const saveToken = (token: string) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("authToken", token);
  } catch (err) {
    console.warn("Não foi possível salvar token no localStorage.", err);
  }
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("authToken");
  } catch (err) {
    console.warn("Não foi possível remover token do localStorage.", err);
  }
};
