import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { listarRecomendacoes, atualizarRecomendacao, removerRecomendacao } from '../../services/mockApi';
import { Recomendacao } from '../../types/entities';
import { useTheme } from '../../theme';
import { useIsFocused, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';

export default function RecomendacoesListScreen() {
  const [data, setData] = useState<Recomendacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroConsumido, setFiltroConsumido] = useState<'todos' | 'pendentes' | 'consumidos'>('todos');
  const [categoria, setCategoria] = useState<string>('');
  const { colors } = useTheme();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const focused = useIsFocused();

  async function load() {
    setLoading(true);
    try {
      const res = await listarRecomendacoes();
      setData(res);
    } finally { setLoading(false); }
  }
  useEffect(() => { if (focused) load(); }, [focused]);

  async function toggleConsumido(item: Recomendacao) {
    await atualizarRecomendacao(item.id, { consumido: !item.consumido });
    load();
  }
  async function excluir(id: number) {
    await removerRecomendacao(id); load();
  }

  const filtradas = useMemo(() => {
    console.log('Filtros aplicados:', { filtroConsumido, categoria, totalItens: data.length });
    
    const result = data.filter(r => {
      // Filtro por status (pendente/consumido)
      if (filtroConsumido === 'pendentes' && r.consumido) return false;
      if (filtroConsumido === 'consumidos' && !r.consumido) return false;
      
      // Filtro por categoria
      if (categoria && r.tipoAtividade !== categoria) return false;
      
      return true;
    });
    
    console.log('Itens filtrados:', result.length);
    return result;
  }, [data, filtroConsumido, categoria]);

  const categorias = Array.from(new Set(data.map(d => d.tipoAtividade)));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recomendações</Text>
        <Button title="Nova" onPress={() => nav.navigate('RecomendacaoForm')} />
      </View>
      <View style={styles.filtersRow}>
        {[
          { label: 'Todos', value: 'todos' as const, count: data.length },
          { label: 'Pendentes', value: 'pendentes' as const, count: data.filter(r => !r.consumido).length },
          { label: 'Consumidos', value: 'consumidos' as const, count: data.filter(r => r.consumido).length }
        ].map(({ label, value, count }) => (
          <TouchableOpacity key={value} style={[styles.filterChip, filtroConsumido === value && styles.filterChipActive]} onPress={() => setFiltroConsumido(value)}>
            <Text style={[styles.filterText, filtroConsumido === value && styles.filterTextActive]}>
              {label} ({count})
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.divider} />
        {categorias.map(c => (
          <TouchableOpacity key={c} style={[styles.filterChip, categoria===c && styles.filterChipActive]} onPress={() => setCategoria(categoria===c?'':c)}>
            <Text style={styles.filterText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading && <Text>Carregando...</Text>}
      <FlatList
        data={filtradas}
        keyExtractor={i => i.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface }] }>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={[styles.statusBadge, item.consumido ? styles.statusOk : styles.statusPending]}>{item.consumido ? 'Consumido' : 'Pendente'}</Text>
            </View>
            <Text style={styles.desc}>{item.descricao}</Text>
            <Text style={styles.tipo}>{item.tipoAtividade}</Text>
            <View style={styles.actionsRow}>
              <Button title={item.consumido ? 'Marcar pendente' : 'Marcar consumido'} onPress={() => toggleConsumido(item)} />
              <Button title="Editar" onPress={() => nav.navigate('RecomendacaoForm', { id: item.id })} />
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
  title: { fontSize: 18, fontWeight: '600' },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  filterChip: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 6, marginBottom: 6, elevation: 1 },
  filterChipActive: { backgroundColor: '#2563EB' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#1F2937' },
  filterTextActive: { color: '#fff' },
  divider: { width: 1, backgroundColor: '#D1D5DB', marginHorizontal: 4 },
  card: { padding: 14, marginBottom: 14, borderRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontWeight: '600', fontSize: 16, flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 14, fontSize: 12, overflow: 'hidden', color: '#fff' },
  statusOk: { backgroundColor: '#10B981' },
  statusPending: { backgroundColor: '#F59E0B' },
  desc: { marginVertical: 6, color: '#374151' },
  tipo: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }
});
