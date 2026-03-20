import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { getStyles } from "../../styles/MainStyle";
import { useTravel } from "../../contexts/TravelContext";
import { useState, useRef, useEffect } from "react";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");
const numColumns = 3;
const gap = 2;
const itemSize = (width - gap * (numColumns - 1) - 40) / numColumns; // 40 for horizontal padding

export default function EntriesPage({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  const { entries, loading, error, getEntry, deleteEntry } = useTravel();

  const [isEditing, setIsEditing] = useState(false);
  const [isOnDeleted, setIsOnDeleted] = useState(false);
  const [deletedEntry, setDeletedEntry] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  const bannerHeight = 50; // Fixed height
  const bannerTranslateY = useRef(new Animated.Value(-bannerHeight)).current;
  const contentTranslateY = useRef(new Animated.Value(0)).current;
  const undoTimeoutRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      // Banner slides down, content slides down with it
      Animated.parallel([
        Animated.timing(bannerTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: bannerHeight,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Both slide back up
      Animated.parallel([
        Animated.timing(bannerTranslateY, {
          toValue: -bannerHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isEditing]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    };
  }, []);

  const handleLongPress = () => {
    setIsEditing(true);
  };

  const handleItemPress = (item) => {
    if (isEditing) {
      // In edit mode, show delete confirmation
      Alert.alert(
        "Delete Entry",
        "Are you sure you want to delete this entry? You can undo this action for 5 seconds.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => performDelete(item),
          },
        ],
      );
    } else {
      // Normal mode, navigate to detail
      navigation.navigate("EntryDetail", {
        entryId: item.id,
        entryDate: item.date,
      });
    }
  };

  const performDelete = async (item) => {
    // Store the entry for potential undo
    setDeletedEntry(item);
    setShowUndo(true);

    // Show feedback
    if (Platform.OS === "android") {
      ToastAndroid.show(
        "Entry deleted. Tap UNDO to restore.",
        ToastAndroid.SHORT,
      );
    }

    // Set timeout for permanent deletion
    undoTimeoutRef.current = setTimeout(async () => {
      if (deletedEntry) {
        await deleteEntry(item.id);
        setDeletedEntry(null);
        setShowUndo(false);

        // Exit edit mode if no entries left
        if (entries.length === 1) {
          setIsEditing(false);
        }
      }
    }, 5000);
  };

  const handleUndo = () => {
    // Clear the timeout
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    // Restore the entry
    if (deletedEntry) {
      restoreEntry(deletedEntry);
    }

    setDeletedEntry(null);
    setShowUndo(false);

    if (Platform.OS === "android") {
      ToastAndroid.show("Entry restored!", ToastAndroid.SHORT);
    }
  };

  const handleUndoTimeout = () => {
    // Permanent deletion happened
    setDeletedEntry(null);
    setShowUndo(false);
  };

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setIsEditing(!isEditing);
  };

  // Format date for header
  const formatHeaderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Delete Entry",
      `Are you sure you want to delete the entry "${item.title}" from ${formatHeaderDate(item.date)}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteEntry(item.id);
          },
        },
      ],
    );
  };

  const renderGridItem = ({ item, index }) => {
    // Get the first photo or null if no photos
    const firstPhoto =
      item.photos && item.photos.length > 0 ? item.photos[0] : null;

    return (
      <Pressable
        style={[
          styles.gridItem,
          {
            width: itemSize,
            height: itemSize,
            marginRight: (index + 1) % numColumns === 0 ? 0 : gap,
            marginBottom: gap,
          },
        ]}
        onPress={() => {
          if (!isEditing) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
            navigation.navigate("EntryDetail", {
              entryId: item.id,
              entryDate: item.date,
            });
          } else {
            handleDelete(item);
          }
        }}
        onLongPress={handleEdit}
      >
        {firstPhoto ? (
          <Image
            source={{ uri: firstPhoto.uri || firstPhoto }}
            style={styles.gridImage}
          />
        ) : (
          <View style={styles.gridPlaceholder}>
            <Text style={styles.gridPlaceholderText}>
              {item.emoji || item.title?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Photo count badge (shows if more than 1 photo) */}
        {item.photos && item.photos.length > 1 && (
          <View style={styles.photoCountBadge}>
            <Text style={styles.photoCountText}>+{item.photos.length - 1}</Text>
          </View>
        )}

        {/* Rating badge (optional) */}
        {item.rating > 0 && (
          <View style={styles.gridRating}>
            <Text style={styles.gridRatingText}>⭐ {item.rating}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Loading your entries...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.accent }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      {/* Animated Edit Mode Banner with Transform */}
      <Animated.View
        style={[
          styles.editModeBanner,
          {
            transform: [{ translateY: bannerTranslateY }],
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          },
        ]}
      >
        <Text style={[styles.editModeText]}>You are in edit mode.</Text>
      </Animated.View>

      <Animated.View
        style={{ transform: [{ translateY: contentTranslateY }], flex: 1 }}
      >
        {/* Simple header with just the title */}
        <View style={[styles.profileHeader]}>
          <View style={[styles.statCont]}>
            <Text style={styles.statNumber}>{entries.length}</Text>
            <Text style={styles.statLabel}>
              {entries.length === 1 ? "entry" : "entries"}
            </Text>
          </View>
          <Pressable style={[styles.editModeBttn]} onPress={handleEdit}>
            <Text style={[styles.editModeBttnText]}>
              {isEditing ? "Done" : "Edit"}
            </Text>
          </Pressable>
        </View>

        {/* Photo Grid */}
        <FlatList
          data={entries}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={[
            styles.gridContainer,
            { paddingHorizontal: 20 },
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No memories yet!</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your first photo
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>

      <View style={[styles.floatingBttnsCont]}>
        {/* Floating Action Button */}
        {!isEditing && (
          <Pressable
            style={styles.addBttn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
              navigation.navigate("AddEntry")
            }}
          >
            <Text style={styles.addBttnText}>＋</Text>
          </Pressable>
        )}
        {!isEditing && (
          <View style={styles.recentlyDeletedBttnCont} >
          </View>
        )}
        <Pressable style={styles.themeBttn} onPress={toggleTheme}>
          <Text style={styles.themeBttnText}>
            {theme.isDarkMode ? "🌞" : "🌝"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
