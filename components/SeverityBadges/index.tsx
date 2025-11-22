import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function SeverityBadge({ level }: { level: 'BAIXA' | 'MEDIA' | 'ALTA' }) {
  return <Text style={[styles.badge, styles[level]]}>{level}</Text>;
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, fontSize: 10, fontWeight: '700', color: '#fff', overflow: 'hidden' },
  BAIXA: { backgroundColor: '#10B981' },
  MEDIA: { backgroundColor: '#F59E0B' },
  ALTA: { backgroundColor: '#DC2626' }
});
