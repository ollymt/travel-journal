// screens/AddEntryScreen/AddEntryScreen.js
import React, { useState, useEffect } from "react";
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
import { useTheme } from "../../contexts/ThemeContext";
import { getStyles } from "../../styles/MainStyle";
import { useTravel } from "../../contexts/TravelContext";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import uuid from "react-native-uuid";

export default function AddEntryScreen({ navigation, route }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { addEntry, updateEntry, getEntry } = useTravel();

  const entryId = route.params?.entryId;
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // Set header title
  useEffect(() => {
    navigation.setOptions({
      title: entryId ? "Edit Entry" : "New Entry",
    });
  }, [entryId, navigation]);

  // Load existing entry if editing
  useEffect(() => {
    if (entryId) {
      const existingEntry = getEntry(entryId);
      if (existingEntry) {
        setFormData({
          title: existingEntry.title || "",
          location: existingEntry.location || "",
          date: existingEntry.date || new Date().toISOString().split("T")[0],
          notes: existingEntry.notes || "",
          rating: existingEntry.rating || 0,
          photos: existingEntry.photos || [],
          tags: existingEntry.tags || [],
          coordinates: existingEntry.coordinates || null,
        });
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

    setLoading(true);

    let success;
    if (entryId) {
      success = await updateEntry(entryId, formData);
    } else {
      success = await addEntry(formData);
    }

    setLoading(false);

    if (success) {
      Alert.alert(
        "Success",
        entryId ? "Entry updated successfully!" : "Entry added successfully!",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } else {
      Alert.alert("Error", "Failed to save entry");
    }
  };

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios"); // Keep open on iOS, close on Android

    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      setFormData((prev) => ({
        ...prev,
        date: dateString,
      }));
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

      setFormData((prev) => ({
        ...prev,
        location: locationString,
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));

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

        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...newPhotos],
        }));
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

        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, newPhoto],
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
      console.error(error);
    }
  };

  const removeImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== imageId),
    }));
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
            setFormData((prev) => ({
              ...prev,
              tags: [...prev.tags, tag.trim().toLowerCase()],
            }));
          }
        },
      },
    ]);
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.addEntryContainer, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        style={styles.addEntryContainer}
        contentContainerStyle={styles.addEntryForm}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
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
              setFormData({ ...formData, title: text });
              if (errors.title) setErrors({ ...errors, title: null });
            }}
            placeholder="Enter a title"
            placeholderTextColor={theme.textSecondary}
            maxLength={100}
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
                setFormData({ ...formData, location: text });
                if (errors.location) setErrors({ ...errors, location: null });
              }}
              placeholder="Where did you go?"
              placeholderTextColor={theme.textSecondary}
              maxLength={100}
              editable={!gettingLocation}
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

          {formData.coordinates && (
            <Text style={styles.coordinatesText}>
              📍 {formData.coordinates.latitude.toFixed(4)},{" "}
              {formData.coordinates.longitude.toFixed(4)}
            </Text>
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
            <View style={[styles.datetimePickerCont]}>
                <DateTimePicker
                value={parseDate(formData.date)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                maximumDate={new Date()}
                themeVariant={theme.isDarkMode ? "dark" : "light"}
                textColor={theme.text}
                />
            </View>
          )}
        </View>

        {/* Rating */}
        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>Rating</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setFormData({ ...formData, rating: star })}
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
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Write your memories..."
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
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

        <View>
          {/* Save Button */}
          <Pressable
            style={[
              styles.saveButton,
              {
                /*loading && styles.disabledButton*/
              },
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

          {/* Cancel Button */}
          <Pressable
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
