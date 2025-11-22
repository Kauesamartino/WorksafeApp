export interface Credenciais {
  usuario: string;
  hashSenha: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  credenciais?: Credenciais;
  cargo: string;
  departamento: string;
  createdAt: string; // ISO DateTime
}

export interface Autoavaliacao {
  id: number;
  usuarioId: number;
  data: string; // ISO Date
  estresse: number; // 0-10
  humor: number; // 0-10
  energia: number; // 0-10
  qualidadeSono: number; // 0-10
  comentarios?: string;
}

export type TipoAlerta = 'SAUDE' | 'SONO' | 'ATIVIDADE' | 'RISCO';
export type Severidade = 'BAIXA' | 'MEDIA' | 'ALTA';

export interface Alerta {
  id: number;
  usuarioId: number;
  tipoAlerta: TipoAlerta;
  descricao: string;
  severidade: Severidade;
  data: string; // ISO DateTime
  resolvido: boolean;
}

export interface WearableData {
  id: number;
  usuarioId: number;
  data: string; // ISO DateTime
  batimentosMedia: number;
  passos: number;
  sonoTotal: number; // horas
  rawData?: any; // JSON original do dispositivo
}

export interface Recomendacao {
  id: number;
  usuarioId: number;
  tipoAtividade: string;
  titulo: string;
  descricao: string;
  createdAt: string; // ISO Date
  consumido: boolean;
}
