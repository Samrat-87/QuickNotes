// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@offline_notes';

// Fetch notes from local storage
export const getNotes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    // AsyncStorage stores strings. We parse it back into a JavaScript array.
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error reading notes", error);
    return [];
  }
};

// Save the entire notes array to local storage
export const saveNotes = async (notes) => {
  try {
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving notes", error);
  }
};