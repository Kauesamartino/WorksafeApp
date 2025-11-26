import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, RefreshControl } from 'react-native';

import { useIsFocused, useNavigation, NavigationProp } from '@react-navigation/native';
import { Autoavaliacao } from '../../types/entities';
import { apiService } from '../../services/api';
import { useTheme } from '../../theme';
import { RootStackParamList } from '../../types/navigation';

export default function AutoavaliacoesListScreen() {
  const [data, setData] = useState<Autoavaliacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  async function load(retryCount = 0) {
    if (loading) return; // Evita múltiplas requisições simultâneas
    
    setLoading(true); 
    setError('');
    
    try {
      console.log('Carregando autoavaliações...');
      const res = await apiService.getAutoavaliacoes();
      
      // Ordena autoavaliações por data decrescente (mais recentes primeiro)
      const autoavaliacoesOrdenadas = res.sort((a: Autoavaliacao, b: Autoavaliacao) => {
        const dataA = new Date(a.data);
        const dataB = new Date(b.data);
        return dataB.getTime() - dataA.getTime();
      });
      
      console.log('Autoavaliações carregadas e ordenadas:', autoavaliacoesOrdenadas.length);
      setData(autoavaliacoesOrdenadas);
    } catch (e: any) {
      console.error('Erro ao carregar autoavaliações:', e);
      
      // Retry automático para erros 404 (até 2 tentativas)
      if (e.response?.status === 404 && retryCount < 2) {
        console.log(`Tentando novamente... (tentativa ${retryCount + 1}/2)`);
        setTimeout(() => load(retryCount + 1), 1000);
        return;
      }
      
      const errorMessage = e.response?.data?.message || e.message || 'Erro ao carregar autoavaliações';
      setError(errorMessage);
    } finally { 
      setLoading(false); 
    }
  }

  useEffect(() => { 
    if (isFocused) {
      // Debounce para evitar múltiplas chamadas rápidas
      const timer = setTimeout(() => {
        load();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isFocused]);

  async function excluir(id: number) {
    try { await apiService.deleteAutoavaliacao(id); load(); } catch (e: any) { setError(e.message || 'Falha ao excluir'); }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Autoavaliações</Text>
        <Button title="Nova" onPress={() => navigation.navigate('AutoavaliacaoForm')} />
      </View>
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <FlatList
        data={data}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={data.length ? (
          <View style={styles.metricsBar}>
            <Text style={styles.metric}>Humor médio: {avg(data,'humor')}</Text>
            <Text style={styles.metric}>Estresse médio: {avg(data,'estresse')}</Text>
          </View>
        ) : null}
        contentContainerStyle={{ paddingVertical: spacing(1) }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface }] }>
            <Text style={styles.cardTitle}>{item.data}</Text>
            <View style={styles.badgesRow}>
              <Text style={[styles.badge, { backgroundColor: '#2563EB22' }]}>Humor {item.humor}</Text>
              <Text style={[styles.badge, { backgroundColor: '#DC262622', color: '#DC2626' }]}>Estresse {item.estresse}</Text>
              <Text style={[styles.badge, { backgroundColor: '#10B98122', color: '#065F46' }]}>Energia {item.energia}</Text>
              <Text style={[styles.badge, { backgroundColor: '#7C3AED22', color: '#5B21B6' }]}>Sono {item.qualidadeSono}</Text>
            </View>
            {item.comentarios ? <Text style={styles.coment}>"{item.comentarios}"</Text> : null}
            <View style={styles.actionsRow}>
              <Button title="Excluir" color={colors.danger} onPress={() => excluir(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  card: { padding: 14, marginBottom: 14, borderRadius: 10, elevation: 2 },
  cardTitle: { fontWeight: '600', marginBottom: 6 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, marginRight: 6, marginBottom: 4, fontSize: 12, color: '#1F2937' },
  coment: { fontStyle: 'italic', marginBottom: 8, color: '#374151' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metricsBar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12 },
  metric: { fontSize: 12, fontWeight: '600' }
});

function avg(list: Autoavaliacao[], key: keyof Autoavaliacao) {
  if (!list.length) return '-';
  const sum = list.reduce((acc, a) => acc + (a[key] as number), 0);
  return (sum / list.length).toFixed(1);
}
