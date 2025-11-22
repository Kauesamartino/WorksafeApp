# Integrantes

Kaue Vinicius Samartino da Silva - 559317

Davi Praxedes Santos Silva - 563719

João dos Santos Cardoso de Jesus - 560400

# 🏢 WorkSafe App

<div align="center">

**Monitor Inteligente de Bem-Estar e Saúde Ocupacional**

*Aplicativo React Native para monitoramento de saúde física e mental no ambiente de trabalho*

[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)](https://reactnative.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Educational-green.svg)](#licença)

</div>

---

## 🎯 **Visão Geral**

O **WorkSafe App** é uma solução mobile completa para monitoramento da saúde ocupacional, desenvolvida com React Native e Expo. O aplicativo permite aos colaboradores registrar autoavaliações de bem-estar, receber recomendações personalizadas de saúde e acompanhar métricas através de dispositivos wearables simulados.

### ✨ **Principais Características**

- 📊 **Dashboard Inteligente**: Visualização consolidada de KPIs de saúde
- 📝 **Autoavaliações Completas**: Sistema CRUD para registro de bem-estar diário
- 💡 **Recomendações Personalizadas**: Sugestões adaptativas baseadas nos dados
- 🚨 **Sistema de Alertas**: Monitoramento proativo de riscos à saúde
- ⌚ **Integração Wearables**: Dados simulados de dispositivos de monitoramento
- 👤 **Perfil Detalhado**: Estatísticas pessoais e conquistas

---

## 🛠️ **Stack Tecnológica**

### **Frontend Mobile**
- **React Native** `0.72` - Framework multiplataforma
- **Expo SDK** `54` - Toolchain de desenvolvimento
- **TypeScript** `5.9` - Tipagem estática e segurança
- **React Navigation** `6.x` - Navegação nativa

### **Componentes e UI**
- **@expo/vector-icons** - Ícones profissionais
- **@react-native-community/slider** - Componentes interativos
- **Sistema de Temas** - Paleta de cores e tipografia consistente

### **Arquitetura**
- **Mock API Service** - Simulação de backend com CRUD completo
- **Axios** - Cliente HTTP preparado para APIs reais
- **Component-Based Architecture** - Reutilização e manutenibilidade

---

## 📁 **Estrutura do Projeto**

```
WorksafeApp/
├── 📱 App.tsx                 # Ponto de entrada principal
├── 🎯 index.ts               # Registro da aplicação
├── 📋 package.json           # Dependências e scripts
│
├── 🧩 components/            # Componentes reutilizáveis
│   ├── Card/                # Container base para conteúdo
│   ├── ErrorMessage/        # Feedback de erros
│   ├── Loader/             # Indicadores de carregamento
│   ├── MetricBadge/        # Badges de métricas
│   ├── SectionTitle/       # Títulos de seções
│   └── SeverityBadges/     # Badges de severidade
│
├── 🧭 navigation/           # Sistema de navegação
│   └── AppNavigator.tsx    # Configuração principal de rotas
│
├── 📱 screens/              # Telas da aplicação
│   ├── DashboardScreen/    # Painel principal
│   ├── AutoavaliacoesListScreen/    # Lista de autoavaliações
│   ├── AutoavaliacaoFormScreen/     # Formulário de autoavaliação
│   ├── RecomendacoesListScreen/     # Lista de recomendações
│   ├── RecomendacaoFormScreen/      # Formulário de recomendação
│   ├── AlertasListScreen/          # Lista de alertas
│   ├── WearableDataScreen/         # Dados de wearables
│   └── PerfilScreen/              # Perfil do usuário
│
├── ⚙️ services/             # Camada de serviços
│   └── mockApi.ts          # API simulada com CRUD
│
├── 🎨 theme/                # Sistema de design
│   ├── colors.ts           # Paleta de cores
│   └── index.ts            # Configurações de tema
│
└── 📝 types/                # Definições TypeScript
    └── entities.ts         # Modelos de dados
```

---

## 🚀 **Instalação e Execução**

### **Pré-requisitos**
- Node.js 16+ 
- npm ou yarn
- Expo CLI
- Expo Go (mobile) ou Android Studio/Xcode

### **Configuração do Ambiente**

```bash
# 1. Clone o repositório
git clone https://github.com/Kauesamartino/WorksafeApp.git
cd WorksafeApp

# 2. Instale as dependências
npm install

# 3. Verificar compatibilidade do React Navigation
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-safe-area-context react-native-screens

# 4. Instalar dependências adicionais
npm install @expo/vector-icons @react-native-community/slider
```

### **Executar o Aplicativo**

```bash
# Iniciar servidor de desenvolvimento
npm start

# Executar em plataforma específica
npm run android    # Android
npm run ios        # iOS  
npm run web        # Web
```

---

## 💾 **Modelos de Dados**

### **Entidades Principais**

```typescript
interface Autoavaliacao {
  id: number;
  usuarioId: number;
  data: string;
  estresse: number;      // 1-10
  humor: number;         // 1-10
  energia: number;       // 1-10
  qualidadeSono: number; // 1-10
  comentarios?: string;
}

interface Recomendacao {
  id: number;
  titulo: string;
  descricao: string;
  categoria: 'ergonomia' | 'mental' | 'fisica' | 'nutricao';
  prioridade: 'baixa' | 'media' | 'alta';
  consumida: boolean;
}

interface Alerta {
  id: number;
  tipo: 'critico' | 'moderado' | 'leve';
  titulo: string;
  descricao: string;
  dataDeteccao: string;
}

interface WearableData {
  id: number;
  dispositivo: string;
  passosContados: number;
  frequenciaCardiaca: number;
  horasSono: number;
  caloriesQueimadas: number;
  dataColeta: string;
}
```

---

## 🎮 **Funcionalidades Implementadas**

### **📊 Dashboard**
- KPIs consolidados de bem-estar
- Gráficos de tendência de saúde
- Visão geral do progresso pessoal

### **📝 Autoavaliações (CRUD Completo)**
- ✅ **Create**: Registrar nova autoavaliação
- ✅ **Read**: Listar histórico de avaliações
- ✅ **Update**: Editar avaliações existentes
- ✅ **Delete**: Remover registros

### **💡 Recomendações (CRUD Completo)**
- ✅ **Create**: Criar novas recomendações
- ✅ **Read**: Visualizar sugestões por categoria
- ✅ **Update**: Marcar como consumidas
- ✅ **Delete**: Remover recomendações

### **🚨 Sistema de Alertas**
- Detecção automática de riscos
- Categorização por severidade
- Histórico de alertas

### **⌚ Dados de Wearables**
- Sincronização simulada de dispositivos
- Métricas de atividade física
- Monitoramento de sono

### **👤 Perfil do Usuário**
- Estatísticas pessoais
- Sistema de conquistas
- Histórico de progresso

---

## 🏗️ **Arquitetura e Padrões**

### **Padrões Implementados**
- **Component-Based**: Componentes reutilizáveis e modulares
- **Service Layer**: Abstração da camada de dados
- **Theme System**: Design system centralizado
- **Type Safety**: Tipagem completa com TypeScript

### **Estrutura de Navegação**
```
Stack Navigator (Principal)
├── Tab Navigator (Telas Principais)
│   ├── Dashboard
│   ├── Autoavaliações  
│   ├── Recomendações
│   ├── Alertas
│   ├── Wearables
│   └── Perfil
└── Modal Screens (Formulários)
    ├── AutoavaliacaoForm
    └── RecomendacaoForm
```

---

## 🔄 **Migração para API Real**

### **Substituir Mock por Backend**

1. **Criar Cliente HTTP**
```typescript
// services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://sua-api.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});
```

2. **Atualizar Serviços**
```typescript
// Manter a mesma interface, trocar implementação
export async function listarAutoavaliacoes(): Promise<Autoavaliacao[]> {
  const response = await apiClient.get('/autoavaliacoes');
  return response.data;
}
```

3. **Adicionar Autenticação**
```typescript
// Interceptor para JWT
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🎨 **Sistema de Design**

### **Paleta de Cores**
```typescript
export const colors = {
  primary: '#2563EB',      // Azul principal
  success: '#10B981',      // Verde sucesso  
  warning: '#F59E0B',      // Amarelo atenção
  danger: '#EF4444',       // Vermelho erro
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6', 
    900: '#111827'
  }
};
```

### **Tipografia**
- **Heading**: Inter/System Bold
- **Body**: Inter/System Regular  
- **Caption**: Inter/System Medium

---

## 📱 **Demonstração**

### **Roteiro Sugerido para Vídeo**

1. **🎬 Introdução** (30s)
   - Apresentar objetivo do aplicativo
   - Contextualizar saúde ocupacional

2. **📊 Dashboard** (60s)
   - Navegar pelo painel principal
   - Mostrar KPIs e métricas

3. **📝 Autoavaliações** (90s)
   - Listar avaliações existentes
   - Criar nova autoavaliação
   - Editar registro existente
   - Excluir autoavaliação

4. **💡 Recomendações** (90s)
   - Visualizar por categoria
   - Marcar como consumida
   - Criar nova recomendação
   - Editar e excluir

5. **🚨 Alertas & ⌚ Wearables** (60s)
   - Mostrar sistema de alertas
   - Exibir dados de dispositivos

6. **👤 Perfil** (30s)
   - Estatísticas pessoais
   - Sistema de conquistas

7. **🏗️ Arquitetura** (60s)
   - Explicar estrutura de pastas
   - Como migrar para API real

**Total**: ~7 minutos

---

## 🔮 **Roadmap Futuro**

### **Próximas Funcionalidades**
- 🔐 **Autenticação**: Login social e JWT
- 💾 **Offline-First**: AsyncStorage + sincronização
- 📈 **Analytics**: Gráficos avançados com Victory Native
- 🌙 **Dark Mode**: Tema escuro completo
- 🔔 **Push Notifications**: Alertas em tempo real
- 📊 **Relatórios**: Exportação de dados em PDF
- 🏥 **Integração**: APIs de saúde corporativa

### **Melhorias Técnicas**
- Redux Toolkit para estado global
- React Query para cache de dados
- Storybook para documentação de componentes
- Detox para testes E2E
- Code Push para atualizações OTA

---

## 🤝 **Contribuição**

Contributions are welcome! Please feel free to submit a Pull Request.

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 **Licença**

Este projeto foi desenvolvido para fins **educacionais** e de demonstração.

