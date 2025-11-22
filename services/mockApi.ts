import { Autoavaliacao, Recomendacao, Alerta, WearableData } from '../types/entities';

// Simulação de armazenamento em memória
let autoavaliacoes: Autoavaliacao[] = [];
let recomendacoes: Recomendacao[] = [];
let alertas: Alerta[] = [];
let wearableData: WearableData[] = [];

// Seed inicial com alguns dados
(function seed() {
  const now = new Date();
  const ontem = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const anteontem = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const tresDias = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const quatroDias = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
  const cincoDias = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  
  autoavaliacoes = [
    {
      id: 1,
      usuarioId: 1,
      data: cincoDias.toISOString().substring(0, 10),
      estresse: 6,
      humor: 5,
      energia: 4,
      qualidadeSono: 6,
      comentarios: 'Semana corrida, muito trabalho acumulado.'
    },
    {
      id: 2,
      usuarioId: 1,
      data: quatroDias.toISOString().substring(0, 10),
      estresse: 5,
      humor: 6,
      energia: 5,
      qualidadeSono: 7,
      comentarios: 'Consegui fazer uma pausa para alongamento.'
    },
    {
      id: 3,
      usuarioId: 1,
      data: tresDias.toISOString().substring(0, 10),
      estresse: 7,
      humor: 4,
      energia: 3,
      qualidadeSono: 5,
      comentarios: 'Reunião muito tensa, preciso de mais descanso.'
    },
    {
      id: 4,
      usuarioId: 1,
      data: anteontem.toISOString().substring(0, 10),
      estresse: 4,
      humor: 7,
      energia: 6,
      qualidadeSono: 8,
      comentarios: 'Dormi melhor, me sinto mais disposto.'
    },
    {
      id: 5,
      usuarioId: 1,
      data: ontem.toISOString().substring(0, 10),
      estresse: 3,
      humor: 8,
      energia: 7,
      qualidadeSono: 8,
      comentarios: 'Ótimo dia! Consegui manter o foco e relaxar.'
    },
    {
      id: 6,
      usuarioId: 1,
      data: now.toISOString().substring(0, 10),
      estresse: 4,
      humor: 7,
      energia: 6,
      qualidadeSono: 7,
      comentarios: 'Mantendo o equilíbrio, aplicando as dicas.'
    }
  ];
  recomendacoes = [
    {
      id: 1,
      usuarioId: 1,
      tipoAtividade: 'PAUSA',
      titulo: 'Micro pausa de 5 minutos',
      descricao: 'Levante-se e alongue braços e pescoço a cada hora.',
      createdAt: quatroDias.toISOString().substring(0, 10),
      consumido: true
    },
    {
      id: 2,
      usuarioId: 1,
      tipoAtividade: 'EXERCICIO',
      titulo: 'Caminhada de 10 minutos',
      descricao: 'Faça uma caminhada leve para ativar a circulação.',
      createdAt: tresDias.toISOString().substring(0, 10),
      consumido: true
    },
    {
      id: 3,
      usuarioId: 1,
      tipoAtividade: 'POSTURA',
      titulo: 'Ajuste a postura',
      descricao: 'Verifique se suas costas estão apoiadas na cadeira.',
      createdAt: anteontem.toISOString().substring(0, 10),
      consumido: false
    },
    {
      id: 4,
      usuarioId: 1,
      tipoAtividade: 'HIDRATACAO',
      titulo: 'Beba um copo de água',
      descricao: 'Mantenha-se hidratado para melhor concentração.',
      createdAt: ontem.toISOString().substring(0, 10),
      consumido: false
    },
    {
      id: 5,
      usuarioId: 1,
      tipoAtividade: 'PAUSA',
      titulo: 'Respiração profunda',
      descricao: 'Pratique 5 respirações profundas para reduzir o estresse.',
      createdAt: now.toISOString().substring(0, 10),
      consumido: false
    },
    {
      id: 6,
      usuarioId: 1,
      tipoAtividade: 'EXERCICIO',
      titulo: 'Alongamento de ombros',
      descricao: 'Faça movimentos circulares com os ombros por 30 segundos.',
      createdAt: now.toISOString().substring(0, 10),
      consumido: false
    }
  ];
  alertas = [
    {
      id: 1,
      usuarioId: 1,
      tipoAlerta: 'SONO',
      descricao: 'Qualidade de sono abaixo da média semanal.',
      severidade: 'MEDIA',
      data: quatroDias.toISOString(),
      resolvido: true
    },
    {
      id: 2,
      usuarioId: 1,
      tipoAlerta: 'ATIVIDADE',
      descricao: 'Número de passos muito baixo nos últimos 2 dias.',
      severidade: 'BAIXA',
      data: tresDias.toISOString(),
      resolvido: false
    },
    {
      id: 3,
      usuarioId: 1,
      tipoAlerta: 'SAUDE',
      descricao: 'Batimentos cardíacos elevados durante trabalho.',
      severidade: 'ALTA',
      data: anteontem.toISOString(),
      resolvido: false
    },
    {
      id: 4,
      usuarioId: 1,
      tipoAlerta: 'RISCO',
      descricao: 'Mais de 6 horas sem pausa registrada.',
      severidade: 'MEDIA',
      data: ontem.toISOString(),
      resolvido: false
    },
    {
      id: 5,
      usuarioId: 1,
      tipoAlerta: 'SONO',
      descricao: 'Menos de 6 horas de sono na última noite.',
      severidade: 'ALTA',
      data: now.toISOString(),
      resolvido: false
    }
  ];
  wearableData = [
    {
      id: 1,
      usuarioId: 1,
      data: cincoDias.toISOString(),
      batimentosMedia: 78,
      passos: 2150,
      sonoTotal: 6.1,
      rawData: { fonte: 'Apple Watch', stress_score: 65 }
    },
    {
      id: 2,
      usuarioId: 1,
      data: quatroDias.toISOString(),
      batimentosMedia: 75,
      passos: 3200,
      sonoTotal: 6.8,
      rawData: { fonte: 'Apple Watch', stress_score: 58 }
    },
    {
      id: 3,
      usuarioId: 1,
      data: tresDias.toISOString(),
      batimentosMedia: 82,
      passos: 1890,
      sonoTotal: 5.5,
      rawData: { fonte: 'Apple Watch', stress_score: 72 }
    },
    {
      id: 4,
      usuarioId: 1,
      data: anteontem.toISOString(),
      batimentosMedia: 71,
      passos: 4100,
      sonoTotal: 7.8,
      rawData: { fonte: 'Apple Watch', stress_score: 45 }
    },
    {
      id: 5,
      usuarioId: 1,
      data: ontem.toISOString(),
      batimentosMedia: 68,
      passos: 5200,
      sonoTotal: 8.1,
      rawData: { fonte: 'Apple Watch', stress_score: 38 }
    },
    {
      id: 6,
      usuarioId: 1,
      data: now.toISOString(),
      batimentosMedia: 72,
      passos: 3450,
      sonoTotal: 7.2,
      rawData: { fonte: 'Apple Watch', stress_score: 42 }
    }
  ];
})();

function simulateNetwork<T>(data: T, delay = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

// Autoavaliacao CRUD
export async function listarAutoavaliacoes(): Promise<Autoavaliacao[]> {
  return simulateNetwork([...autoavaliacoes]);
}

export async function criarAutoavaliacao(payload: Omit<Autoavaliacao, 'id'>): Promise<Autoavaliacao> {
  const id = autoavaliacoes.length ? Math.max(...autoavaliacoes.map(a => a.id)) + 1 : 1;
  const nova: Autoavaliacao = { id, ...payload };
  autoavaliacoes.push(nova);
  return simulateNetwork(nova);
}

export async function atualizarAutoavaliacao(id: number, updates: Partial<Omit<Autoavaliacao, 'id'>>): Promise<Autoavaliacao> {
  const idx = autoavaliacoes.findIndex(a => a.id === id);
  if (idx === -1) throw new Error('Autoavaliação não encontrada');
  autoavaliacoes[idx] = { ...autoavaliacoes[idx], ...updates };
  return simulateNetwork(autoavaliacoes[idx]);
}

export async function removerAutoavaliacao(id: number): Promise<void> {
  autoavaliacoes = autoavaliacoes.filter(a => a.id !== id);
  return simulateNetwork(undefined);
}

// Recomendacao CRUD
export async function listarRecomendacoes(): Promise<Recomendacao[]> {
  return simulateNetwork([...recomendacoes]);
}

export async function criarRecomendacao(payload: Omit<Recomendacao, 'id'>): Promise<Recomendacao> {
  const id = recomendacoes.length ? Math.max(...recomendacoes.map(r => r.id)) + 1 : 1;
  const nova: Recomendacao = { id, ...payload };
  recomendacoes.push(nova);
  return simulateNetwork(nova);
}

export async function atualizarRecomendacao(id: number, updates: Partial<Omit<Recomendacao, 'id'>>): Promise<Recomendacao> {
  const idx = recomendacoes.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Recomendação não encontrada');
  recomendacoes[idx] = { ...recomendacoes[idx], ...updates };
  return simulateNetwork(recomendacoes[idx]);
}

export async function removerRecomendacao(id: number): Promise<void> {
  recomendacoes = recomendacoes.filter(r => r.id !== id);
  return simulateNetwork(undefined);
}

// Leituras adicionais
export async function listarAlertas(): Promise<Alerta[]> {
  return simulateNetwork([...alertas]);
}

export async function listarWearableData(): Promise<WearableData[]> {
  return simulateNetwork([...wearableData]);
}
