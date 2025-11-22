import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listarAutoavaliacoes, listarRecomendacoes } from '../../services/mockApi';
import { Autoavaliacao, Recomendacao } from '../../types/entities';

export default function PerfilScreen() {
  const [autos, setAutos] = useState<Autoavaliacao[]>([]);
  const [recs, setRecs] = useState<Recomendacao[]>([]);

  useEffect(() => {
    listarAutoavaliacoes().then(setAutos);
    listarRecomendacoes().then(setRecs);
  }, []);

  const pendentes = recs.filter(r => !r.consumido).length;
  const totalAutos = autos.length;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>KS</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Kaue Samartino</Text>
          <Text style={styles.subtitle}>Desenvolvedora Junior • Engenharia</Text>
          <Text style={styles.joinDate}>Membro desde Jan 2023</Text>
        </View>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={20} color="#2563EB" style={styles.statIcon} />
          <Text style={styles.statValue}>{totalAutos}</Text>
          <Text style={styles.statLabel}>Autoavaliações</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={20} color="#F59E0B" style={styles.statIcon} />
          <Text style={styles.statValue}>{pendentes}</Text>
          <Text style={styles.statLabel}>Recs Pendentes</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="bulb" size={20} color="#10B981" style={styles.statIcon} />
          <Text style={styles.statValue}>{recs.length}</Text>
          <Text style={styles.statLabel}>Total Recs</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="happy" size={20} color="#8B5CF6" style={styles.statIcon} />
          <Text style={styles.statValue}>{autos.length ? (autos.reduce((s,a) => s + a.humor, 0) / autos.length).toFixed(1) : '-'}</Text>
          <Text style={styles.statLabel}>Humor Médio</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="alert-circle" size={20} color="#DC2626" style={styles.statIcon} />
          <Text style={styles.statValue}>{autos.length ? (autos.reduce((s,a) => s + a.estresse, 0) / autos.length).toFixed(1) : '-'}</Text>
          <Text style={styles.statLabel}>Estresse Médio</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={20} color="#F59E0B" style={styles.statIcon} />
          <Text style={styles.statValue}>85%</Text>
          <Text style={styles.statLabel}>Engajamento</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.about}>Desenvolvedor Junior focado em bem-estar no trabalho híbrido. Utiliza este app para monitorar saúde mental, física e produtividade. Participa ativamente do programa de wellness da empresa.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conquistas</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="medal" size={28} color="#2563EB" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Consistência</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="heart" size={28} color="#10B981" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Bem-estar</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="trending-up" size={28} color="#8B5CF6" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Progresso</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#fff', padding: 16, borderRadius: 16 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  joinDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { backgroundColor: '#fff', padding: 12, borderRadius: 12, alignItems: 'center', width: '31%', marginBottom: 10 },
  statIcon: { marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#2563EB' },
  statLabel: { fontSize: 10, fontWeight: '600', color: '#374151', marginTop: 4, textAlign: 'center' },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#111827' },
  about: { fontSize: 14, color: '#374151', lineHeight: 20, backgroundColor: '#fff', padding: 14, borderRadius: 12 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  badge: { backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  badgeIcon: { marginBottom: 8 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#374151' }
});
