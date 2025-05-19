import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import NDK, {
  NDKEvent,
  NDKFilter,
  NDKKind,
  useNDKSessionLogout,
  useSubscribe,
  useCurrentUserProfile,
  useNDKCurrentPubkey,
  useProfileValue,
} from "@nostr-dev-kit/ndk-hooks";
import {
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { ChevronRight, Copy, CopyCheck, LogOut } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import FeedItemSeperator from "@/components/FeedItemSeperator";
import LikeActivity from "@/components/profile/LikeActivity";
import RepostActivity from "@/components/profile/RepostActivity";

const Profile = () => {
  const theme = useColorScheme() ?? "light";
  const logout = useNDKSessionLogout();
  const currentUserProfile = useCurrentUserProfile();
  const pubkey = useNDKCurrentPubkey();
  const [copied, setCopied] = useState(false);

  const profile = useProfileValue(pubkey, {
    refresh: true,
  });

  const handleLogout = () => {
    router.navigate("/(tabs)");
    logout();
  };

  const parseTextWithLinks = (text: string) => {
    // Regex for matching URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <ThemedText
            key={index}
            style={styles.bioLink}
            onPress={() => Linking.openURL(part)}
          >
            {part}
          </ThemedText>
        );
      }
      return (
        <ThemedText key={index} style={{ fontSize: 12, lineHeight: 16 }}>
          {part}
        </ThemedText>
      );
    });
  };

  const copyToClipboard = useCallback(async () => {
    if (!currentUserProfile || !pubkey) return;
    await Clipboard.setStringAsync(pubkey);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [currentUserProfile, pubkey]);

  const interactionsFilter = useMemo(
    () => [
      {
        kinds: [NDKKind.GenericRepost, NDKKind.Reaction],
        authors: [pubkey],
        "#k": ["30023"],
        limit: 100,
      } as NDKFilter,
    ],
    [pubkey]
  );

  const { events: interactions } = useSubscribe(interactionsFilter);

  const ids = interactions
    .filter((i) => i.getMatchingTags("e").length)
    .map((i) => i.getMatchingTags("e")[0][1]);

  const reactedArticleEvents = useMemo(
    () => [
      {
        ids,
        limit: 100,
      } as NDKFilter,
    ],
    [ids]
  );

  const { events: reactedArticles } = useSubscribe(reactedArticleEvents);

  const mappedArticles: Record<string, NDKEvent> = {};
  reactedArticles.forEach((a) => {
    mappedArticles[a.id] = a;
  });

  if (!profile)
    return (
      <SafeAreaView style={styles.flexFill}>
        <ThemedText>Loading Profile...</ThemedText>
      </SafeAreaView>
    );

  return (
    <ThemedView style={[styles.flexFill]}>
      <ScrollView>
        <SafeAreaView style={styles.flexFill}>
          <View style={[styles.flexFill, styles.container]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Image
                width={100}
                height={100}
                borderRadius={50}
                source={{ uri: profile.picture }}
              />
              <View>
                <ThemedText type="title">{profile.displayName}</ThemedText>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <ThemedText type="subtitle">@{profile.name}</ThemedText>
                  <Pressable onPress={copyToClipboard}>
                    {copied ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <CopyCheck size={15} color={Colors[theme].link} />
                        <ThemedText
                          style={{ fontSize: 10, color: Colors[theme].link }}
                        >
                          Copied
                        </ThemedText>
                      </View>
                    ) : (
                      <Copy size={15} color={Colors[theme].tint} />
                    )}
                  </Pressable>
                </View>
              </View>
            </View>

            <View>
              {profile.about ? (
                parseTextWithLinks(profile.about)
              ) : (
                <ThemedText>No bio provided</ThemedText>
              )}
            </View>
          </View>

          <FeedItemSeperator />

          <View style={{ gap: 15, paddingHorizontal: 10 }}>
            <ThemedText type="subtitle">Activity</ThemedText>
            {reactedArticles.length > 0 ? (
              reactedArticles.map((interaction) => {
                console.log(interaction.getMatchingTags("e"));
                if (!interaction.getMatchingTags("e").length) return;
                const article =
                  mappedArticles[interaction.getMatchingTags("e")[0][1]];
                if (!article) return null;
                const title = article.tags.find((t) => t[0] === "title");
                const d = article.tags.find((t) => t[0] === "d");

                console.log("getting herereer", title, d);
                if (!title || !d) return null;

                switch (interaction.kind) {
                  case NDKKind.GenericRepost:
                    return (
                      <RepostActivity
                        title={title[1]}
                        link={d[1]}
                        key={interaction.id}
                      />
                    );
                  case NDKKind.Reaction:
                    return (
                      <LikeActivity
                        title={title[1]}
                        link={d[1]}
                        key={interaction.id}
                      />
                    );
                  default:
                    return null;
                }
              })
            ) : (
              <ThemedText>No activity yet</ThemedText>
            )}
          </View>

          <FeedItemSeperator />

          <View style={styles.optionsContainer}>
            <Pressable onPress={handleLogout}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 12,
                  alignItems: "center",
                  backgroundColor: Colors[theme].input,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "red",
                      borderRadius: 6,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 25,
                      aspectRatio: 1,
                    }}
                  >
                    <LogOut size={15} strokeWidth={3} color={"white"} />
                  </View>
                  <ThemedText type="defaultSemiBold">Logout</ThemedText>
                </View>
                <ChevronRight size={15} color={Colors[theme].tint} />
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  flexFill: { flex: 1 },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    aspectRatio: 1,
    borderRadius: 50,
    opacity: 0.25,
  },
  bioLink: { fontSize: 12, lineHeight: 16, color: Colors.dark.link },
  optionsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  container: {
    justifyContent: "space-between",
    gap: 20,
    paddingTop: 30,
    paddingHorizontal: 10,
  },
});
