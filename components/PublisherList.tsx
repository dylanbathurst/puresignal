import { NDKFilter, useSubscribe } from "@nostr-dev-kit/ndk-mobile";
import { router } from "expo-router";
import { FC, useMemo } from "react";
import { ThemedView } from "./ThemedView";
import { Image, Pressable } from "react-native";
import PublisherListLoader from "./loaders/PublisherListLoader";
import { ArticleWithInteraction, Audicles, isAudicle } from "./FeedItem";

const PublisherList: FC<{
  articles?: (Audicles | ArticleWithInteraction)[];
}> = ({ articles }) => {
  const pubkeys = useMemo(
    () =>
      articles
        ?.filter((article) => !isAudicle(article))
        .map((article) => (isAudicle(article) ? null : article.pubkey)),
    [articles]
  );

  const publisherProfileFilter = useMemo(
    () => [
      {
        kinds: [0],
        authors: pubkeys,
      } as NDKFilter,
    ],
    [pubkeys]
  );

  const { events } = useSubscribe(publisherProfileFilter, {}, [pubkeys]);

  const filteredEvents = events.filter(
    (event) => JSON.parse(event.content).image
  );

  return (
    <ThemedView style={{ marginHorizontal: 10, flexDirection: "row", gap: 5 }}>
      {filteredEvents.length === 0 && <PublisherListLoader />}
      {filteredEvents &&
        filteredEvents.map((event) => {
          return (
            <Pressable
              key={event.content}
              onPress={() =>
                router.navigate({
                  pathname: "/publisher/[id]",
                  params: { id: event.pubkey },
                })
              }
            >
              <Image
                style={{
                  width: 30,
                  aspectRatio: 1,
                  borderRadius: 15,
                }}
                src={JSON.parse(event.content).image}
              />
            </Pressable>
          );
        })}
    </ThemedView>
  );
};

export default PublisherList;
