// npm install @react-navigation/native
// npm install @react-navigation/stack
// npm install @react-navigation/native-stack
// npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";
import { getStyles } from "../styles/MainStyle";
import { StatusBar } from "expo-status-bar";
import EntriesPage from "../pages/EntriesPage/EntriesPage";
import AddEntryScreen from "../pages/AddEntryScreen/AddEntryScreen";
import EntryDetailScreen from "../pages/EntryDetailScreen/EntryDetailScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <NavigationContainer>
      <StatusBar style={theme.isDarkMode ? "light" : "dark"} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.border || "#eee",
          },
          headerTitleStyle: {
            color: theme.text,
            fontWeight: "bold",
          },
          headerTintColor: theme.primary,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen
          name="Entries"
          component={EntriesPage}
          options={{ title: "Travel Journal" }}
        />
        <Stack.Screen
          name="AddEntry"
          component={AddEntryScreen}
          options={({ route }) => ({
            title: route.params?.entryId ? "Edit Entry" : "New Entry",
            presentation: "modal",
          })}
        />
        <Stack.Screen
          name="EntryDetail"
          component={EntryDetailScreen}
          options={{ title: "Entry Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;