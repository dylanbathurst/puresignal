import { ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSubscribe } from "@nostr-dev-kit/ndk-hooks";
import { NDKEvent, NDKFilter, NDKKind } from "@nostr-dev-kit/ndk";
import { ThemedView } from "@/components/ThemedView";
import { Interaction } from "@/components/Interactions";

const { Text, Repost, GenericRepost, Reaction, Zap, Article, GenericReply } =
  NDKKind;

export default function ActivityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Subscribe to all interactions (reactions, reposts, mentions) for this pubkey
  const { events: interactions } = useSubscribe([
    {
      kinds: [
        Text,
        Repost,
        GenericRepost,
        Reaction,
        Zap,
        Article,
        GenericReply,
      ],
      "#p": [id], // Filter for events that mention this pubkey
      limit: 50,
    } as NDKFilter,
  ]);

  return (
    <ThemedView>
      <ScrollView contentContainerStyle={styles.container}>
        {interactions?.map((event: NDKEvent) => (
          <Interaction key={event.id} event={event} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    paddingHorizontal: 12,
  },
});
