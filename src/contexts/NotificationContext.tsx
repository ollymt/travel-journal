// contexts/NotificationContext.js
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotificationsAsync,
  sendLocalNotification,
} from "../services/NotificationService";

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Register for push notifications on mount
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        console.log("Push token:", token);
      }
    });

    // Listener for notifications received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Listener for when user taps on notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification tapped:", response);
        // Handle navigation based on notification data
        const { entryId } = response.notification.request.content.data;
        if (entryId) {
          // Navigate to the entry
          // You'll need to pass navigation from your component
        }
      });

    // Handle app state changes (foreground/background)
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App has come to the foreground
        console.log("App has come to foreground");
      }
      appState.current = nextAppState;
    });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      subscription.remove();
    };
  }, []);

  // Send notification for new entry
  const notifyNewEntry = async (entry) => {
    await sendLocalNotification(
      "New Memory Added! 📸",
      `"${entry.title}" at ${entry.location}`,
      { entryId: entry.id, screen: "EntryDetail" },
    );
  };

  // Send notification for updated entry
  const notifyUpdatedEntry = async (entry) => {
    await sendLocalNotification(
      "Memory Updated! ✏️",
      `Your memory "${entry.title}" has been updated`,
      { entryId: entry.id, screen: "EntryDetail" },
    );
  };

  // Send notification for custom message
  const notifyCustom = async (title, body, data = {}) => {
    await sendLocalNotification(title, body, data);
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        notifyNewEntry,
        notifyUpdatedEntry,
        notifyCustom,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
