import { FC, PropsWithChildren, useCallback } from "react";
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
} from "react-native";

const PressableOpacity: FC<PropsWithChildren<PressableProps>> = ({
  children,
  style,
  ...props
}) => {
  const customStyle = useCallback(
    (state: PressableStateCallbackType) => {
      const { pressed } = state;
      const baseStyle = { opacity: pressed ? 0.5 : 1 };
      if (typeof style === "function") {
        const derivedStyle = style(state);
        return [baseStyle, derivedStyle];
      }
      return [baseStyle, style];
    },
    [style]
  );

  return (
    <Pressable style={customStyle} {...props}>
      {children}
    </Pressable>
  );
};

export default PressableOpacity;
