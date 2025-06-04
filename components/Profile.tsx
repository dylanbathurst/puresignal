import { ThemedText } from "./ThemedText";
import * as WebBrowser from "expo-web-browser";
import { ThemedView } from "./ThemedView";
import { FC, useCallback } from "react";
import { useProfileValue } from "@nostr-dev-kit/ndk-hooks";
import { Image, Pressable, useColorScheme, View } from "react-native";
import { Link2 } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import PublisherHeaderLoader from "./loaders/PublisherHeaderLoader";
import CopyButton from "./CopyButton";
import { nip19 } from "nostr-tools";

interface ProfileProps {
  id: string;
}
const Profile: FC<ProfileProps> = ({ id }) => {
  const userProfile = useProfileValue(id);
  const theme = useColorScheme() ?? "light";
  const { link } = Colors[theme];
  const { website, picture, displayName, bio } = userProfile || {};

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
        <View style={{ gap: 12 }}>
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
          <View style={{ gap: 8, flex: 1 }}>
            <View>
              <ThemedText type="title" numberOfLines={2}>
                {displayName}
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={{ opacity: 0.7 }}>
                {bio}
              </ThemedText>
            </View>
          </View>
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
              <ThemedText
                darkColor={link}
                lightColor={link}
                style={{ fontSize: 14 }}
              >
                {url.host}
              </ThemedText>
            </Pressable>
          )}
        </View>
      )}
    </ThemedView>
  );
};

export default Profile;
