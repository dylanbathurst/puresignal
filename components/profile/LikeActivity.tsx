import { Heart } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import BaseActivity from "./BaseActivity";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { FC } from "react";

interface LikeActivityProps {
  title: string;
  link: string;
}
const LikeActivity: FC<LikeActivityProps> = ({ link, title }) => {
  const onPress = () => {
    WebBrowser.openBrowserAsync(`${link}?ref=puresignal.news`);
  };
  return (
    <BaseActivity onPress={onPress}>
      <Heart fill={Colors.light.icon} size={16} color={Colors.light.icon} />
      <ThemedText>{title}</ThemedText>
    </BaseActivity>
  );
};

export default LikeActivity;
