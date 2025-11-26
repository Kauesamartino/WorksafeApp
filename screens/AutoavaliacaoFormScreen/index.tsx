import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// Slider opcional: se biblioteca não instalada, substituir por TextInput.
// Para produção: npx expo install @react-native-community/slider
import Slider from '@react-native-community/slider';
import { apiService } from '../../services/api';
import { Autoavaliacao } from '../../types/entities';
import { useTheme } from '../../theme';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';

type AutoavaliacaoFormRouteProp = RouteProp<RootStackParamList, 'AutoavaliacaoForm'>;

export default function AutoavaliacaoFormScreen() {
  const route = useRoute<AutoavaliacaoFormRouteProp>();
  const nav = useNavigation();
  const { colors } = useTheme();
  const { id } = route.params || {};
  const [estado, setEstado] = useState<Partial<Autoavaliacao>>({
    data: new Date().toISOString().substring(0, 10),
    estresse: 5,
    humor: 5,
    energia: 5,
    qualidadeSono: 5,
    comentarios: ''
  });

  useEffect(() => {
    async function carregar() {
      if (id) {
        const lista = await apiService.getAutoavaliacoes();
        const existente = lista.find((a: any) => a.id === id);
        if (existente) setEstado(existente);
      }
    }
    carregar();
  }, [id]);

  function validar() {
    const campos = ['estresse','humor','energia','qualidadeSono'] as const;
    for (const c of campos) {
      const v = estado[c];
      if (typeof v !== 'number' || v < 0 || v > 10 || isNaN(v)) {
        Alert.alert('Valor inválido', `Campo ${c} deve estar entre 0 e 10.`);
        return false;
      }
    }
    
    if (!estado.data) {
      Alert.alert('Erro', 'Data é obrigatória');
      return false;
    }
    
    return true;
  }

  async function salvar() {
    if (!validar()) return;
    try {
      console.log('Salvando autoavaliação:', { id, estado });
      
      if (id) {
        await apiService.updateAutoavaliacao(id, estado as Autoavaliacao);
        console.log('Autoavaliação atualizada com sucesso');
      } else {
        const resultado = await apiService.createAutoavaliacao(estado as Omit<Autoavaliacao, 'id'>);
        console.log('Autoavaliação criada com sucesso:', resultado);
      }
      
      nav.goBack();
    } catch (e: any) {
      console.error('Erro ao salvar autoavaliação:', e);
      Alert.alert('Erro', e.message || 'Falha ao salvar');
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      {(['estresse','humor','energia','qualidadeSono'] as const).map(key => (
        <View key={key} style={styles.field}> 
          <View style={styles.sliderHeader}> 
            <Text style={styles.sliderLabel}>{key}</Text>
            <Text style={styles.sliderValue}>{(estado as any)[key]}</Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={(estado as any)[key]}
            onValueChange={(v: number) => setEstado(s => ({ ...s, [key]: v }))}
            minimumTrackTintColor="#2563EB"
            maximumTrackTintColor="#93A5BF"
          />
        </View>
      ))}
      <View style={styles.field}>
        <Text>Comentários</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={estado.comentarios}
          onChangeText={t => setEstado(s => ({ ...s, comentarios: t }))}
        />
      </View>
      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  field: { marginBottom: 12 },
  input: { backgroundColor: '#fff', borderRadius: 6, padding: 8, borderWidth: 1, borderColor: '#ddd' },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  sliderLabel: { fontWeight: '600', textTransform: 'capitalize' },
  sliderValue: { fontWeight: '600', color: '#2563EB' }
});
