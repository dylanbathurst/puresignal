import { ThemedView } from "./ThemedView";

const FeedItemSeperator = () => {
  return (
    <ThemedView
      darkColor="rgba(255,255,255,0.1)"
      lightColor="rgba(0,0,0,0.1)"
      style={{
        height: 1,
        margin: 10,
      }}
    />
  );
};

export default FeedItemSeperator;
