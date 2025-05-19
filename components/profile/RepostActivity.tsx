import { Heart, Repeat2 } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import BaseActivity from "./BaseActivity";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { FC } from "react";

interface RepostActivityProps {
  title: string;
  link: string;
}
const RepostActivity: FC<RepostActivityProps> = ({ link, title }) => {
  const onPress = () => {
    WebBrowser.openBrowserAsync(`${link}?ref=puresignal.news`);
  };
  return (
    <BaseActivity onPress={onPress}>
      <Repeat2 size={16} color={Colors.light.icon} />
      <ThemedText>{title}</ThemedText>
    </BaseActivity>
  );
};

export default RepostActivity;
