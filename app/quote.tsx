import PressableOpacity from "@/components/PressableOpacity";
import TabBarButton from "@/components/TabBarButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  NDKEvent,
  NDKKind,
  useCurrentUserProfile,
  useNDK,
} from "@nostr-dev-kit/ndk-hooks";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { nip19 } from "nostr-tools";
import { Image, StyleSheet, TextInput, View } from "react-native";
import { explicitRelayUrls } from "@/lib/ndk";

export default function Quote() {
  const [quoteText, setQuoteText] = useState<string>();
  const borderBottomColor = useThemeColor(
    { light: Colors.light.white004, dark: Colors.light.white004 },
    "icon"
  );
  const backgroundColor = borderBottomColor;
  const text = useThemeColor(
    { light: Colors.light.white80, dark: Colors.dark.text },
    "text"
  );

  const profile = useCurrentUserProfile();
  const { ndk } = useNDK();
  const {
    image,
    title,
    dTag,
    identifier,
    publisherName,
    publisherImage,
    publisherPubkey,
    timeAgo,
  } = useLocalSearchParams<{
    image: string;
    title: string;
    dTag: string;
    identifier: string;
    publisherName: string;
    publisherImage: string;
    publisherPubkey: string;
    timeAgo: string;
  }>();

  const handlePost = useCallback(async () => {
    if (!ndk || !publisherPubkey) return;
    const naddr = nip19.naddrEncode({
      identifier,
      kind: NDKKind.Article,
      pubkey: publisherPubkey,
    });
    const event = new NDKEvent(ndk);
    event.kind = NDKKind.Text;
    event.content = `${quoteText}\n${naddr}`;
    event.tags.push(["client", "Pure Signal"]);
    event.tags.push(["e", identifier]);
    event.tags.push([
      "a",
      `${NDKKind.Article}:${publisherPubkey}:${dTag}`,
      "",
      "mention",
    ]);
    event.tags.push(["p", publisherPubkey, "", "mention"]);
    explicitRelayUrls.forEach((url) => {
      event.tags.push(["r", url]);
    });

    await event.publish();
    console.log("published quote reply");
    router.back();
  }, [ndk, quoteText]);

  const handleCancel = () => {
    router.back();
  };

  return (
    <ThemedView>
      <View style={[{ borderBottomColor }, styles.header]}>
        <PressableOpacity
          onPress={handleCancel}
          style={[styles.baseButton, { backgroundColor }]}
        >
          <ThemedText>Cancel</ThemedText>
        </PressableOpacity>
        <PressableOpacity
          onPress={handlePost}
          style={[styles.baseButton, styles.postButton]}
        >
          <ThemedText>Post</ThemedText>
        </PressableOpacity>
      </View>
      <View style={styles.reply}>
        <Image
          style={{
            width: 48,
            aspectRatio: 1,
            borderRadius: 200,
          }}
          src={profile?.picture}
        />
        <TextInput
          style={[{ color: text }, styles.input]}
          multiline
          placeholder="Type your quote here..."
          autoFocus
          value={quoteText}
          onChangeText={(value) => setQuoteText(value)}
        />
      </View>

      <View style={[{ backgroundColor }, styles.quoteContainer]}>
        <View style={styles.quoteHeader}>
          <Image
            style={{
              width: 18,
              aspectRatio: 1,
              borderRadius: 15,
            }}
            src={publisherImage}
          />
          <ThemedText type="defaultSemiBold">{publisherName}</ThemedText>
          <View
            style={{
              height: 10,
              width: 0.5,
              backgroundColor: Colors.light.white30,
            }}
          />
          <ThemedText
            lightColor={Colors.light.white30}
            darkColor={Colors.light.white30}
          >
            {timeAgo}
          </ThemedText>
        </View>
        <View style={styles.articleContent}>
          <ThemedText
            type="defaultSemiBold"
            style={{ maxWidth: "60%", lineHeight: 18 }}
            numberOfLines={3}
          >
            {title}
          </ThemedText>

          <Image
            style={{
              width: 80,
              aspectRatio: 16 / 9,
              borderRadius: 15,
            }}
            src={image}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  articleContent: {
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 15,
  },
  quoteHeader: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  quoteContainer: {
    marginTop: 26,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  reply: {
    flexDirection: "row",
    gap: 15,
  },
  input: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    marginBottom: 16,
  },
  baseButton: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14 },
  postButton: { backgroundColor: "#147017" },
});
