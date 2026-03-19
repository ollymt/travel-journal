import { View, Text, Image, Pressable, FlatList, Dimensions } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { getStyles } from "../../styles/MainStyle"
import { useTravel } from "../../contexts/TravelContext"

const { width } = Dimensions.get("window");
const numColumns = 3;
const gap = 2;
const itemSize = (width - (gap * (numColumns - 1)) - 40) / numColumns;

export default function EntriesPage({ navigation }) {
    const { theme } = useTheme()
    const styles = getStyles(theme);

    const { entries, loading, error, deleteEntry } = useTravel();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const renderGridItem = ({ item, index }) => {
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
          onPress={() =>
            navigation.navigate("EntryDetail", { entryId: item.id })
          }
        >
          {item.photos && item.photos[0] ? (
            <Image source={{ uri: item.photos[0] }} style={styles.gridImage} />
          ) : (
            <View style={styles.gridPlaceholder}>
              <Text style={styles.gridPlaceholderText}>
                {item.title?.charAt(0).toUpperCase() || "📝"}
              </Text>
            </View>
          )}
        </Pressable>;
    }

    return (
        <View style={{ backgroundColor: theme.background, flex: 1, paddingHorizontal: 20 }}>
            <Pressable style={[styles.floatingBttn]}>
                <Text style={[styles.floatingBttnText]}>New Entry</Text>
            </Pressable>
        </View>
    )
}