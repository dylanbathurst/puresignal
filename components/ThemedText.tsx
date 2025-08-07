import { Text, type TextProps, StyleSheet, TextInput } from "react-native";
import { UITextView } from "react-native-uitextview";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  copyable?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  copyable = false,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  if (copyable) {
    return (
      <UITextView
        selectable
        uiTextView
        style={[
          { color },
          styles.input,
          type === "default" ? styles.default : undefined,
          type === "title" ? styles.title : undefined,
          type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
          type === "subtitle" ? styles.subtitle : undefined,
          type === "link" ? styles.link : undefined,
          style,
        ]}
        {...rest}
      >
        {rest.children}
      </UITextView>
    );
  }
  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingVertical: 0,
    includeFontPadding: false,
  },
  default: {
    fontSize: 14,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 24,
  },
  link: {
    fontSize: 14,
    lineHeight: 24,
    color: "#bada55",
  },
});
