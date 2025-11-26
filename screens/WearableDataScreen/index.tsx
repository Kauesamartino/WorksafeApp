import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { apiService } from '../../services/api';
import { WearableData } from '../../types/entities';

export default function WearableDataScreen() {
  const [data, setData] = useState<WearableData[]>([]);
  useEffect(() => { apiService.getWearableData().then(setData); }, []);

  const stats = useMemo(() => {
    if (!data.length) return { avgHeart: 0, avgSteps: 0, avgSleep: 0, trend: 'stable' };
    const avgHeart = (data.reduce((s,d) => s + d.batimentosMedia, 0) / data.length).toFixed(0);
    const avgSteps = Math.round(data.reduce((s,d) => s + d.passos, 0) / data.length);
    const avgSleep = (data.reduce((s,d) => s + d.sonoTotal, 0) / data.length).toFixed(1);
    
    const recent = data.slice(-3);
    const older = data.slice(0, 3);
    const recentAvg = recent.reduce((s,d) => s + d.passos, 0) / recent.length;
    const olderAvg = older.reduce((s,d) => s + d.passos, 0) / older.length;
    const trend = recentAvg > olderAvg ? 'up' : recentAvg < olderAvg ? 'down' : 'stable';
    
    return { avgHeart, avgSteps, avgSleep, trend };
  }, [data]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dados de Sensores</Text>
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumo Semanal</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{stats.avgHeart}</Text>
            <Text style={styles.summaryLabel}>BPM Médio</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{stats.avgSteps}</Text>
            <Text style={styles.summaryLabel}>Passos/dia</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{stats.avgSleep}h</Text>
            <Text style={styles.summaryLabel}>Sono Médio</Text>
          </View>
        </View>
        <Text style={styles.trendText}>Tendência de atividade: {stats.trend === 'up' ? 'Crescente' : stats.trend === 'down' ? 'Decrescente' : 'Estável'}</Text>
      </View>
      
      <FlatList
        data={data.slice().reverse()}
        scrollEnabled={false}
        keyExtractor={i => i.id.toString()}
        renderItem={({ item, index }) => {
          const stressScore = (item.rawData as any)?.stress_score || 50;
          const stressLevel = stressScore > 65 ? 'Alto' : stressScore > 45 ? 'Médio' : 'Baixo';
          const stressColor = stressScore > 65 ? '#DC2626' : stressScore > 45 ? '#F59E0B' : '#10B981';
          const dayLabel = index === 0 ? 'Hoje' : index === 1 ? 'Ontem' : `${index + 1} dias atrás`;
          
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.dayLabel}>{dayLabel}</Text>
                <Text style={styles.dateLabel}>{item.data.substring(5, 10)}</Text>
              </View>
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{item.batimentosMedia}</Text>
                  <Text style={styles.metricLabel}>BPM</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{item.passos}</Text>
                  <Text style={styles.metricLabel}>Passos</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{item.sonoTotal}h</Text>
                  <Text style={styles.metricLabel}>Sono</Text>
                </View>
              </View>
              <View style={styles.stressRow}>
                <Text style={styles.stressLabel}>Nível de Stress:</Text>
                <Text style={[styles.stressValue, { color: stressColor }]}>{stressLevel} ({stressScore})</Text>
              </View>
            </View>
          );
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F7FA' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16, color: '#111827' },
  summaryCard: { backgroundColor: '#fff', padding: 18, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  summaryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111827' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '700', color: '#2563EB' },
  summaryLabel: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  trendText: { fontSize: 13, color: '#374151', textAlign: 'center', marginTop: 8 },
  card: { backgroundColor: '#fff', padding: 16, marginBottom: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dayLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
  dateLabel: { fontSize: 12, color: '#6B7280' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  metric: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 16, fontWeight: '600' },
  metricLabel: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  stressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  stressLabel: { fontSize: 12, color: '#374151' },
  stressValue: { fontSize: 12, fontWeight: '600' }
});
