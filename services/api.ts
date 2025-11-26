import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://worksafe-api.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const viaCepApi = axios.create({
  baseURL: 'https://viacep.com.br/ws',
  timeout: 5000,
});

// Funções para gerenciar o token e username
const TOKEN_KEY = '@worksafe_token';
const USERNAME_KEY = '@worksafe_username';

export const tokenManager = {
  saveToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  },

  saveUsername: async (username: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(USERNAME_KEY, username);
    } catch (error) {
      console.error('Erro ao salvar username:', error);
    }
  },

  getUsername: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(USERNAME_KEY);
    } catch (error) {
      console.error('Erro ao recuperar username:', error);
      return null;
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
      return null;
    }
  },

  removeToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USERNAME_KEY);
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  },
};

api.interceptors.request.use(
  async (config) => {
    const isAuthEndpoint = config.url?.includes('/auth/login') || 
                          (config.url?.includes('/usuarios') && config.method?.toLowerCase() === 'post');
    
    if (!isAuthEndpoint) {
      const token = await tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await tokenManager.removeToken();
      console.warn('Token expirado ou inválido. Usuário precisa fazer login novamente.');
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  roles: string[];
}

export interface CreateUserRequest {
  nome: string;
  sobrenome: string;
  cpf: string;
  sexo: 'MASCULINO' | 'FEMININO';
  email: string;
  telefone: string;
  credenciais: {
    username: string;
    password: string;
  };
  cargo: string;
  departamento: string;
  dataNascimento: string; 
  endereco: {
    logradouro: string;
    bairro: string;
    cep: string;
    numero: string;
    complemento?: string;
    cidade: string;
    uf: string;
  };
}

export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const cepService = {
  buscarCep: async (cep: string): Promise<CepResponse> => {
    // Remove formatação do CEP (mantém apenas números)
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }
    
    const response = await viaCepApi.get(`/${cepLimpo}/json/`);
    
    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return response.data;
  },
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    const loginData = response.data;
    
    if (loginData.token) {
      await tokenManager.saveToken(loginData.token);
      await tokenManager.saveUsername(credentials.username);
    }
    
    return loginData;
  },

  createUser: async (userData: CreateUserRequest): Promise<any> => {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await tokenManager.removeToken();
  },

  getUserInfo: async (): Promise<any> => {
    const username = await tokenManager.getUsername();
    if (!username) {
      throw new Error('Username não encontrado');
    }
    
    const response = await api.get(`/usuarios/username/${username}`);
    return response.data;
  },
};

export const apiService = {
  getAutoavaliacoes: async () => {
    const response = await api.get('/autoavaliacoes');
    return response.data;
  },

  createAutoavaliacao: async (data: any) => {
    const response = await api.post('/autoavaliacoes', data);
    return response.data;
  },

  updateAutoavaliacao: async (id: number, data: any) => {
    const response = await api.put(`/autoavaliacoes/${id}`, data);
    return response.data;
  },

  deleteAutoavaliacao: async (id: number) => {
    await api.delete(`/autoavaliacoes/${id}`);
  },

  getRecomendacoes: async () => {
    const response = await api.get('/recomendacoes');
    return response.data;
  },

  createRecomendacao: async (data: any) => {
    const response = await api.post('/recomendacoes', data);
    return response.data;
  },

  updateRecomendacao: async (id: number, data: any) => {
    const response = await api.put(`/recomendacoes/${id}`, data);
    return response.data;
  },

  deleteRecomendacao: async (id: number) => {
    await api.delete(`/recomendacoes/${id}`);
  },

  getAlertas: async () => {
    const response = await api.get('/alertas');
    return response.data;
  },

  getWearableData: async () => {
    const response = await api.get('/wearable-data');
    return response.data;
  },
};

export default api;