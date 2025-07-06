import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { NDKFilter, NDKKind, useSubscribe } from "@nostr-dev-kit/ndk-mobile";
import { renderFeedItem } from "@/components/FeedItem";
import Profile from "@/components/Profile";
import FeedItemSeperator from "@/components/FeedItemSeperator";
import { ThemedView } from "@/components/ThemedView";
import FeedLoader from "@/components/loaders/FeedLoader";

interface PublisherProps {
  // Add props as needed
}

interface QueryParams extends Record<string, string> {
  id: string;
}
const Publisher: React.FC<PublisherProps> = () => {
  const { id } = useLocalSearchParams<QueryParams>();

  const articlesListFilter = useMemo(
    () => [
      {
        authors: [id],
        kinds: [NDKKind.Article],
        limit: 100,
      } as NDKFilter,
    ],
    [id]
  );

  const { events: articles } = useSubscribe(articlesListFilter);

  articles.sort((a, b) => {
    const pubA = a.tagValue("published_at");
    const pubB = b.tagValue("published_at");

    const normalizedPubA =
      pubA?.length === 13 ? parseInt(pubA) / 1000 : parseInt(pubA || "");

    const normalizedPubB =
      pubB?.length === 13 ? parseInt(pubB) / 1000 : parseInt(pubB || "");

    return normalizedPubB - normalizedPubA;
  });

  return (
    <ThemedView>
      <FlatList
        style={{
          paddingTop: 18,
        }}
        data={articles}
        ItemSeparatorComponent={FeedItemSeperator}
        keyExtractor={(item) => item.id}
        renderItem={renderFeedItem}
        ListEmptyComponent={<FeedLoader />}
      />
    </ThemedView>
  );
};

export default Publisher;
