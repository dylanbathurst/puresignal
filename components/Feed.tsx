import { ThemedView } from "./ThemedView";
import { FlatList, StyleSheet, useColorScheme, View } from "react-native";
import { ArticleWithInteraction, Audicles, renderFeedItem } from "./FeedItem";
import FeedItemSeperator from "./FeedItemSeperator";
import PublisherList from "./PublisherList";
import FeedLoader from "./loaders/FeedLoader";
import { ThemedText } from "./ThemedText";
import AudicleFeed from "./AudicleFeed";
import { BookType } from "lucide-react-native";
import { Colors } from "@/constants/Colors";

type FeedProps = {
  articles: ArticleWithInteraction[];
};
const Feed = ({ articles }: FeedProps) => {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView style={{ gap: 30, paddingTop: 10 }}>
      <FlatList
        ItemSeparatorComponent={FeedItemSeperator}
        ListHeaderComponent={
          <View>
            <PublisherList articles={articles} />
            <AudicleFeed />
            <View style={styles.sectionContainer}>
              <BookType size={20} color={Colors[theme].text} />
              <ThemedText style={styles.sectionTitle}>Reads</ThemedText>
            </View>
          </View>
        }
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderFeedItem}
        ListEmptyComponent={<FeedLoader />}
      />
    </ThemedView>
  );
};

export default Feed;

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 4,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
