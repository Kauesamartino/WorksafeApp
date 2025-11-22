import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextStyle } from 'react-native';
import { useTheme } from '../../theme';
import { listarAutoavaliacoes, listarRecomendacoes, listarWearableData } from '../../services/mockApi';
import { Autoavaliacao, Recomendacao, WearableData } from '../../types/entities';

interface Kpi {
  label: string;
  value: string | number;
  color?: string;
}

export default function DashboardScreen() {
  const { colors, typography, spacing } = useTheme();
  const [autos, setAutos] = useState<Autoavaliacao[]>([]);
  const [recs, setRecs] = useState<Recomendacao[]>([]);
  const [wear, setWear] = useState<WearableData[]>([]);

  useEffect(() => {
    listarAutoavaliacoes().then(setAutos);
    listarRecomendacoes().then(setRecs);
    listarWearableData().then(setWear);
  }, []);

  const media = (key: keyof Autoavaliacao) => {
    if (!autos.length) return '-';
    const sum = autos.reduce((acc, a) => acc + (a[key] as number), 0);
    return (sum / autos.length).toFixed(1);
  };

  const pendentes = recs.filter(r => !r.consumido).length;
  const ultimoWear = wear[wear.length - 1];

  const penultimoAuto = autos.length > 1 ? autos[autos.length - 2] : undefined;
  const ultimaAuto = autos.length ? autos[autos.length - 1] : undefined;

  const evolucao = useMemo(() => {
    if (!penultimoAuto || !ultimaAuto) return {} as Record<string, number>;
    const keys: (keyof Autoavaliacao)[] = ['humor','estresse','energia','qualidadeSono'];
    return keys.reduce((acc,key) => {
      acc[key] = (ultimaAuto[key] as number) - (penultimoAuto[key] as number);
      return acc;
    }, {} as Record<string, number>);
  }, [penultimoAuto, ultimaAuto]);

  function renderMetric(label: string, key: keyof Autoavaliacao, color: string) {
    const valor = Number(media(key));
    const evol = (evolucao as any)[key] ?? 0;
    const evolColor = evol > 0 ? '#10B981' : evol < 0 ? '#DC2626' : '#6B7280';
    const evolSymbol = evol > 0 ? '▲' : evol < 0 ? '▼' : '•';
    const pct = isNaN(valor) ? 0 : Math.min(1, Math.max(0, valor / 10));
    return (
      <View style={styles.metricBox} key={label}>
        <View style={styles.metricHeader}>
          <Text style={styles.metricLabel}>{label}</Text>
          <Text style={[styles.metricValue, { color }]}>{isNaN(valor) ? '-' : valor.toFixed(1)}</Text>
        </View>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
        </View>
        <Text style={[styles.evolution, { color: evolColor }]}>{evolSymbol} {evol === 0 ? 'Estável' : `${evol > 0 ? '+' : ''}${evol}`}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing(2) }}>
      <Text style={typography.h1 as TextStyle}>Painel de Bem-Estar</Text>
      <Text style={[typography.small, { marginBottom: spacing(2) }]}>Visão consolidada dos principais indicadores pessoais.</Text>
      <View style={styles.bigCard}>
        <Text style={styles.bigCardTitle}>Indicadores Gerais</Text>
        <View style={styles.kpiRow}>
          {renderMetric('Humor', 'humor', colors.primary)}
          {renderMetric('Estresse', 'estresse', colors.warning)}
          {renderMetric('Energia', 'energia', colors.accent)}
          {renderMetric('Sono', 'qualidadeSono', colors.primaryDark)}
        </View>
        <View style={styles.separator} />
        <View style={styles.secondaryRow}>
          <View style={styles.secondaryItem}>
            <Text style={styles.secondaryLabel}>Recomendações Pendentes</Text>
            <Text style={styles.secondaryValue}>{pendentes}</Text>
          </View>
          <View style={styles.secondaryItem}>
            <Text style={styles.secondaryLabel}>Passos Hoje</Text>
            <Text style={styles.secondaryValue}>{ultimoWear ? ultimoWear.passos : '-'}</Text>
          </View>
          <View style={styles.secondaryItem}>
            <Text style={styles.secondaryLabel}>Batimentos Médios</Text>
            <Text style={styles.secondaryValue}>{ultimoWear ? ultimoWear.batimentosMedia : '-'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.section}> 
        <Text style={typography.h2 as TextStyle}>Última Autoavaliação</Text>
        {autos.length ? (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Data: {autos[autos.length - 1].data}</Text>
            <Text>Humor: {autos[autos.length - 1].humor} | Estresse: {autos[autos.length - 1].estresse}</Text>
            <Text>Energia: {autos[autos.length - 1].energia} | Sono: {autos[autos.length - 1].qualidadeSono}</Text>
            {autos[autos.length - 1].comentarios ? <Text style={styles.coment}>"{autos[autos.length - 1].comentarios}"</Text> : null}
          </View>
        ) : <Text>Nenhuma autoavaliação registrada.</Text>}
      </View>
      <View style={styles.section}> 
        <Text style={typography.h2 as TextStyle}>Recomendações Pendentes</Text>
        {pendentes ? recs.filter(r => !r.consumido).slice(0, 3).map(r => (
          <View key={r.id} style={styles.recItem}>
            <Text style={styles.recTitulo}>{r.titulo}</Text>
            <Text style={styles.recDesc}>{r.descricao}</Text>
          </View>
        )) : <Text>Sem recomendações pendentes. Bom trabalho!</Text>}
      </View>
      <View style={styles.section}> 
        <Text style={typography.h2 as TextStyle}>Wearable (Última Leitura)</Text>
        {ultimoWear ? (
          <View style={styles.detailCard}>
            <Text>Batimentos médios: {ultimoWear.batimentosMedia}</Text>
            <Text>Passos: {ultimoWear.passos}</Text>
            <Text>Sono total (h): {ultimoWear.sonoTotal}</Text>
          </View>
        ) : <Text>Sem dados de wearable.</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bigCard: { backgroundColor: '#fff', padding: 18, borderRadius: 18, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  bigCardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111827' },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricBox: { width: '48%', marginBottom: 14 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  metricLabel: { fontSize: 12, fontWeight: '600', color: '#374151' },
  metricValue: { fontSize: 18, fontWeight: '700' },
  barBackground: { height: 10, borderRadius: 6, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },
  evolution: { fontSize: 10, fontWeight: '700' },
  separator: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  secondaryRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  secondaryItem: { width: '32%', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, marginBottom: 10 },
  secondaryLabel: { fontSize: 10, fontWeight: '600', color: '#6B7280' },
  secondaryValue: { fontSize: 16, fontWeight: '700', color: '#2563EB', marginTop: 4 },
  section: { marginTop: 12 },
  detailCard: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginTop: 8 },
  detailTitle: { fontWeight: '600', marginBottom: 4 },
  coment: { fontStyle: 'italic', marginTop: 6, color: '#4B5563' },
  recItem: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginTop: 8 },
  recTitulo: { fontWeight: '600' },
  recDesc: { fontSize: 14, color: '#4B5563' }
});
