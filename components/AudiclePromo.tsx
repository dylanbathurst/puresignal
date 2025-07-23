import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  useColorScheme,
  ImageBackground,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";
import PressableOpacity from "./PressableOpacity";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link, router } from "expo-router";
import { BookHeadphones } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { useNDKCurrentPubkey } from "@nostr-dev-kit/ndk-hooks";

const AudiclePromo = () => {
  const theme = useColorScheme() ?? "light";
  const currentUserPubkey = useNDKCurrentPubkey();
  const backgroundColor = useThemeColor(
    { light: Colors.light.text004, dark: Colors.light.text004 },
    "icon"
  );

  const handleSubscribe = useCallback(async () => {
    if (!currentUserPubkey) {
      router.navigate("/login");
      return;
    }
    const { type } = await WebBrowser.openBrowserAsync(
      `${process.env.EXPO_PUBLIC_WEB_URL}/subscribe?pubkey=${currentUserPubkey}`
    );
  }, [currentUserPubkey]);

  return (
    <ThemedView style={[{ backgroundColor }, styles.container]}>
      <ImageBackground
        resizeMode="cover"
        style={{ flex: 1 }}
        source={require("@/assets/images/promo-bg.png")}
      >
        <View style={[styles.content]}>
          <View>
            <View style={styles.titleContainer}>
              <BookHeadphones
                style={{ marginTop: 5 }}
                size={40}
                color={Colors.dark.text}
              />
              <View>
                <ThemedText style={[styles.title, { color: Colors.dark.text }]}>
                  Unlock more Audicles
                </ThemedText>
                <ThemedText style={[styles.price, { color: Colors.dark.text }]}>
                  $9.99 a month
                </ThemedText>
              </View>
            </View>
          </View>
          <View>
            <PressableOpacity style={[styles.button]} onPress={handleSubscribe}>
              <ThemedText
                style={[styles.buttonText, { color: Colors.dark.text }]}
              >
                Subscribe Now
              </ThemedText>
            </PressableOpacity>
            <Link
              style={[styles.info, { color: Colors.dark.text }]}
              href={"/audicles"}
            >
              Learn more
            </Link>
          </View>
        </View>
      </ImageBackground>
    </ThemedView>
  );
};

const { width } = Dimensions.get("window");
const PROMO_WIDTH = width * 0.5;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginHorizontal: 5,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    width: PROMO_WIDTH,
    borderRadius: 15,
    padding: 18,
  },
  info: {
    textDecorationLine: "underline",
    textAlign: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  features: {
    marginBottom: 25,
  },
  feature: {
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    borderColor: "white",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  price: {
    fontSize: 16,
  },
});

export default AudiclePromo;
