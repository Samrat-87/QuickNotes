// src/screens/EditScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getNotes, saveNotes } from '../utils/storage';

export default function EditScreen({ route, navigation }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const insets = useSafeAreaInsets();
  
  // If a note object was passed via navigation params, we are editing.
  const existingNote = route.params?.note;

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setBody(existingNote.body);
    }
  }, [existingNote]);

  const handleSave = async () => {
    // Prevent saving completely empty notes
    if (!title.trim() && !body.trim()) {
      navigation.goBack();
      return;
    }

    const currentNotes = await getNotes();
    let updatedNotes;

    if (existingNote) {
      // Update logic: map through and replace the one with the matching ID
      updatedNotes = currentNotes.map(n => 
        n.id === existingNote.id ? { ...n, title, body, updatedAt: Date.now() } : n
      );
    } else {
      // Create logic: generate a new ID and prepend to the array
      const newNote = {
        id: Date.now().toString(), 
        title,
        body,
        createdAt: Date.now(),
      };
      updatedNotes = [newNote, ...currentNotes];
    }

    await saveNotes(updatedNotes);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top + 12}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      >
        <View style={styles.form}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#a1a1aa"
          />
          <TextInput
            style={styles.bodyInput}
            placeholder="Write your note here..."
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#a1a1aa"
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flexGrow: 1, padding: 20 },
  form: { flex: 1 },
  titleInput: {
    fontSize: 28, fontWeight: '700', color: '#18181b',
    borderBottomWidth: 1, borderBottomColor: '#e4e4e7',
    paddingVertical: 12, marginBottom: 16
  },
  bodyInput: { flex: 1, minHeight: 220, fontSize: 16, color: '#3f3f46', lineHeight: 24 },
  saveBtn: {
    backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 8,
    alignItems: 'center', marginTop: 16
  },
  saveBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' }
});