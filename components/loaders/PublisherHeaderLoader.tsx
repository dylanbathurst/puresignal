import { Colors } from "@/constants/Colors";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { Dimensions, useColorScheme, View } from "react-native";

const windowWidth = Dimensions.get("window").width;
const loaderWidth = windowWidth - 24;

const PublisherHeaderLoader = () => {
  const theme = useColorScheme() || "light";
  const bgColor = Colors[theme].shimmer;

  return (
    <ContentLoader
      speed={2}
      width={windowWidth}
      height={180}
      backgroundColor={bgColor}
      opacity={0.05}
      viewBox={`0 0 ${windowWidth} 180`}
    >
      <Rect x="0" y="0" rx="15" ry="15" width="50" height="50" />
      <Rect x="0" y="60" rx="2" ry="2" width="120" height="20" />
      <Rect x="0" y="90" rx="2" ry="2" width={loaderWidth} height="10" />
      <Rect x="0" y="110" rx="2" ry="2" width={loaderWidth} height="10" />
      <Rect x="0" y="130" rx="2" ry="2" width="175" height="10" />
      <Rect x="0" y="160" rx="2" ry="2" width="100" height="10" />
    </ContentLoader>
  );
};

export default PublisherHeaderLoader;
