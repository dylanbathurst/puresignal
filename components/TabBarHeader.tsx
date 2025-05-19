import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FC } from "react";

interface TabBarHeaderProps {
  label: string;
}
const TabBarHeader: FC<TabBarHeaderProps> = ({ label }) => {
  const { top } = useSafeAreaInsets();
  return (
    <ThemedView style={[styles.container, { paddingTop: top }]}>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 35, height: 35, borderRadius: 50, marginRight: -20 }}
        />
        <Image
          source={require("@/assets/images/bitcoin-icon.png")}
          style={{ width: 35, height: 35 }}
        />
      </View>
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
});
