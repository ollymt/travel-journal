import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { getStyles } from "../../styles/MainStyle";
import { useTravel } from "../../contexts/TravelContext";

const { width } = Dimensions.get("window");
const numColumns = 3;
const gap = 2;
const itemSize = (width - gap * (numColumns - 1) - 40) / numColumns; // 40 for horizontal padding

export default function EntriesPage({ navigation }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { entries, loading, error } = useTravel();

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
        onPress={() => navigation.navigate("EntryDetail", { entryId: item.id })}
      >
        {firstPhoto ? (
          <Image
            source={{ uri: firstPhoto.uri || firstPhoto }}
            style={styles.gridImage}
          />
        ) : (
          <View style={styles.gridPlaceholder}>
            <Text style={styles.gridPlaceholderText}>
              {item.title?.charAt(0).toUpperCase() || "📝"}
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
        <Text style={{ color: theme.text }}>Loading your memories...</Text>
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
      {/* Simple header with just the title */}
      <View style={styles.profileHeader}>
        <Text style={styles.statNumber}>
          {entries.length}
        </Text>
        <Text style={styles.statLabel}>
          {entries.length === 1 ? "entry" : "entries"}
        </Text>
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

      {/* Floating Action Button */}
      <Pressable
        style={styles.floatingBttn}
        onPress={() => navigation.navigate("AddEntry")}
      >
        <Text style={styles.floatingBttnText}>+</Text>
      </Pressable>
    </View>
  );
}
