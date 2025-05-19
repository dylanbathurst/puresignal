import { Colors } from "@/constants/Colors";
import ContentLoader, { Circle } from "react-content-loader/native";
import { useColorScheme } from "react-native";

const PublisherListLoader = () => {
  const theme = useColorScheme() || "light";
  const bgColor = Colors[theme].shimmer;

  return (
    <ContentLoader
      backgroundColor={bgColor}
      opacity={0.05}
      height={30}
      speed={2}
      width="100%"
    >
      <Circle x={0} y={0} cx="15" cy="15" r="15" />
      <Circle x={35} y={0} cx="15" cy="15" r="15" />
      <Circle x={70} y={0} cx="15" cy="15" r="15" />
      <Circle x={105} y={0} cx="15" cy="15" r="15" />
      <Circle x={140} y={0} cx="15" cy="15" r="15" />
    </ContentLoader>
  );
};

export default PublisherListLoader;
