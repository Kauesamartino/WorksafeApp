import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { apiService } from '../../services/api';
import { Alerta } from '../../types/entities';

export default function AlertasListScreen() {
  const [data, setData] = useState<Alerta[]>([]);
  useEffect(() => { apiService.getAlertas().then(setData); }, []);

  const ordenados = useMemo(() => {
    const peso: Record<string, number> = { 'ALTA': 3, 'MEDIA': 2, 'BAIXA': 1 };
    return [...data].sort((a,b) => peso[b.severidade] - peso[a.severidade]);
  }, [data]);

  return (
    <View style={styles.container}>
      <FlatList
        data={ordenados}
        keyExtractor={i => i.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, severityStyle(item.severidade)]}>
            <Text style={styles.cardHeader}>{item.tipoAlerta}</Text>
            <Text style={styles.badge}>{item.severidade}</Text>
            <Text style={styles.desc}>{item.descricao}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 14, marginBottom: 12, borderRadius: 10, position: 'relative' },
  cardHeader: { fontWeight: '700', fontSize: 14, marginBottom: 4, color: '#111827' },
  badge: { position: 'absolute', top: 8, right: 10, fontSize: 10, fontWeight: '700', backgroundColor: '#1F2937', color: '#fff', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  desc: { fontSize: 13, color: '#374151' }
});

function severityStyle(sev: string) {
  switch (sev) {
    case 'ALTA': return { borderLeftWidth: 6, borderLeftColor: '#DC2626' };
    case 'MEDIA': return { borderLeftWidth: 6, borderLeftColor: '#F59E0B' };
    case 'BAIXA': return { borderLeftWidth: 6, borderLeftColor: '#10B981' };
    default: return {};
  }
}
