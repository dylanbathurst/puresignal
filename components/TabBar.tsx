import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { FC } from "react";
import { Platform, StyleSheet } from "react-native";
import TabBarButton from "./TabBarButton";
import { ThemedView } from "./ThemedView";
import { useNDKCurrentUser } from "@nostr-dev-kit/ndk-hooks";
import { Colors } from "@/constants/Colors";

const TabBar: FC<BottomTabBarProps> = ({ navigation, descriptors, state }) => {
  const currentUser = useNDKCurrentUser();

  return (
    <ThemedView
      darkColor={Colors.dark.black80}
      lightColor={Colors.light.text80}
      style={[styles.container]}
    >
      {state.routes.map((route, index) => {
        if (route.name === "audio") return;
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!currentUser && route.name === "profile") {
            return navigation.navigate("login");
          }

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;

        return (
          <TabBarButton
            key={route.key}
            onPress={onPress}
            isFocused={isFocused}
            routeName={label}
          />
        );
      })}
    </ThemedView>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    display: "flex",
    bottom: Platform.OS === "ios" ? 50 : 10,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
