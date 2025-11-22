import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export default function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 14, elevation: 2 }
});
