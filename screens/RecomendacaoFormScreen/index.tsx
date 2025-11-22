import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { criarRecomendacao, listarRecomendacoes, atualizarRecomendacao } from '../../services/mockApi';
import { Recomendacao } from '../../types/entities';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Params { id?: number }

export default function RecomendacaoFormScreen() {
  const route = useRoute();
  const nav = useNavigation();
  const { id } = route.params as Params;
  const [estado, setEstado] = useState<Partial<Recomendacao>>({
    usuarioId: 1,
    tipoAtividade: 'PAUSA',
    titulo: '',
    descricao: '',
    createdAt: new Date().toISOString().substring(0, 10),
    consumido: false
  });

  useEffect(() => {
    async function carregar() {
      if (id) {
        const lista = await listarRecomendacoes();
        const existente = lista.find(r => r.id === id);
        if (existente) setEstado(existente);
      }
    }
    carregar();
  }, [id]);

  function validar() {
    if (!estado.titulo?.trim()) { Alert.alert('Validação', 'Título é obrigatório'); return false; }
    if (!estado.descricao?.trim()) { Alert.alert('Validação', 'Descrição é obrigatória'); return false; }
    return true;
  }

  async function salvar() {
    if (!validar()) return;
    try {
      if (id) await atualizarRecomendacao(id, estado as Recomendacao);
      else await criarRecomendacao(estado as Omit<Recomendacao, 'id'>);
      nav.goBack();
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Falha ao salvar');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{id ? 'Editar Recomendação' : 'Nova Recomendação'}</Text>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={estado.titulo} onChangeText={t => setEstado(s => ({ ...s, titulo: t }))} />
      <Text style={styles.label}>Descrição</Text>
      <TextInput style={[styles.input, { height: 80 }]} multiline value={estado.descricao} onChangeText={t => setEstado(s => ({ ...s, descricao: t }))} />
      <Text style={styles.label}>Tipo de Atividade</Text>
      <View style={styles.tipoRow}>
        {['PAUSA','EXERCICIO','POSTURA','HIDRATACAO'].map(opt => (
          <Text
            key={opt}
            onPress={() => setEstado(s => ({ ...s, tipoAtividade: opt }))}
            style={[styles.tipoChip, estado.tipoAtividade === opt && styles.tipoChipActive]}
          >{opt}</Text>
        ))}
      </View>
      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 6, padding: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 12 },
  tipoRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  tipoChip: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8, fontSize: 12, fontWeight: '600', color: '#374151', elevation: 1 },
  tipoChipActive: { backgroundColor: '#2563EB', color: '#fff' }
});
