import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Dimensions } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";
import { BookHeadphones } from "lucide-react-native";
import { useColorScheme } from "react-native";
import AudiclePromo from "./AudiclePromo";
import useNostrAuth from "@/lib/hooks/useNostrAuth";
import AudicleItem, { Audicle } from "./AudicleItem";
import AudicleItemLoader from "./loaders/AudicleItemLoader";
import {
  useNDKCurrentPubkey,
  useNDKCurrentUser,
} from "@nostr-dev-kit/ndk-hooks";

interface AudiclesResponse {
  audicles: Audicle[];
  total: number;
}

const AudicleFeed = () => {
  const [audicles, setAudicles] = useState<Audicle[]>([]);
  const [count, setCount] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useColorScheme() ?? "light";
  const currentPubkey = useNDKCurrentPubkey();
  const { getAuthHeader } = useNostrAuth();

  useEffect(() => {
    const fetchAudicles = async () => {
      try {
        const audicleEndpoint = `${process.env.EXPO_PUBLIC_API_URL}/audicles`;
        const response = await fetch(audicleEndpoint, {
          headers: {
            ...(await getAuthHeader({
              url: audicleEndpoint,
              method: "GET",
            })),
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch audicles");
        }
        const data: AudiclesResponse = await response.json();
        setAudicles(data.audicles);
        setCount(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAudicles();
  }, [currentPubkey]);

  const renderAudicle = ({ item }: { item: Audicle }) => (
    <AudicleItem {...item} />
  );

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ color: "red" }}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.sectionContainer}>
        <BookHeadphones size={20} color={Colors[theme].text} />
        <ThemedText style={styles.sectionTitle}>Audicles</ThemedText>
        <ThemedText type="defaultSemiBold">({count})</ThemedText>
      </View>
      <FlatList
        data={audicles}
        renderItem={renderAudicle}
        keyExtractor={(item, i) => `${item.title}${i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={() =>
          audicles.length > 1 ? null : <AudiclePromo />
        }
        ListFooterComponentStyle={styles.listFooterContainer}
        ListEmptyComponent={
          <>
            <AudicleItemLoader />
            <AudicleItemLoader />
            <AudicleItemLoader />
          </>
        }
      />
    </ThemedView>
  );
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  listFooterContainer: {
    flexDirection: "row",
  },
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 4,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 10,
  },
  audicleContainer: {
    width: CARD_WIDTH,
    aspectRatio: "9/16",
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Colors.light.input,
  },
  audicleImage: {
    width: "100%",
    aspectRatio: "9/16",
  },
  audicleTitle: {
    lineHeight: 15,
    padding: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  playButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 1,
    transform: [{ rotate: "90deg" }],
  },
  playButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudicleFeed;
