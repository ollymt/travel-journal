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

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <NavigationContainer>
      <StatusBar style={theme.isDarkMode ? "light" : "dark"} />
      <Stack.Navigator
        screenOptions={{
          // 1. Background color of the header
          headerStyle: {
            backgroundColor: theme.background, // or theme.card
            elevation: 0, // Removes shadow on Android
            shadowOpacity: 0, // Removes shadow on iOS
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          },
          // 2. Color of the Title text
          headerTitleStyle: {
            color: theme.text,
            fontFamily: "Your-Font-Bold", // If you use custom fonts
          },
          // 3. Color of the Back button and icons
          headerTintColor: theme.primary,
          // 4. Background color of the page behind the header
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Entries" component={EntriesPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
