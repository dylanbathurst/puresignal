import { ThemedView } from "./ThemedView";
import { FlatList } from "react-native";
import { ArticleWithInteraction, Audicles, renderFeedItem } from "./FeedItem";
import FeedItemSeperator from "./FeedItemSeperator";
import PublisherList from "./PublisherList";
import FeedLoader from "./loaders/FeedLoader";

type FeedProps = {
  articles: ArticleWithInteraction[];
};
const Feed = ({ articles }: FeedProps) => {
  return (
    <ThemedView style={{ gap: 30, paddingTop: 10 }}>
      <PublisherList articles={articles} />
      <FlatList
        ItemSeparatorComponent={FeedItemSeperator}
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderFeedItem}
        ListEmptyComponent={<FeedLoader />}
      />
    </ThemedView>
  );
};

export default Feed;
