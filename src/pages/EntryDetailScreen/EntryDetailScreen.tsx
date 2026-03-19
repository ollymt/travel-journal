import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { getStyles } from "../../styles/MainStyle";
import { useTravel } from "../../contexts/TravelContext";

const { width } = Dimensions.get("window");

export default function EntryDetailScreen({ navigation, route }) {
  const { entryId } = route.params;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { getEntry, deleteEntry } = useTravel();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const entry = getEntry(entryId);

  // Format date for header
  const formatHeaderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Set header title when entry loads
  useEffect(() => {
    if (entry) {
      navigation.setOptions({
        title: formatHeaderDate(entry.date),
      });
    }
  }, [entry, navigation]); // Re-run if entry changes

  if (!entry) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Entry not found</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = () => {
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

  const handleEdit = () => {
    navigation.navigate("AddEntry", { entryId: entry.id });
  };

  // Handle image navigation
  const nextImage = () => {
    if (entry.photos && currentImageIndex < entry.photos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <ScrollView
      style={[
        styles.entryDetailContainer,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Main Image */}
      {entry.photos && entry.photos.length > 0 ? (
        <View style={styles.imageViewerContainer}>
          <Image
            source={{
              uri:
                entry.photos[currentImageIndex].uri ||
                entry.photos[currentImageIndex],
            }}
            style={styles.detailMainImage}
          />

          {/* Image navigation arrows (if multiple photos) */}
          {entry.photos.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <Pressable
                  style={[styles.imageNavButton, styles.imageNavLeft]}
                  onPress={prevImage}
                >
                  <Text style={styles.imageNavText}>←</Text>
                </Pressable>
              )}
              {currentImageIndex < entry.photos.length - 1 && (
                <Pressable
                  style={[styles.imageNavButton, styles.imageNavRight]}
                  onPress={nextImage}
                >
                  <Text style={styles.imageNavText}>→</Text>
                </Pressable>
              )}
            </>
          )}

          {/* Photo counter */}
          {entry.photos.length > 1 && (
            <View style={styles.photoCounter}>
              <Text style={styles.photoCounterText}>
                {currentImageIndex + 1} / {entry.photos.length}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View
          style={[styles.noImageContainer]}
        >
          <Text style={[styles.noImageText]}>
            No photo available
          </Text>
        </View>
      )}

      {/* Entry Details */}
      <View style={styles.entryDetailContent}>
        {entry.tags && entry.tags.length > 0 ? (
          <>
            <View style={styles.entryDetailTags}>
              {entry.tags.map((tag, index) => (
                <View key={index} style={styles.entryDetailTag}>
                  <Text style={styles.entryDetailTagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
        <Text style={styles.entryDetailTitle}>{entry.title}</Text>
        <Text style={styles.entryDetailLocation}>📍 {entry.location}</Text>

        {entry.rating > 0 && (
          <View style={styles.entryDetailRating}>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text
                  key={star}
                  style={[
                    styles.star,
                    styles.starPressable,
                    star <= entry.rating && styles.starFilled,
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
          </View>
        )}

        {entry.notes ? (
          <>
            <Text style={styles.entryDetailNotes}>{entry.notes}</Text>
          </>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.detailActionButtons}>
          <Pressable
            style={[styles.detailButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={[styles.detailButtonText, styles.deleteButtonText]}>
              Delete
            </Text>
          </Pressable>

          <Pressable
            style={[styles.detailButton, styles.editButton]}
            onPress={handleEdit}
          >
            <Text style={[styles.detailButtonText, styles.editButtonText]}>
              Edit Entry
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
