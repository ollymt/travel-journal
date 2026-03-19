import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
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
      "Delete Memory",
      "Are you sure you want to delete this memory?",
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
                <TouchableOpacity
                  style={[styles.imageNavButton, styles.imageNavLeft]}
                  onPress={prevImage}
                >
                  <Text style={styles.imageNavText}>←</Text>
                </TouchableOpacity>
              )}
              {currentImageIndex < entry.photos.length - 1 && (
                <TouchableOpacity
                  style={[styles.imageNavButton, styles.imageNavRight]}
                  onPress={nextImage}
                >
                  <Text style={styles.imageNavText}>→</Text>
                </TouchableOpacity>
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
          style={[styles.noImageContainer, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.noImageText, { color: theme.textSecondary }]}>
            No photo available
          </Text>
        </View>
      )}

      {/* Entry Details */}
      <View style={styles.entryDetailContent}>
        <Text style={styles.entryDetailTitle}>{entry.title}</Text>
        <Text style={styles.entryDetailLocation}>📍 {entry.location}</Text>
        <Text style={styles.entryDetailDate}>📅 {formatDate(entry.date)}</Text>

        {entry.rating > 0 && (
          <View style={styles.entryDetailRating}>
            <Text style={styles.entryDetailRatingText}>Rating: </Text>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text
                key={star}
                style={[styles.star, star <= entry.rating && styles.starFilled]}
              >
                ★
              </Text>
            ))}
          </View>
        )}

        {entry.notes ? (
          <>
            <Text style={styles.entryDetailSectionTitle}>Notes</Text>
            <Text style={styles.entryDetailNotes}>{entry.notes}</Text>
          </>
        ) : null}

        {entry.tags && entry.tags.length > 0 ? (
          <>
            <Text style={styles.entryDetailSectionTitle}>Tags</Text>
            <View style={styles.entryDetailTags}>
              {entry.tags.map((tag, index) => (
                <View key={index} style={styles.entryDetailTag}>
                  <Text style={styles.entryDetailTagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.detailActionButtons}>
          <TouchableOpacity
            style={[styles.detailButton, styles.editButton]}
            onPress={handleEdit}
          >
            <Text style={styles.detailButtonText}>Edit Memory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.detailButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.detailButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
