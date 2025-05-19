import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  NDKEvent,
  NDKFilter,
  useSubscribe,
  useUserProfile,
} from "@nostr-dev-kit/ndk-mobile";
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
        kinds: [30023],
        limit: 100,
      } as NDKFilter,
    ],
    [id]
  );

  const { events: articles } = useSubscribe(articlesListFilter);

  return (
    <ThemedView>
      <FlatList
        ListHeaderComponent={() => <Profile id={id} />}
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
