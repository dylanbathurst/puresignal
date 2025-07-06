import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import React from "react";
import { HapticTab } from "@/components/HapticTab";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { StyleSheet, Text } from "react-native";
import Profile from "@/components/Profile";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function TabLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useColorScheme() ?? "light";

  return (
    <Tabs>
      <Profile id={id} />
      <TabList asChild>
        <ThemedView style={styles.container}>
          <TabTrigger
            style={[styles.trigger, { borderBottomColor: Colors[theme].text }]}
            name="index"
            href={`/publisher/${id}`}
          >
            <ThemedText type="subtitle">Feed</ThemedText>
          </TabTrigger>
          <TabTrigger
            style={[styles.trigger, { borderBottomColor: Colors[theme].text }]}
            name="activity"
            href={`/publisher/${id}/activity`}
          >
            <ThemedText type="subtitle">Activity</ThemedText>
          </TabTrigger>
        </ThemedView>
      </TabList>
      <TabSlot />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    gap: 18,
    paddingHorizontal: 10,
  },
  trigger: {
    flex: 1,
    justifyContent: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
