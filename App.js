// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
// We will create these screens in the next step
import HomeScreen from './src/screens/HomeScreen';
import EditScreen from './src/screens/EditScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'My Notes' }} 
        />
        <Stack.Screen 
          name="EditNote" 
          component={EditScreen} 
          options={{ title: 'Edit Note' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}