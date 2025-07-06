import { NDKEvent, NDKKind, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image, StyleSheet, useColorScheme, View } from "react-native";
import {
  useEvent,
  useSubscribe,
  useUserProfilesStore,
} from "@nostr-dev-kit/ndk-hooks";
import { useEffect, useMemo, useState } from "react";
import { Event, nip19, nip25 } from "nostr-tools";
import { AtSign, Heart, Repeat } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import DefaultProfilePic from "../DefaultProfilePic";

const { Text, Repost, GenericRepost, Reaction, Zap, Article, GenericReply } =
  NDKKind;

interface InteractionProps {
  event: NDKEvent;
}

function parseNostrEmbeds(content: string): string[] {
  const nostrRegex = /nostr:([a-zA-Z0-9]+)/g;
  const matches = content.matchAll(nostrRegex);
  return Array.from(matches).map((match) => match[1]);
}

function EmbeddedContent({ eventId }: { eventId: string }) {
  const userStore = useUserProfilesStore();
  const [profile, setProfile] = useState<NDKUserProfile>();
  const event = useEvent(eventId);
  const backgroundColor = useThemeColor(
    { light: Colors.light.white004, dark: Colors.light.white004 },
    "icon"
  );
  useEffect(() => {
    if (eventId.startsWith("npub")) {
      const decoded = nip19.decode(eventId);
      if (decoded.type === "npub") {
        const profile = userStore.profiles.get(decoded.data);
        setProfile(profile);
      }
    }
  }, [eventId]);

  if (profile) {
    return <ThemedText>@{profile.name}</ThemedText>;
  }

  return (
    <View style={[styles.embeddedContainer, { backgroundColor }]}>
      <ThemedText
        type="defaultSemiBold"
        style={{ maxWidth: "60%", lineHeight: 18 }}
        numberOfLines={3}
      >
        {event?.tagValue("title")}
      </ThemedText>

      <Image
        style={{
          width: 80,
          aspectRatio: 16 / 9,
          borderRadius: 8,
        }}
        src={event?.tagValue("image")}
      />
    </View>
  );
}

export function Interaction({ event }: InteractionProps) {
  const theme = useColorScheme() ?? "light";
  const nostrEmbeds = useMemo(
    () => parseNostrEmbeds(event.content),
    [event.content]
  );
  const user = useUserProfilesStore();

  const userProfile = user.profiles.get(event.author.pubkey);
  if (!userProfile) {
    user.fetchProfile(event.author.pubkey);
  }

  const renderContent = () => {
    if (nostrEmbeds.length === 0) {
      return null;
      // return <ThemedText>{event.content}</ThemedText>;
    }

    // Split content by nostr: embeds and render each part
    const parts = event.content.split(/(nostr:[a-zA-Z0-9]+)/);
    return (
      <View>
        {parts.map((part, index) => {
          if (part.startsWith("nostr:")) {
            const eventId = part.replace("nostr:", "");
            return (
              <EmbeddedContent key={`${eventId}-${index}`} eventId={eventId} />
            );
          }
          return part ? (
            <ThemedText style={{ opacity: 0.6 }} key={index}>
              {part}
            </ThemedText>
          ) : null;
        })}
      </View>
    );
  };
  switch (event.kind) {
    case Text:
    case Reaction:
      return (
        <ThemedView style={styles.container}>
          <View>
            {event.kind === Text ? (
              <AtSign color={Colors[theme].icon} strokeWidth={1} size={25} />
            ) : (
              <Heart color={Colors[theme].icon} strokeWidth={1} size={25} />
            )}
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.interactionHeader}>
              {user.profiles.get(event.author.pubkey)?.picture ? (
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 200,
                  }}
                  src={user.profiles.get(event.author.pubkey)?.picture}
                />
              ) : (
                <DefaultProfilePic />
              )}
              <ThemedText
                type="defaultSemiBold"
                style={{ flex: 1 }}
                numberOfLines={1}
              >
                {user.profiles.get(event.author.pubkey)?.displayName ||
                  event.author.npub}
              </ThemedText>
            </View>
            {renderContent()}
          </View>
        </ThemedView>
      );

    case Repost:
    case GenericRepost:
      return (
        <ThemedView style={styles.container}>
          <Repeat color={Colors[theme].icon} strokeWidth={1} size={25} />
          {user.profiles.get(event.author.pubkey)?.picture ? (
            <Image
              style={{
                width: 25,
                height: 25,
                borderRadius: 200,
              }}
              src={user.profiles.get(event.author.pubkey)?.picture}
            />
          ) : (
            <DefaultProfilePic />
          )}
          <ThemedText
            type="defaultSemiBold"
            style={{ flex: 1 }}
            numberOfLines={1}
          >
            {user.profiles.get(event.author.pubkey)?.displayName ||
              event.author.npub}
          </ThemedText>
          {renderContent()}
        </ThemedView>
      );

    // case Reaction:
    //   return (
    //     <ThemedView style={styles.container}>
    //       <ThemedText type="subtitle">{event.content}</ThemedText>
    //       <ThemedText numberOfLines={1}>
    //         {user.profiles.get(event.author.pubkey)?.displayName ||
    //           event.author.npub}
    //       </ThemedText>
    //     </ThemedView>
    //   );

    case Zap:
      return (
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Zapped</ThemedText>
          <ThemedText>
            {user.profiles.get(event.author.pubkey)?.displayName ||
              event.author.npub}
          </ThemedText>
          {renderContent()}
        </ThemedView>
      );

    case Article:
      return (
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Article</ThemedText>
          <ThemedText>
            {user.profiles.get(event.author.pubkey)?.displayName ||
              event.author.npub}
          </ThemedText>
          {renderContent()}
        </ThemedView>
      );

    case GenericReply:
      return (
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Reply</ThemedText>
          <ThemedText>
            {user.profiles.get(event.author.pubkey)?.displayName ||
              event.author.npub}
          </ThemedText>
          {renderContent()}
        </ThemedView>
      );

    default:
      return (
        <ThemedView style={styles.container}>
          <ThemedText>Unknown event type: {event.kind}</ThemedText>
          <ThemedText>
            {user.profiles.get(event.author.pubkey)?.displayName ||
              event.author.npub}
          </ThemedText>
        </ThemedView>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
    alignItems: "flex-start",
  },
  interactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  embeddedContainer: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 15,
  },
});
