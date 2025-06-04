import { Colors } from "@/constants/Colors";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { Dimensions, StyleSheet, useColorScheme } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;

const AudicleItemLoader = () => {
  const theme = useColorScheme() || "light";
  const bgColor = Colors[theme].shimmer;
  return (
    <ContentLoader
      speed={2}
      style={styles.loaderContainer}
      backgroundColor={bgColor}
      opacity={0.05}
    >
      <Rect x="0" y="0" rx="15" ry="15" width={"100%"} height="230" />
      <Circle x={0} y={240} cx="15" cy="15" r="15" />
      <Rect x="40" y="245" rx="2" ry="2" width={"80"} height="6" />
      <Rect x="40" y="260" rx="2" ry="2" width={"50"} height="6" />
    </ContentLoader>
  );
};

export default AudicleItemLoader;

const styles = StyleSheet.create({
  loaderContainer: {
    width: CARD_WIDTH,
    aspectRatio: "9/16",
    marginHorizontal: 5,
  },
});
