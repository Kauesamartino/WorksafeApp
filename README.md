# WorkSafe App

Monitor de Bem-Estar e Saúde no Trabalho (Simulado)

## Objetivo
Aplicativo React Native (Expo) que simula coleta de dados de saúde física e mental (autoavaliações e dados de wearable), gera alertas e recomendações e permite CRUD de registros. Integração com API foi substituída por um mock que simula chamadas assíncronas (cumprindo requisito de CRUD). Você pode trocar facilmente por uma API real.

## Tecnologias
- Expo SDK 54
- React Navigation (Stack + Bottom Tabs)
- TypeScript
- Axios (pode ser usado futuramente para API real)

## Estrutura de Pastas
```
src/
  components/ (Card, Loader, ErrorMessage)
  navigation/ (AppNavigator)
  screens/ (Dashboard, AutoavaliacoesList, AutoavaliacaoForm, RecomendacoesList, RecomendacaoForm, AlertasList, Perfil, WearableData)
  services/ (mockApi.ts)
  theme/ (colors, index)
  types/ (entities.ts)
```

## Entidades (Resumo)
- Usuario, Autoavaliacao, Alerta, WearableData, Recomendacao.
CRUD implementado para Autoavaliacao e Recomendacao.

## Executando
Instale dependências (garanta estar dentro da pasta do projeto):
```powershell
npm install
# Para assegurar versões compatíveis do React Navigation com Expo:
# npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-safe-area-context react-native-screens
npm start
```
Abra no Expo Go ou emulador.

## Funcionalidades para Vídeo
1. Navegação entre abas (Dashboard, Autoavaliações, Recomendações, Alertas, Wearables, Perfil).
2. Listagem de Autoavaliações (Read) e criação de nova (Create).
3. Edição de Autoavaliação existente (Update) e exclusão (Delete).
4. Listagem de Recomendações com mudança de estado (consumido) + criação, edição e exclusão.
5. Exibição de Alertas simulados.
6. Exibição de dados de Wearable simulados.
7. Perfil estático (poderia receber dados de API real futuramente).

## Roteiro Sugerido para Gravação (20 pts)
1. Introdução rápida (objetivo do app).
2. Mostrar Dashboard (contexto geral).
3. Abrir Autoavaliações: listar, criar nova, editar e excluir.
4. Abrir Recomendações: listar, marcar consumido, criar, editar, excluir.
5. Mostrar Alertas e Wearables.
6. Mostrar Perfil.
7. Explicar arquitetura (pastas) e onde trocar mock por API real.
8. Encerrar recapitulando requisitos atendidos.

## Como Substituir Mock por API Real
- Criar `apiClient.ts` usando axios com baseURL da sua API.
- Trocar chamadas em `mockApi.ts` por requisições HTTP reais.
- Manter a mesma assinatura das funções para que telas não precisem mudar.

## Estilização
Paleta em `theme/colors.ts`; tipografia e espaçamento em `theme/index.ts`. Fácil expansão para dark mode.

## Boas Práticas
- Tipos centralizados em `types/entities.ts`.
- Separação clara de responsabilidades (telas vs serviços vs tema).
- Componentes reutilizáveis para feedback e layout.
- Código simples para facilitar substituição por backend.

## Próximos Passos (Sugestões)
- Implementar autenticação de usuário.
- Persistência local offline (AsyncStorage) + sincronização.
- Gráficos de evolução (usando Victory ou Recharts web).
- Dark mode real.

## Licença
Projeto educacional.
