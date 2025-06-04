import { ThemedView } from "./ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { FC } from "react";
import { nip19 } from "nostr-tools";
import CopyButton from "./CopyButton";

const ProfileHeader: FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const { top } = useSafeAreaInsets();
  const npub = nip19.npubEncode(id);
  const trunactedNpub = `${npub.substring(0, 4)}...${npub.substring(
    npub.length - 5
  )}`;

  return (
    <ThemedView style={[{ paddingTop: top + 20 }, styles.container]}>
      <Pressable onPress={router.back}>
        <ChevronLeft color={Colors[theme].tint} />
      </Pressable>
      <View style={styles.copyNpub}>
        <ThemedText type="defaultSemiBold">{trunactedNpub}</ThemedText>
        <CopyButton confirmText={false} textToCopy={npub} />
      </View>
    </ThemedView>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  copyNpub: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 6,
  },
});
