import { useColorScheme } from "@/hooks/useColorScheme";
import { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import { icons } from "@/constants/TabBarIcons";
import { Colors } from "@/constants/Colors";

type IconKeys = keyof typeof icons;

interface TabBarButtonProps {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
}
const TabBarButton: FC<TabBarButtonProps> = ({
  isFocused,
  onPress,
  routeName,
}) => {
  const scheme = useColorScheme();

  return (
    <Pressable onPress={onPress} style={styles.button}>
      {icons[routeName as IconKeys]({
        color: Colors[scheme ?? "dark"].tint,
        opacity: isFocused ? 1 : 0.8,
      })}
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  button: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  label: { fontSize: 12, lineHeight: 16 },
});
