import * as WebBrowser from "expo-web-browser";
import {
  NDKEvent,
  useNDK,
  useNDKCurrentUser,
  useNDKSessionSigners,
  useProfileValue,
} from "@nostr-dev-kit/ndk-hooks";
import { DateTime } from "luxon";
import { router } from "expo-router";
import { Share as ShareScreen, Text } from "react-native";
import {
  Pressable,
  View,
  Image,
  StyleSheet,
  ListRenderItem,
  FlatList,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import React, { useCallback } from "react";
import {
  Heart,
  MessageSquareQuote,
  Repeat2,
  Share,
  Zap,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useReactionsStore } from "@/stores/reactions";
import PressableOpacity from "./PressableOpacity";

export interface ArticleWithInteraction extends NDKEvent {
  interactions?: {
    reposts: number;
    quotes: number;
    reactions: number;
  };
}

export type Audicles = {
  id: "audicles";
  items: ArticleWithInteraction[];
};

export function isAudicle(
  item: ArticleWithInteraction | Audicles
): item is Audicles {
  return item.id === "audicles";
}

interface FeedItemProps {
  item: ArticleWithInteraction;
  index: number;
}

const FeedItem: React.FC<FeedItemProps> = ({ item, index }) => {
  const { ndk } = useNDK();
  const currentUser = useNDKCurrentUser();
  const signers = useNDKSessionSigners();
  const userProfile = useProfileValue(item.author.pubkey);
  const { addEvents, reactions } = useReactionsStore();

  const articleStats = reactions.get(item.id);
  const signer = signers.get(currentUser?.pubkey ?? "");
  const everyFifth = index % 5 === 0;
  const image = item.tagValue("image");
  const title = item.tagValue("title");
  const link = item.tagValue("d");
  const summary = item.tagValue("summary");
  const publishedAt = item.tagValue("published_at");
  const pubDate =
    publishedAt?.length === 13
      ? DateTime.fromSeconds(parseInt(publishedAt) / 1000) // I was publishing published_at wrong before
      : DateTime.fromSeconds(parseInt(publishedAt || ""));
  const now = DateTime.local();
  const { hours, days, minutes } = now
    .diff(pubDate, ["days", "hours", "minutes"])
    .toObject();
  const timeAgo =
    days === 0
      ? hours === 0
        ? `${Math.floor(minutes!)}m`
        : `${Math.floor(hours!)}h`
      : `${days}d`;

  const _handlePressButtonAsync = async () => {
    if (!link) return;
    await WebBrowser.openBrowserAsync(link);
  };

  const handleReact = useCallback(async () => {
    if (!currentUser || !ndk) {
      return router.navigate("/login");
    }
    try {
      const reaction = await item.react("+", false);
      reaction.tags.push(["k", item.kind.toString()]);
      reaction.tags.push(["client", "Pure Signal"]);
      await reaction.sign(signer);
      addEvents([reaction], currentUser.pubkey);
      reaction.publish();
    } catch (error) {
      console.error(error);
    }
  }, [currentUser, item]);

  const handleRepost = useCallback(async () => {
    if (!currentUser || !ndk) {
      return router.navigate("/login");
    }
    try {
      const content = JSON.stringify(item.rawEvent());
      const repost = await item.repost(false, ndk.signer);
      repost.content = content;
      repost.tags.push(["e", item.id]);
      repost.tags.push(["p", item.pubkey]);
      repost.tags.push(["k", item.kind.toString()]);
      repost.tags.push(["client", "Pure Signal"]);
      await repost.sign(signer);
      addEvents([repost], currentUser.pubkey);
      repost.publish();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleQuote = useCallback(() => {
    if (!currentUser || !ndk) {
      return router.navigate("/login");
    }
    router.navigate({
      pathname: "/quote",
      params: {
        title,
        publisherImage: userProfile?.picture,
        publisherName: userProfile?.name,
        publisherPubkey: item.author.pubkey,
        identifier: item.id,
        dTag: link,
        image,
        timeAgo,
      },
    });
  }, [timeAgo, link, userProfile, title, currentUser, ndk, item]);

  const handleShare = async () => {
    if (!link) return;
    await ShareScreen.share({
      url: link,
    });
  };

  return (
    <ThemedView>
      <Pressable
        onPress={() =>
          router.navigate({
            pathname: "/publisher/[id]",
            params: { id: item.author.pubkey },
          })
        }
      >
        <View
          style={{
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
              }}
            >
              <Image
                style={{
                  width: 28,
                  aspectRatio: 1,
                  borderRadius: 15,
                }}
                src={userProfile?.picture}
              />
            </View>
            <ThemedText
              numberOfLines={1}
              type="subtitle"
              style={{ maxWidth: 200, fontSize: 15 }}
            >
              {(userProfile?.displayName || userProfile?.name)?.replace(
                " (News Bot)",
                ""
              )}
            </ThemedText>
          </View>
          <ThemedText
            type="subtitle"
            style={{
              fontSize: 15,
              opacity: 0.5,
              alignSelf: "flex-end",
            }}
          >
            {timeAgo}
          </ThemedText>
        </View>
      </Pressable>
      <Pressable key={item.id} onPress={_handlePressButtonAsync}>
        <ThemedView style={styles.stepContainer}>
          {everyFifth && (
            <View style={{ paddingTop: 10 }}>
              <Image
                style={{
                  width: "auto",
                  aspectRatio: 16 / 9,
                  borderRadius: 15,
                }}
                src={image}
              />
            </View>
          )}
          <ThemedView
            style={[
              {
                gap: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
              },
              everyFifth && {
                flexDirection: "column",
                gap: 0,
                alignItems: "flex-start",
              },
            ]}
          >
            <ThemedText type="subtitle" numberOfLines={2} style={{ flex: 1 }}>
              {title}
            </ThemedText>
            {everyFifth && (
              <ThemedText type="default" numberOfLines={4}>
                {summary}
              </ThemedText>
            )}
            {!everyFifth && (
              <Image
                style={{
                  width: 100,
                  aspectRatio: 16 / 9,
                  borderRadius: 15,
                }}
                src={image}
              />
            )}
          </ThemedView>
        </ThemedView>
      </Pressable>
      {item.interactions && (
        <View style={styles.itemFooter}>
          <View style={styles.interactionContainer}>
            <PressableOpacity
              onPress={handleRepost}
              style={styles.interactionPressable}
              disabled={articleStats?.repostedByUser}
            >
              <Repeat2
                size={16}
                color={
                  articleStats?.repostedByUser ? "#ff4000" : Colors.light.icon
                }
              />
              <ThemedText
                type="defaultSemiBold"
                lightColor={Colors.light.text}
                darkColor={Colors.dark.text}
              >
                {articleStats?.repostsCount ? articleStats.repostsCount : ""}
              </ThemedText>
            </PressableOpacity>
          </View>
          <View style={styles.interactionContainer}>
            <PressableOpacity
              onPress={handleQuote}
              style={[styles.interactionPressable, { alignItems: "center" }]}
            >
              <MessageSquareQuote size={16} color={Colors.light.icon} />
              <ThemedText
                type="defaultSemiBold"
                lightColor={Colors.light.text}
                darkColor={Colors.dark.text}
              >
                {item.interactions.quotes > 0 ? item.interactions.quotes : ""}
              </ThemedText>
            </PressableOpacity>
          </View>
          {/* <View style={styles.interactionContainer}>
          <PressableOpacity
            onPress={}
            style={[styles.interactionPressable]}
          >
            <Zap size={16} color={Colors.light.icon} />
            <ThemedText>2500</ThemedText>
          </PressableOpacity>
        </View> */}
          <View style={styles.interactionContainer}>
            <PressableOpacity
              onPress={handleReact}
              style={[styles.interactionPressable]}
            >
              <Heart size={16} color={Colors.light.icon} />
              <ThemedText
                type="defaultSemiBold"
                lightColor={Colors.light.text}
                darkColor={Colors.dark.text}
              >
                {articleStats?.likesCount ? articleStats.likesCount : ""}
              </ThemedText>
            </PressableOpacity>
          </View>
          <View style={{ position: "absolute", right: 10 }}>
            <PressableOpacity
              onPress={handleShare}
              style={[styles.interactionPressable]}
            >
              <Share size={16} color={Colors.light.icon} />
            </PressableOpacity>
          </View>
        </View>
      )}
    </ThemedView>
  );
};

const AudicleList: React.FC<{ item: Audicles }> = ({ item }) => {
  return (
    <FlatList
      data={item.items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        return (
          <View>
            <Image
              style={{
                width: 28,
                aspectRatio: 1,
                borderRadius: 15,
              }}
              src={item.dTag}
            />
          </View>
        );
      }}
    />
  );
};

export const renderFeedItem: ListRenderItem<
  ArticleWithInteraction | Audicles
> = ({ item, index }) => {
  if (isAudicle(item)) {
    return <AudicleList item={item} />;
  } else {
    return <FeedItem item={item} index={index} />;
  }
};

export default FeedItem;

const styles = StyleSheet.create({
  stepContainer: {
    marginHorizontal: 10,
  },
  liked: {},
  itemFooter: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  interactionContainer: {
    width: "33%",
  },
  interactionPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
