import { useUserProfilesStore } from "@nostr-dev-kit/ndk-mobile";
import { router } from "expo-router";
import { FC, useMemo } from "react";
import { ThemedView } from "./ThemedView";
import { Image, Pressable } from "react-native";
import PublisherListLoader from "./loaders/PublisherListLoader";
import { ArticleWithInteraction } from "./FeedItem";

const PublisherList: FC<{
  articles?: ArticleWithInteraction[];
}> = ({ articles }) => {
  const pubkeys = useMemo(() => {
    const allPubkeys = articles?.length
      ? articles.map((article) => article.pubkey)
      : [];
    return new Set(allPubkeys);
  }, [articles]);

  return (
    <ThemedView style={{ marginHorizontal: 10, flexDirection: "row", gap: 5 }}>
      {pubkeys.size === 0 ? (
        <PublisherListLoader />
      ) : (
        <PublisherListContent pubkeys={pubkeys} />
      )}
    </ThemedView>
  );
};

function PublisherListContent({ pubkeys }: { pubkeys: Set<string> }) {
  const { profiles } = useUserProfilesStore();
  return [...pubkeys].map((pubkey) => {
    const profile = profiles.get(pubkey);
    return (
      <Pressable
        key={pubkey}
        onPress={() =>
          router.navigate({
            pathname: "/publisher/[id]",
            params: { id: pubkey },
          })
        }
      >
        <Image
          style={{
            width: 30,
            aspectRatio: 1,
            borderRadius: 15,
          }}
          src={profile?.picture}
        />
      </Pressable>
    );
  });
}
export default PublisherList;
