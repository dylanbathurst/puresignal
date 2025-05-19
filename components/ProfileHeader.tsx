import { ThemedView } from "./ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Share, Share2 } from "lucide-react-native";
import { Platform, Pressable, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

const ProfileHeader = () => {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const { top } = useSafeAreaInsets();
  return (
    <ThemedView style={[{ paddingTop: top + 20 }, styles.container]}>
      <Pressable onPress={router.back}>
        <ChevronLeft color={Colors[theme].tint} />
      </Pressable>
      {/* <Pressable onPress={router.back}>
        {Platform.OS === "ios" ? (
          <Share color={Colors.dark.tint} />
        ) : (
          <Share2 color={Colors.dark.tint} />
        )}
      </Pressable> */}
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
});
