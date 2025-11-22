import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

interface Props { label: string; value: string | number; color?: string; }

export function MetricBadge({ label, value, color = '#2563EB' }: Props) {
  return (
    <View style={[styles.container, { borderColor: color }]}> 
      <Text style={[styles.label, { color }]}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 2, backgroundColor: '#fff', marginRight: 10, marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '600' },
  value: { fontSize: 16, fontWeight: '700', color: '#111827' }
});
