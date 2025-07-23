import React from "react";
import * as WebBrowser from "expo-web-browser";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  useColorScheme,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEvent } from "@nostr-dev-kit/ndk-hooks";
import Markdown from "react-native-markdown-display";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { DateTime } from "luxon";
import FeedLoader from "@/components/loaders/FeedLoader";

export default function ArticleScreen() {
  const theme = useColorScheme() ?? "light";
  // Expecting the event id from the route params
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = useEvent(id);

  const onLinkPress = (url: string) => {
    WebBrowser.openBrowserAsync(url);
    return false;
  };

  const mdStyles = {
    body: {
      color: Colors[theme].text,
      fontSize: 17,
      lineHeight: 28,
      paddingVertical: 20,
      fontFamily: "System",
    },
    heading1: {
      fontSize: 28,
      fontWeight: "bold",
      marginTop: 24,
      marginBottom: 12,
    },
    heading2: {
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 10,
    },
    heading3: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
    },
    paragraph: {
      marginBottom: 16,
    },
    link: {
      color: Colors.pallete.link,
    },
    list_item: {
      marginBottom: 10,
    },
    bullet_list: {
      marginBottom: 16,
    },
    ordered_list: {
      marginBottom: 16,
    },
    blockquote: {
      backgroundColor: Colors[theme].text004,
      borderLeftWidth: 4,
      borderLeftColor: Colors.pallete.link,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginVertical: 12,
    },
    code_inline: {
      backgroundColor: Colors[theme].text70,
      color: Colors.pallete.code,
      fontFamily: "Menlo",
      fontSize: 15,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    code_block: {
      backgroundColor: Colors[theme].text70,
      color: Colors.pallete.code,
      fontFamily: "Menlo",
      fontSize: 15,
      borderRadius: 6,
      padding: 12,
      marginVertical: 12,
    },
    hr: {
      backgroundColor: Colors[theme].text20,
      height: 1,
    },
    image: {
      borderRadius: 8,
    },
  };

  if (event === undefined) {
    // Still loading
    return (
      <ThemedView style={styles.centered}>
        <FeedLoader />
      </ThemedView>
    );
  }

  if (event === null) {
    // Not found
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="title">Article not found</ThemedText>
      </ThemedView>
    );
  }

  const title = event.tagValue("title");
  const heroImage = event.tagValue("image");
  const summary = event.tagValue("summary");
  const publishedAt = event.tagValue("published_at");
  const tags = event.getMatchingTags("t");
  const dt = DateTime.fromSeconds(parseInt(publishedAt!));

  return (
    <ThemedView>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: "100%" }}
          contentContainerStyle={[styles.container]}
        >
          <ThemedText
            style={{ color: Colors[theme].text30, paddingBottom: 12 }}
            type="defaultSemiBold"
          >
            {dt.toLocaleString(DateTime.DATE_MED)}
          </ThemedText>
          <ThemedText style={{ paddingBottom: 25 }} type="title">
            {title}
          </ThemedText>
          <Image
            style={{
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 20,
            }}
            src={heroImage}
          />
          <View
            style={[
              styles.summary,
              {
                borderLeftColor: Colors[theme].text20,
                backgroundColor: Colors[theme].text004,
              },
            ]}
          >
            <ThemedText style={styles.summaryText}>{summary}</ThemedText>
          </View>
          <Markdown style={mdStyles} onLinkPress={onLinkPress}>
            {event.content}
          </Markdown>
          <View style={styles.tagsContainer}>
            {tags.length > 0 &&
              tags.map((tag) => {
                return (
                  <View
                    style={[
                      styles.tag,
                      { backgroundColor: Colors[theme].text10 },
                    ]}
                  >
                    <ThemedText style={styles.tagText}>{tag[1]}</ThemedText>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {},
  container: {
    padding: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  summary: {
    borderLeftWidth: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 25,
  },
  summaryText: {
    fontSize: 16,
  },
});
