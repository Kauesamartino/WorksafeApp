import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12 }
});
