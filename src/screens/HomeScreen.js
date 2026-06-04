// src/screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getNotes, saveNotes } from '../utils/storage';

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const insets = useSafeAreaInsets();

  // Runs every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const storedNotes = await getNotes();
    setNotes(storedNotes);
  };

  const deleteNote = async (id) => {
    // Confirm before deleting
    Alert.alert("Delete", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive",
        onPress: async () => {
          const filteredNotes = notes.filter(note => note.id !== id);
          setNotes(filteredNotes);
          await saveNotes(filteredNotes);
        }
      }
    ]);
  };

  // Renders individual note cards
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('EditNote', { note: item })}
    >
      <View style={styles.cardTextContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.preview} numberOfLines={2}>{item.body}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 96 },
        ]}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes yet. Create one!</Text>}
      />
      {/* Floating Action Button for creating new notes */}
      <TouchableOpacity 
        style={[
          styles.fab,
          { bottom: insets.bottom + 20 },
        ]} 
        onPress={() => navigation.navigate('EditNote')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// UI Defense: Clean margins, subtle shadows for depth, and highly readable system fonts.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f5' },
  listContainer: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 // Subtle depth
  },
  cardTextContainer: { flex: 1, paddingRight: 12 },
  title: { fontSize: 18, fontWeight: '600', color: '#18181b', marginBottom: 4 },
  preview: { fontSize: 14, color: '#71717a' },
  deleteButton: { padding: 8 },
  deleteText: { color: '#ef4444', fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#a1a1aa', fontSize: 16 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#2563eb', width: 60, height: 60,
    borderRadius: 30, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 5
  },
  fabText: { color: '#ffffff', fontSize: 28, fontWeight: 'bold' }
});