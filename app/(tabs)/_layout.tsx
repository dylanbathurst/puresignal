import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/HapticTab";
import TabBar from "@/components/TabBar";
import TabBarHeader from "@/components/TabBarHeader";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const theme = useColorScheme() ?? "light";
  const audioEnabled = false;

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        header: () => <TabBarHeader label="News" />,
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: { backgroundColor: Colors[theme].background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "News",
          headerShown: true,
        }}
      />
      {/* {audioEnabled && (
        <Tabs.Screen
          name="audio"
          options={{
            title: "Audio",
            headerShown: true,
            header: () => <TabBarHeader label="Audio" />,
          }}
        />
      )} */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
