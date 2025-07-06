import React from "react";
import { View } from "react-native";

interface DefaultProfilePicProps {
  size?: number;
  color?: string;
}

const DefaultProfilePic: React.FC<DefaultProfilePicProps> = ({
  size = 25,
  color = "white",
}) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
};

export default DefaultProfilePic;
