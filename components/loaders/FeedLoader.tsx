import { Colors } from "@/constants/Colors";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { Dimensions, useColorScheme, View } from "react-native";

const windowWidth = Dimensions.get("window").width;
const loaderWidth = windowWidth - 24;

const FeedLoader = () => {
  const theme = useColorScheme() || "light";
  const bgColor = Colors[theme].shimmer;
  return (
    <View
      style={{
        flex: 1,
        paddingLeft: 10,
      }}
    >
      <ContentLoader
        speed={2}
        width={windowWidth}
        height={581}
        backgroundColor={bgColor}
        opacity={0.05}
        viewBox={`0 0 ${windowWidth} 581`}
      >
        <Circle x={0} y={0} cx="15" cy="15" r="15" />
        <Circle x={0} y={351} cx="15" cy="15" r="15" />
        <Rect x="40" y="10" rx="2" ry="2" width="120" height="10" />
        <Rect x="40" y="361" rx="2" ry="2" width="120" height="10" />
        <Rect x="0" y="40" rx="8" ry="8" width={loaderWidth} height="200" />
        <Rect x="0" y="265" rx="2" ry="2" width={loaderWidth} height="10" />
        <Rect x="0" y="396" rx="2" ry="2" width={loaderWidth} height="10" />
        <Rect x="0" y="287" rx="2" ry="2" width={loaderWidth} height="10" />
        <Rect x="0" y="418" rx="2" ry="2" width={loaderWidth} height="10" />
        <Rect x="0" y="309" rx="2" ry="2" width="175" height="10" />
        <Rect x="0" y="440" rx="2" ry="2" width="175" height="10" />
        <Circle x={0} y={482} cx="15" cy="15" r="15" />
        <Rect x="40" y="492" rx="2" ry="2" width="120" height="10" />
        <Rect x="0" y="527" rx="2" ry="2" width={loaderWidth} height="10" />
        <Rect x="0" y="549" rx="2" ry="2" width={loaderWidth} height="10" />
        <Rect x="0" y="571" rx="2" ry="2" width="175" height="10" />
      </ContentLoader>
    </View>
  );
};

export default FeedLoader;
