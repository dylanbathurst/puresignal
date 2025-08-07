import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEvent } from "@nostr-dev-kit/ndk-hooks";
import { WebView } from "react-native-webview";
import { MarkdownIt } from "react-native-markdown-display";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { DateTime } from "luxon";
import FeedLoader from "@/components/loaders/FeedLoader";

const injectedJavaScript = `
  function sendHeight() {
    // Get the body element's actual content height
    const body = document.body;
    const html = document.documentElement;
    
    // Calculate the actual content height
    const bodyHeight = body.scrollHeight;
    const htmlHeight = html.scrollHeight;
    
    // Use the smaller of the two to avoid excessive height
    const height = Math.min(bodyHeight, htmlHeight);
    
    // Add a small buffer for padding/margins
    const finalHeight = height + 20;
    
    console.log('Body height:', bodyHeight);
    console.log('HTML height:', htmlHeight);
    console.log('Final height:', finalHeight);
    
    window.ReactNativeWebView.postMessage(finalHeight);
  }
  
  // Only send height once when the page loads
  window.addEventListener('load', sendHeight);
  
  // Send height after a short delay to ensure content is rendered
  setTimeout(sendHeight, 100);
  
  true;
`;

export default function ArticleScreen() {
  const [webViewHeight, setWebViewHeight] = useState(1000);
  const theme = useColorScheme() ?? "light";
  // Expecting the event id from the route params
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = useEvent(id);

  if (event === undefined) {
    // Still loading
    return (
      <ThemedView style={styles.centered}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: "100%" }}
          contentContainerStyle={[styles.container]}
        >
          <FeedLoader />
        </ScrollView>
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

  const markdownItInstance = MarkdownIt({ typographer: true });

  const body = markdownItInstance.render(event.content);
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box;
          }
          html, body { 
            height: auto;
            min-height: 0;
            overflow: hidden;
          }
          body { 
            background-color: transparent; 
            padding: 20px 0; 
            font-family: 'Helvetica', sans-serif; 
            font-size: 16px; 
            width: ${Dimensions.get("screen").width - 40}px; 
            color: ${Colors[theme].text};
            line-height: 1.6;
          }
          a { color: ${Colors[theme].text} }
          h1 { margin-bottom: 16px; }
          h2 { margin-bottom: 14px; }
          h3 { margin-bottom: 12px; }
          p { line-height: 1.6; margin-bottom: 16px; }
          img { 
            width: 100%; 
            height: auto;
            margin: 16px 0;
          }
          blockquote {
            border-left: 4px solid ${Colors.pallete.link};
            padding-left: 16px;
            margin: 16px 0;
            font-style: italic;
          }
          code {
            background-color: ${Colors[theme].text70};
            padding: 2px 4px;
            border-radius: 4px;
            font-family: 'Menlo', monospace;
          }
          pre {
            background-color: ${Colors[theme].text70};
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 16px 0;
          }
        </style>
      </head>
      <body>${body}</body>
    </html>
  `;

  const title = event.tagValue("title");
  const heroImage = event.tagValue("image");
  const summary = event.tagValue("summary");
  const publishedAt = event.tagValue("published_at");
  const tags = event.getMatchingTags("t");
  const dt = DateTime.fromSeconds(parseInt(publishedAt!));

  return (
    <ThemedView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ height: "100%" }}
        contentContainerStyle={[styles.container]}
      >
        <ThemedText
          style={{ color: Colors[theme].text30, paddingBottom: 12 }}
          type="defaultSemiBold"
          copyable
        >
          {dt.toLocaleString(DateTime.DATE_MED)}
        </ThemedText>
        <ThemedText copyable style={{ paddingBottom: 25 }} type="title">
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
          <ThemedText
            copyable
            ellipsizeMode="tail"
            style={styles.summaryText}
            numberOfLines={4}
          >
            {summary}
          </ThemedText>
        </View>
        <WebView
          webviewDebuggingEnabled
          originWhitelist={["*"]}
          allowsLinkPreview
          scrollEnabled={false}
          injectedJavaScript={injectedJavaScript}
          onMessage={(event) => {
            const height = Number(event.nativeEvent.data);
            if (!isNaN(height)) setWebViewHeight(height);
          }}
          style={{
            width: "100%",
            height: webViewHeight,
            backgroundColor: "transparent",
          }}
          source={{ html }}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
        >
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
        </ScrollView>
      </ScrollView>
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
