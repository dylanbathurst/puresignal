import { useProfileValue } from "@nostr-dev-kit/ndk-hooks";
import { FC, useCallback, useMemo } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import PressableOpacity from "./PressableOpacity";
import { Pause, Triangle as Play } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useVideoPlayer, VideoMetadata } from "expo-video";
import { useEvent } from "expo";

export interface Audicle {
  pubkey: string;
  title: string;
  image: string;
  url: string;
}

const AudicleItem: FC<Audicle> = ({ image, pubkey, title, url }) => {
  const publisherProfile = useProfileValue(pubkey);
  const mediaMetadata = useMemo(() => {
    return {
      artwork: image,
      title,
      artist: publisherProfile?.name,
    } as VideoMetadata;
  }, [publisherProfile, image, title]);

  const videoPlayer = useVideoPlayer(
    {
      uri: url,
      metadata: mediaMetadata,
    },
    (p) => {
      p.loop = false;
      p.staysActiveInBackground = true;
      p.showNowPlayingNotification = true;
    }
  );

  const { isPlaying } = useEvent(videoPlayer, "playingChange", {
    isPlaying: videoPlayer.playing,
  });

  const handlePlay = useCallback(async () => {
    videoPlayer.play();
  }, [url]);

  const handlePause = useCallback(() => {
    videoPlayer.pause();
  }, [url]);

  return (
    <View style={styles.audicleContainer}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.audicleImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.audicleTitle, { color: Colors.dark.text }]}
            numberOfLines={4}
          >
            {title}
          </ThemedText>
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Image
                width={20}
                height={20}
                borderRadius={15}
                source={{ uri: publisherProfile?.picture }}
              />
              <ThemedText
                type="defaultSemiBold"
                style={styles.footerTitle}
                numberOfLines={2}
              >
                {publisherProfile?.displayName?.replace(" (News Bot)", "")}
              </ThemedText>
            </View>
            {isPlaying ? (
              <PressableOpacity style={styles.playButton} onPress={handlePause}>
                <View>
                  <Pause
                    size={24}
                    fill={Colors.light.text90}
                    color={Colors.light.text90}
                  />
                </View>
              </PressableOpacity>
            ) : (
              <PressableOpacity style={styles.playButton} onPress={handlePlay}>
                <View style={styles.playButtonInner}>
                  <Play
                    size={24}
                    fill={Colors.light.text90}
                    color={Colors.light.text90}
                  />
                </View>
              </PressableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default AudicleItem;

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  listFooterContainer: {
    flexDirection: "row",
  },
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 4,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 10,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  footerLeft: {
    gap: 5,
    width: "60%",
    paddingLeft: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 8,
    lineHeight: 10,
    color: Colors.light.text90,
  },
  audicleContainer: {
    overflow: "hidden",
    width: CARD_WIDTH,
    aspectRatio: "9/16",
    marginHorizontal: 5,
    borderRadius: 15,
  },
  audicleImage: {
    flex: 1,
  },
  audicleTitle: {
    lineHeight: 15,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonInner: {
    transform: [{ rotate: "90deg" }],
  },
});
