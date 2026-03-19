import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import EntriesPage from "./src/pages/EntriesPage/EntriesPage";
import AppNavigator from './src/navigator/AppNavigator';
import { ThemeContext } from '@react-navigation/native';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TravelProvider } from './src/contexts/TravelContext';

export default function App() {
  return (
    <ThemeProvider>
      <TravelProvider>
        <SafeAreaProvider style={{ flex: 1 }}>
          <AppNavigator />
        </SafeAreaProvider>
      </TravelProvider>
    </ThemeProvider>
  );
}