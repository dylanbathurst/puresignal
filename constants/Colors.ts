/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#000";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#f5f5f5",
    input: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    shimmer: tintColorLight,
    link: "#bada55",
    white80: "rgba(255,255,255, 0.8)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#1e1e1e",
    black80: "rgba(0, 0, 0, 0.8)",
    input: "#ffffff21",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    shimmer: tintColorDark,
    link: "#bada55",
  },
};
