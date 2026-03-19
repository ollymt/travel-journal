// contexts/TravelContext.js
import { useEffect, useState, useContext, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { useNotifications } from "./NotificationContext"; // Add this

const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get notification functions
  const { notifyNewEntry, notifyUpdatedEntry } = useNotifications();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem("@travel_journal");

      if (jsonValue !== null) {
        setEntries(JSON.parse(jsonValue));
      }
    } catch (e) {
      setError("Failed to load entries");
      console.error("Error loading entries: ", e);
    } finally {
      setLoading(false);
    }
  };

  const saveEntries = async (newEntries) => {
    try {
      const jsonValue = JSON.stringify(newEntries);
      await AsyncStorage.setItem("@travel_journal", jsonValue);
    } catch (e) {
      setError("Failed to save entries");
      console.error("Error saving entries: ", e);
    }
  };

  const addEntry = async (entryData) => {
    try {
      const newEntry = {
        id: uuid.v4(),
        ...entryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      await saveEntries(updatedEntries);

      // Send notification for new entry
      await notifyNewEntry(newEntry);

      return newEntry;
    } catch (e) {
      setError("Failed to add entry");
      console.error("Error adding entry: ", e);
      return null;
    }
  };

  const updateEntry = async (id, updatedData) => {
    try {
      const updatedEntries = entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              ...updatedData,
              updatedAt: new Date().toISOString(),
            }
          : entry,
      );

      setEntries(updatedEntries);
      await saveEntries(updatedEntries);

      // Find the updated entry to get its data
      const updatedEntry = updatedEntries.find((e) => e.id === id);

      // Send notification for updated entry
      if (updatedEntry) {
        await notifyUpdatedEntry(updatedEntry);
      }

      return true;
    } catch (e) {
      setError("Failed to update entry");
      console.error("Error updating entry: ", e);
      return false;
    }
  };

  const deleteEntry = async (id) => {
    try {
      const updatedEntries = entries.filter((entry) => entry.id !== id);
      setEntries(updatedEntries);
      await saveEntries(updatedEntries);
      return true;
    } catch (e) {
      setError("Failed to delete entry");
      console.error("Error deleting entry: ", e);
      return false;
    }
  };

  const getEntry = (id) => {
    return entries.find((entry) => entry.id === id);
  };

  return (
    <TravelContext.Provider
      value={{
        entries,
        loading,
        error,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntry,
        refreshEntries: loadEntries,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error("useTravel must be used within TravelProvider");
  }
  return context;
};
