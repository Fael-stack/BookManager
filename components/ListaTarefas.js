import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

export default function ListaTarefas({ lista }) {
  return (
    <FlatList
      data={lista}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.nome}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
});
