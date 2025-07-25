import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Fragment, useEffect } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import { initNDKInstance } from "@/lib/ndk";
import { useNDKInit } from "@nostr-dev-kit/ndk-hooks";
import { useNDKStore, useSessionMonitor } from "@nostr-dev-kit/ndk-mobile";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

SplashScreen.preventAutoHideAsync();

const ndk = initNDKInstance();

type PublisherParams = {
  id: string;
};

export default function RootLayout() {
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const initializeNDK = useNDKInit(); // Hook returns the function directly
  const { setNDK } = useNDKStore();

  useSessionMonitor({ profile: true });

  useEffect(() => setNDK(ndk), []);

  useEffect(() => {
    initializeNDK(ndk);
  }, [initializeNDK]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Fragment>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="publisher/[id]"
          options={{
            header: (props) => {
              const params = props.route.params as PublisherParams;
              return params?.id ? <ProfileHeader id={params.id} /> : null;
            },
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            presentation: "modal",
            headerShown: false,
            contentStyle: [{ backgroundColor }, styles.modal],
          }}
        />
        <Stack.Screen
          name="audicles"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="quote"
          options={{
            presentation: "modal",
            headerShown: false,
            contentStyle: [{ backgroundColor }, styles.modal],
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  modal: { padding: 16 },
});
