import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { apiService, authService } from '../../services/api';
import { Autoavaliacao, Recomendacao } from '../../types/entities';

interface PerfilScreenProps {
  onLogout?: () => void;
}

export default function PerfilScreen({ onLogout }: PerfilScreenProps) {
  const [autos, setAutos] = useState<Autoavaliacao[]>([]);
  const [recs, setRecs] = useState<Recomendacao[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 PerfilScreen: Carregando dados do perfil...');
      
      const [userInfo, autoavaliacoes, recomendacoes] = await Promise.all([
        authService.getUserInfo(),
        apiService.getAutoavaliacoes(),
        apiService.getRecomendacoes()
      ]);
      
      // Ordena autoavaliações por data decrescente (mais recentes primeiro)
      const autoavaliacoesOrdenadas = autoavaliacoes.sort((a: Autoavaliacao, b: Autoavaliacao) => {
        const dataA = new Date(a.data);
        const dataB = new Date(b.data);
        return dataB.getTime() - dataA.getTime();
      });
      
      setUserData(userInfo);
      setAutos(autoavaliacoesOrdenadas);
      setRecs(recomendacoes);
      
      console.log('✅ PerfilScreen: Dados carregados com sucesso');
      console.log('📊 PerfilScreen: Autoavaliações ordenadas:', autoavaliacoesOrdenadas.length);
    } catch (error) {
      console.error('❌ PerfilScreen: Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log('🔍 PerfilScreen: Tela ganhou foco, recarregando dados...');
      loadData();
    }
  }, [isFocused]);

  const pendentes = recs.filter(r => !r.consumido).length;
  const totalAutos = autos.length;

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              onLogout?.();
            } catch (error) {
              console.error('Erro no logout:', error);
              onLogout?.(); // Sair mesmo se houver erro
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {loading ? '...' : userData ? `${userData.nome?.[0] || ''}${userData.sobrenome?.[0] || ''}` : 'US'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {loading ? 'Carregando...' : userData ? `${userData.nome || ''} ${userData.sobrenome || ''}`.trim() : 'Usuário'}
          </Text>
          <Text style={styles.subtitle}>
            {loading ? '...' : userData ? `${userData.cargo || 'Cargo'} • ${userData.departamento || 'Departamento'}` : 'Cargo • Departamento'}
          </Text>
          <Text style={styles.joinDate}>
            {loading ? '...' : userData?.createdAt ? `Membro desde ${new Date(userData.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}` : 'Membro desde 2023'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={loadData}
          disabled={loading}
        >
          <Ionicons 
            name="refresh" 
            size={20} 
            color={loading ? '#9CA3AF' : '#2563EB'} 
          />
        </TouchableOpacity>
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
        <Text style={styles.about}>
          {loading 
            ? 'Carregando informações...' 
            : userData 
              ? `${userData.cargo || 'Profissional'} do departamento de ${userData.departamento || 'TI'} focado em bem-estar no trabalho. Utiliza este app para monitorar saúde mental, física e produtividade.${userData.email ? ` Contato: ${userData.email}` : ''}` 
              : 'Profissional focado em bem-estar no trabalho híbrido. Utiliza este app para monitorar saúde mental, física e produtividade.'
          }
        </Text>
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
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
  badgeText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
