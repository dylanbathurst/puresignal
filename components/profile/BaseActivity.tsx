import { Pressable, View } from "react-native";
import { FC, PropsWithChildren } from "react";

interface BaseActivityProps {
  onPress: () => void;
}
const BaseActivity: FC<PropsWithChildren & BaseActivityProps> = ({
  children,
  onPress,
}) => {
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {children}
      </Pressable>
    </View>
  );
};

export default BaseActivity;
