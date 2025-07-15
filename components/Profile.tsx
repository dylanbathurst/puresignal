import { ThemedText } from "./ThemedText";
import * as WebBrowser from "expo-web-browser";
import { ThemedView } from "./ThemedView";
import { FC, useCallback, useMemo } from "react";
import {
  NDKEvent,
  NDKFilter,
  NDKKind,
  useProfileValue,
  useSubscribe,
} from "@nostr-dev-kit/ndk-hooks";
import {
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { BadgeX, Bolt, Link2, ZapIcon } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import PublisherHeaderLoader from "./loaders/PublisherHeaderLoader";

interface ProfileProps {
  id: string;
}
const { Zap } = NDKKind;
const Profile: FC<ProfileProps> = ({ id }) => {
  const userProfile = useProfileValue(id);
  const theme = useColorScheme() ?? "light";
  const { link } = Colors[theme];
  const { website, picture, name, about, bio } = userProfile || {};

  const { events: interactions } = useSubscribe([
    {
      kinds: [Zap],
      "#p": [id], // Filter for events that mention this pubkey
      limit: 500,
    } as NDKFilter,
  ]);

  const totalZaps = useMemo(() => {
    const zaps = interactions.map((inter) => {
      const descTag = inter.tagValue("description");
      const parsedDescTag: NDKEvent = descTag ? JSON.parse(descTag) : {};
      const amountTag = parsedDescTag.tags.find((tag) => tag[0] === "amount");
      if (amountTag) {
        return Number(amountTag[1]) / 1000;
      }
    });

    return zaps.reduce((sum = 0, val) => sum + (val || 0), 0);
  }, [interactions]);

  const handleOpenWebsite = useCallback(async () => {
    if (!website) return;
    await WebBrowser.openBrowserAsync(website);
  }, [website]);

  const url = (website && new URL(website)) || undefined;

  return (
    <ThemedView
      style={{
        paddingHorizontal: 10,
        paddingBottom: 20,
      }}
    >
      {!userProfile ? (
        <PublisherHeaderLoader />
      ) : (
        <View
          style={{
            gap: 12,
          }}
        >
          <Image
            source={{
              uri: picture,
            }}
            style={{
              width: 50,
              aspectRatio: 1,
              borderRadius: 15,
            }}
          />
          <View>
            <ThemedText type="title" numberOfLines={1}>
              {name?.replace(" (News Bot)", "")}
            </ThemedText>
          </View>

          <ThemedText type="defaultSemiBold" style={{ opacity: 0.7 }}>
            {about || bio}
          </ThemedText>
          <View style={styles.footer}>
            {url && (
              <Pressable
                onPress={handleOpenWebsite}
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <Link2
                  color={link}
                  size={14}
                  style={{ transform: [{ rotate: "-45deg" }] }}
                />
                <ThemedText style={{ fontSize: 14 }}>{url.host}</ThemedText>
              </Pressable>
            )}
            <View style={styles.zaps}>
              <ZapIcon
                size={14}
                color={Colors.pallete.orange}
                fill={Colors.pallete.orange}
              />
              <ThemedText style={{ fontSize: 14 }}>{totalZaps}</ThemedText>
            </View>
            <View style={styles.zaps}>
              <BadgeX size={14} color={Colors.dark.icon} />
              <ThemedText style={{ fontSize: 14 }}>Unclaimed</ThemedText>
            </View>
          </View>
        </View>
      )}
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  zaps: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});
