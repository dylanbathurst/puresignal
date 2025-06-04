import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  useAnimatedValue,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FC, useCallback, useEffect, useMemo } from "react";

interface TabBarHeaderProps {
  label: string;
}
const TabBarHeader: FC<TabBarHeaderProps> = ({ label }) => {
  const { top } = useSafeAreaInsets();
  const slideLeft = useAnimatedValue(0);
  const slideRight = useAnimatedValue(0);
  const zIndexLeft = useAnimatedValue(1);
  const zIndexRight = useAnimatedValue(0);

  const logoAnimation = useMemo(
    () =>
      Animated.sequence([
        Animated.parallel([
          Animated.timing(slideLeft, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideRight, {
            toValue: 10,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(zIndexLeft, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(zIndexRight, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(slideLeft, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideRight, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    [slideLeft, slideRight, zIndexLeft, zIndexRight]
  );

  const handlePress = useCallback(() => {
    logoAnimation.start();
  }, [logoAnimation]);

  useEffect(() => {
    logoAnimation.start();
  }, [slideLeft, slideRight, zIndexLeft, zIndexRight]);

  return (
    <ThemedView style={[styles.container, { paddingTop: top }]}>
      <Pressable onPress={handlePress} style={{ flexDirection: "row" }}>
        <Animated.View
          style={{
            transform: [{ translateX: slideLeft }],
            zIndex: zIndexLeft,
          }}
        >
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ translateX: slideRight }],
            zIndex: zIndexRight,
          }}
        >
          <Image
            source={require("@/assets/images/bitcoin-icon.png")}
            style={styles.btcLogo}
          />
        </Animated.View>
      </Pressable>
      <ThemedText type="title" style={{ lineHeight: 0 }}>
        {label}
      </ThemedText>
    </ThemedView>
  );
};

export default TabBarHeader;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 35, height: 35, borderRadius: 50, marginRight: -20 },
  btcLogo: { width: 35, height: 35 },
});
