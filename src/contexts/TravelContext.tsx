import { useEffect, useState, useContext, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import * as ImagePicker from "expo-image-picker";

const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Expo-compatible image picker
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission needed to access photos");
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled) {
        return {
          uri: result.assets[0].uri,
          fileName: result.assets[0].fileName || `image_${Date.now()}.jpg`,
          fileSize: result.assets[0].fileSize,
          type: "image/jpeg",
        };
      }
      return null;
    } catch (error) {
      console.error("Error picking image:", error);
      return null;
    }
  };

  // Expo-compatible camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Permission needed to use camera");
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled) {
        return {
          uri: result.assets[0].uri,
          fileName: result.assets[0].fileName || `photo_${Date.now()}.jpg`,
          fileSize: result.assets[0].fileSize,
          type: "image/jpeg",
        };
      }
      return null;
    } catch (error) {
      console.error("Error taking photo:", error);
      return null;
    }
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
        pickImage,
        takePhoto,
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
