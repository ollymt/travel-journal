// screens/AddEntryScreen/AddEntryScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
} from "react-native";
import { usePreventRemove } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { getStyles } from "../../styles/MainStyle";
import { useTravel } from "../../contexts/TravelContext";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import uuid from "react-native-uuid";
import { playSound } from "../../services/SoundService";

export default function AddEntryScreen({ navigation, route }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { addEntry, updateEntry, getEntry } = useTravel();

  const entryId = route.params?.entryId;
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Track if form has been modified

  const isSaving = useRef(false);

  // Parse date string to Date object
  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    rating: 0,
    photos: [],
    tags: [],
    coordinates: null,
  });

  const [errors, setErrors] = useState({});

  // Check if form has been modified
  const checkIfDirty = (newData) => {
    if (entryId) {
      // For edit mode, compare with original
      const original = getEntry(entryId);
      if (!original) return true;

      return (
        newData.title !== original.title ||
        newData.location !== original.location ||
        newData.date !== original.date ||
        newData.notes !== original.notes ||
        newData.rating !== original.rating ||
        JSON.stringify(newData.photos) !== JSON.stringify(original.photos) ||
        JSON.stringify(newData.tags) !== JSON.stringify(original.tags)
      );
    } else {
      // For new entry, check if any field is filled
      return (
        newData.title.trim() !== "" ||
        newData.location.trim() !== "" ||
        newData.notes.trim() !== "" ||
        newData.rating !== 0 ||
        newData.photos.length > 0 ||
        newData.tags.length > 0
      );
    }
  };

  // Update form data and check if dirty
  const updateFormData = (newData) => {
    setFormData(newData);
    setIsDirty(checkIfDirty(newData));
  };

  // Update usePreventRemove to check isSaving
  usePreventRemove(isDirty && !isSaving.current, ({ data }) => {
    Alert.alert(
      "Discard Changes?",
      "You have unsaved changes. Are you sure you want to discard them?",
      [
        { text: "Stay", style: "cancel", onPress: () => {} },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });

  // Set header title and add close button
  useEffect(() => {
    navigation.setOptions({
      title: entryId ? "Edit Entry" : "New Entry",
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 0, padding: 8 }}
        >
          <Text
            style={{ color: theme.primary, fontSize: 20, fontWeight: "600" }}
          >
            ←
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, entryId, theme, isDirty]);

  // Load existing entry if editing
  useEffect(() => {
    if (entryId) {
      const existingEntry = getEntry(entryId);
      if (existingEntry) {
        const loadedData = {
          title: existingEntry.title || "",
          location: existingEntry.location || "",
          date: existingEntry.date || new Date().toISOString().split("T")[0],
          notes: existingEntry.notes || "",
          rating: existingEntry.rating || 0,
          photos: existingEntry.photos || [],
          tags: existingEntry.tags || [],
          coordinates: existingEntry.coordinates || null,
        };
        setFormData(loadedData);
        setIsDirty(false); // Start with clean state for edit
      }
    }
  }, [entryId]);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        Alert.alert(
          "Permissions needed",
          "Please grant camera and photo library permissions to add images.",
        );
      }
    })();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    // Set isSaving BEFORE any async operations
    isSaving.current = true;
    setLoading(true);

    let success;
    if (entryId) {
      success = await updateEntry(entryId, formData);
    } else {
      success = await addEntry(formData);
    }

    setLoading(false);

    if (success) {
      // Navigate back immediately without confirmation
      navigation.goBack();
    } else {
      // If save failed, reset isSaving so prevent remove works again
      isSaving.current = false;
      Alert.alert("Error", "Failed to save entry");
    }
  };

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      updateFormData({ ...formData, date: dateString });
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setGettingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please grant location permissions to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let locationString = "";
      if (address) {
        const parts = [];
        if (address.name) parts.push(address.name);
        if (address.city) parts.push(address.city);
        if (address.region) parts.push(address.region);
        if (address.country) parts.push(address.country);
        locationString = parts.join(", ");
      }

      if (!locationString) {
        locationString = `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
      }

      updateFormData({
        ...formData,
        location: locationString,
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });

      if (errors.location) {
        setErrors({ ...errors, location: null });
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Error",
        "Failed to get your current location. Please check your GPS is enabled.",
      );
    } finally {
      setGettingLocation(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.map((asset) => ({
          id: uuid.v4(),
          uri: asset.uri,
          fileName: asset.fileName || `image_${Date.now()}.jpg`,
          fileSize: asset.fileSize,
          type: "image/jpeg",
        }));

        updateFormData({
          ...formData,
          photos: [...formData.photos, ...newPhotos],
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newPhoto = {
          id: uuid.v4(),
          uri: result.assets[0].uri,
          fileName: `photo_${Date.now()}.jpg`,
          fileSize: result.assets[0].fileSize,
          type: "image/jpeg",
        };

        updateFormData({
          ...formData,
          photos: [...formData.photos, newPhoto],
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
      console.error(error);
    }
  };

  const removeImage = (imageId) => {
    updateFormData({
      ...formData,
      photos: formData.photos.filter((photo) => photo.id !== imageId),
    });
  };

  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.imagePreview} />
      <Pressable
        style={styles.removeImageButton}
        onPress={() => removeImage(item.id)}
      >
        <Text style={styles.removeImageText}>×</Text>
      </Pressable>
    </View>
  );

  const addTag = () => {
    Alert.prompt("Add Tag", "Enter a tag (e.g., beach, food, adventure)", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Add",
        onPress: (tag) => {
          if (tag && tag.trim()) {
            updateFormData({
              ...formData,
              tags: [...formData.tags, tag.trim().toLowerCase()],
            });
          }
        },
      },
    ]);
  };

  const removeTag = (tagToRemove) => {
    updateFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.addEntryContainer, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.addEntryContainer}
        contentContainerStyle={styles.addEntryForm}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        <Text style={styles.inputLabel}>Photos ({formData.photos.length})</Text>
        {formData.photos.length > 0 && (
          <View style={styles.imageGallery}>
            <FlatList
              data={formData.photos}
              renderItem={renderImage}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageList}
            />
          </View>
        )}

        {/* Image Picker Buttons */}
        <View style={styles.imagePickerRow}>
          <Pressable
            style={[styles.imagePickerButton, { flex: 1, marginRight: 5 }]}
            onPress={pickImage}
          >
            <Text style={styles.imagePickerIcon}>🖼️</Text>
            <Text style={styles.imagePickerText}>Camera Roll</Text>
          </Pressable>

          <Pressable
            style={[styles.imagePickerButton, { flex: 1, marginLeft: 5 }]}
            onPress={takePhoto}
          >
            <Text style={styles.imagePickerIcon}>📸</Text>
            <Text style={styles.imagePickerText}>Take Photo</Text>
          </Pressable>
        </View>

        {/* Title Input */}
        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>Title *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={formData.title}
            onChangeText={(text) => {
              updateFormData({ ...formData, title: text });
              if (errors.title) setErrors({ ...errors, title: null });
            }}
            placeholder="Enter a title"
            placeholderTextColor={theme.textSecondary}
            maxLength={100}
            keyboardAppearance={theme.isDarkMode ? "dark" : "light"} // ← Add this
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Location Input with Get Current Location Button */}
        <View style={styles.inputField}>
          <View style={styles.locationHeader}>
            <Text style={styles.inputLabel}>Location *</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 4 }}>
            <TextInput
              style={[
                styles.input,
                styles.locationInput,
                errors.location && styles.inputError,
              ]}
              value={formData.location}
              onChangeText={(text) => {
                updateFormData({ ...formData, location: text });
                if (errors.location) setErrors({ ...errors, location: null });
              }}
              placeholder="Where did you go?"
              placeholderTextColor={theme.textSecondary}
              maxLength={100}
              editable={!gettingLocation}
              keyboardAppearance={theme.isDarkMode ? "dark" : "light"} // ← Add this
            />
            <Pressable
              style={styles.locationButton}
              onPress={getCurrentLocation}
              disabled={gettingLocation}
            >
              {gettingLocation ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <Text style={styles.locationButtonText}>📍</Text>
              )}
            </Pressable>
          </View>
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}
        </View>

        {/* Date Input with Picker */}
        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>Date</Text>
          <Pressable
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>
              {formatDisplayDate(formData.date)}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={parseDate(formData.date)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              maximumDate={new Date()}
              themeVariant={theme.isDarkMode ? "dark" : "light"}
              textColor={theme.text}
            />
          )}
        </View>

        {/* Rating */}
        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>Rating</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => updateFormData({ ...formData, rating: star })}
                style={[
                  styles.starPressable,
                  star <= formData.rating && styles.starFilled,
                ]}
              >
                <Text
                  style={[
                    styles.star,
                    star <= formData.rating && styles.starFilled,
                  ]}
                >
                  ★
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Notes Input */}
        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) =>
              updateFormData({ ...formData, notes: text })
            }
            placeholder="Write your memories..."
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            keyboardAppearance={theme.isDarkMode ? "dark" : "light"} // ← Add this
          />
        </View>

        {/* Tags */}
        <View style={styles.inputField}>
          <View style={styles.tagHeader}>
            <Text style={styles.inputLabel}>Tags</Text>
            <Pressable onPress={addTag}>
              <Text style={styles.addTagText}>+ Add Tag</Text>
            </Pressable>
          </View>

          {formData.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {formData.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                  <Pressable onPress={() => removeTag(tag)}>
                    <Text style={styles.removeTagText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ flexDirection: "column", gap: 8 }}>
          {/* Cancel Button */}
          <Pressable
            style={[styles.cancelButton, { flex: 1 }]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          {/* Save Button */}
          <Pressable
            style={[
              styles.saveButton,
              loading && styles.disabledButton,
              { flex: 2 },
            ]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.primaryText} />
            ) : (
              <Text style={styles.saveButtonText}>
                {entryId ? "Update Entry" : "Save Entry"}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
