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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { usePreventRemove } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { getStyles } from "../../styles/MainStyle";
import { useTravel } from "../../contexts/TravelContext";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";
import uuid from "react-native-uuid";

export default function AddEntryScreen({ navigation, route }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { addEntry, updateEntry, getEntry, deleteEntry } = useTravel();

  const entryId = route.params?.entryId;
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showEmojiInput, setShowEmojiInput] = useState(false);
  const [emoji, setEmoji] = useState("");

  // Add this state and effect
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setKeyboardVisible(true);
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const isSaving = useRef(false);
  const emojiInputRef = useRef(null);

  // Add these refs
  const scrollViewRef = useRef(null);
  const inputRefs = useRef({
    title: null,
    notes: null,
    location: null,
    emoji: null,
  }).current;

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
    isDeleted: false,
    emoji: "", // Add emoji field
  });

  const [errors, setErrors] = useState({});

  // Check if form has been modified
  const checkIfDirty = (newData) => {
    if (entryId) {
      const original = getEntry(entryId);
      if (!original) return true;

      return (
        newData.title !== original.title ||
        newData.location !== original.location ||
        newData.date !== original.date ||
        newData.notes !== original.notes ||
        newData.rating !== original.rating ||
        JSON.stringify(newData.photos) !== JSON.stringify(original.photos) ||
        JSON.stringify(newData.tags) !== JSON.stringify(original.tags) ||
        newData.emoji !== original.emoji
      );
    } else {
      return (
        newData.title.trim() !== "" ||
        newData.location.trim() !== "" ||
        newData.notes.trim() !== "" ||
        newData.rating !== 0 ||
        newData.photos.length > 0 ||
        newData.tags.length > 0 ||
        newData.emoji !== ""
      );
    }
  };

  // Update form data and check if dirty
  const updateFormData = (newData) => {
    setFormData(newData);
    setIsDirty(checkIfDirty(newData));
  };

  usePreventRemove(isDirty && !isSaving.current, ({ data }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
          emoji: existingEntry.emoji || "",
        };
        setFormData(loadedData);
        setEmoji(loadedData.emoji || "");
        setIsDirty(false);
      }
    }
  }, [entryId]);

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    isSaving.current = true;
    setLoading(true);

    const dataToSave = {
      ...formData,
      isDeleted: false,
      deletedAt: null,
      emoji: emoji || "", // Save emoji if any
    };

    let success;
    if (entryId) {
      success = await updateEntry(entryId, dataToSave);
    } else {
      success = await addEntry(dataToSave);
    }

    setLoading(false);

    if (success) {
      navigation.goBack();
    } else {
      isSaving.current = false;
      Alert.alert("Error", "Failed to save entry");
    }
  };

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

  const formatDisplayDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCurrentLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      setGettingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (errors.location) {
        setErrors({ ...errors, location: null });
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Error",
        "Failed to get your current location. Please check your GPS is enabled.",
      );
    } finally {
      setGettingLocation(false);
    }
  };

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

        // Clear emoji when photos are added
        setEmoji("");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  const takePhoto = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

        // Clear emoji when photos are added
        setEmoji("");
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
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          removeImage(item.id);
        }}
      >
        <Text style={styles.removeImageText}>×</Text>
      </Pressable>
    </View>
  );

  const addTag = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    updateFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteEntry(entryId);
            if (success) {
              navigation.goBack();
            }
          },
        },
      ],
    );
  };

  const handleEmojiPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowEmojiInput(true);
    // Small delay to ensure input is rendered before focusing
    setTimeout(() => {
      emojiInputRef.current?.focus();
    }, 100);
  };

  const handleEmojiChange = (text) => {
    // Only allow single character (emoji)
    if (text.length <= 2) {
      // Allow up to 2 for composite emojis
      setEmoji(text);
      updateFormData({ ...formData, emoji: text });
    }
  };

  const handleEmojiBlur = () => {
    setShowEmojiInput(false);
    // If emoji is empty, it will default to monogram in grid view
  };

  // Get monogram from title
  const getMonogram = () => {
    return formData.title?.charAt(0).toUpperCase() || "🫥";
  };

  const handleInputFocus = (inputName) => {
    setTimeout(() => {
      if (inputRefs[inputName] && scrollViewRef.current) {
        // Use the measure method which is more reliable
        inputRefs[inputName].measure((x, y, width, height, pageX, pageY) => {
          scrollViewRef.current?.scrollTo({
            y: pageY - 100, // Adjust this value to control how far from top
            animated: true,
          });
        });
      }
    }, 150);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.addEntryContainer, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.addEntryContainer}
          contentContainerStyle={styles.addEntryForm}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* Image Gallery or Emoji Preview */}
          {formData.photos.length > 0 ? (
            <>
              <Text style={styles.inputLabel}>
                Photos ({formData.photos.length})
              </Text>
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
            </>
          ) : (
            <View style={styles.emojiPreviewContainer}>
              {/*<Text style={styles.inputLabel}>Entry Icon</Text>*/}
              <Pressable onPress={handleEmojiPress} style={styles.emojiPreview}>
                {showEmojiInput ? (
                  <TextInput
                    ref={(ref) => {
                      emojiInputRef.current = ref;
                      inputRefs.emoji = ref;
                    }}
                    style={[styles.emojiInput]}
                    value={emoji}
                    onChangeText={handleEmojiChange}
                    onBlur={handleEmojiBlur}
                    onFocus={() => handleInputFocus("emoji")}
                    maxLength={2}
                    autoFocus
                    keyboardAppearance={theme.isDarkMode ? "dark" : "light"}
                  />
                ) : (
                  <Text style={styles.emojiPreviewText}>
                    {emoji || getMonogram()}
                  </Text>
                )}
              </Pressable>
              <Text style={styles.emojiHelperText}>
                Tap to {emoji ? "change" : "add"} an icon
              </Text>
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
              ref={(ref) => (inputRefs.title = ref)}
              style={[styles.input, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={(text) => {
                updateFormData({ ...formData, title: text });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              onFocus={() => handleInputFocus("title")}
              placeholder="Enter a title"
              placeholderTextColor={theme.textSecondary}
              maxLength={100}
              keyboardAppearance={theme.isDarkMode ? "dark" : "light"}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          {/* Notes Input */}
          <View style={styles.inputField}>
            <Text style={styles.inputLabel}>Body</Text>
            <TextInput
              ref={(ref) => (inputRefs.notes = ref)}
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) =>
                updateFormData({ ...formData, notes: text })
              }
              onFocus={() => handleInputFocus("notes")}
              placeholder="Write your memories..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              keyboardAppearance={theme.isDarkMode ? "dark" : "light"}
            />
          </View>

          {/* Location Input */}
          <View style={styles.inputField}>
            <View style={styles.locationHeader}>
              <Text style={styles.inputLabel}>Location *</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 4 }}>
              <TextInput
                ref={(ref) => (inputRefs.location = ref)}
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
                onFocus={() => handleInputFocus("location")}
                placeholder="Where did you go?"
                placeholderTextColor={theme.textSecondary}
                maxLength={100}
                editable={!gettingLocation}
                keyboardAppearance={theme.isDarkMode ? "dark" : "light"}
              />
              <Pressable
                style={styles.locationButton}
                onPress={getCurrentLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? (
                  <ActivityIndicator
                    size="small"
                    animating={true}
                    color={theme.primaryText}
                  />
                ) : (
                  <Text style={styles.locationButtonText}>📍</Text>
                )}
              </Pressable>
            </View>
            {errors.location && (
              <Text style={styles.errorText}>{errors.location}</Text>
            )}
          </View>

          {/* Date Input */}
          <View style={styles.inputField}>
            <Text style={styles.inputLabel}>Date</Text>
            <Pressable
              style={styles.datePickerButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowDatePicker(true);
              }}
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
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateFormData({ ...formData, rating: star });
                  }}
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

          {/* Action Buttons */}
          <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "row", gap: 4 }}>
              {entryId && (
                <Pressable style={styles.deleteButton} onPress={handleDelete}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              )}
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
                    {entryId ? "Save Changes" : "Save Entry"}
                  </Text>
                )}
              </Pressable>
            </View>

            <Pressable
              style={[styles.cancelButton, { flex: 1 }]}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>
                {isDirty ? "Discard" : "Cancel"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
