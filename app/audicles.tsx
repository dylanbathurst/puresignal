import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  useColorScheme,
  ImageBackground,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import PressableOpacity from "@/components/PressableOpacity";
import { router } from "expo-router";
import { BookHeadphones, Star, Shield, X, Car } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { useNDKCurrentPubkey } from "@nostr-dev-kit/ndk-hooks";

const SubscriptionBenefits = () => {
  const theme = useColorScheme() ?? "light";
  const currentUserPubkey = useNDKCurrentPubkey();

  const handleSubscribe = useCallback(async () => {
    if (!currentUserPubkey) {
      router.navigate("/login");
      return;
    }
    const { type } = await WebBrowser.openBrowserAsync(
      `${process.env.EXPO_PUBLIC_WEB_URL}/subscribe?pubkey=${currentUserPubkey}`
    );
  }, [currentUserPubkey]);

  const benefits = [
    {
      icon: BookHeadphones,
      title: "Premium Content Library",
      description:
        "Access our exclusive collection of high-quality audio articles.",
    },
    {
      icon: Car,
      title: "Hands-free News",
      description:
        "Listen to the the latest news while on your commute or just busy with other things.",
    },
    {
      icon: Star,
      title: "Ad-Free Experience",
      description:
        "Enjoy uninterrupted listening without any advertisements or sponsored content.",
    },
    {
      icon: Shield,
      title: "Exclusive Features",
      description: "Get access to all new features as they're added.",
    },
  ];

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require("@/assets/images/promo-bg.png")}
    >
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container]}>
          <PressableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color={Colors[theme].text} />
          </PressableOpacity>

          <View style={styles.header}>
            <BookHeadphones
              style={styles.headerIcon}
              size={48}
              color={Colors[theme].text}
            />
            <View style={styles.titleContainer}>
              <ThemedText type="title" style={styles.title}>
                Audicles Subscription
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Unlock the full potential of Pure Signal
              </ThemedText>
            </View>
          </View>

          <View style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <benefit.icon
                  size={24}
                  color={Colors[theme].text}
                  style={styles.benefitIcon}
                />
                <View style={styles.benefitContent}>
                  <ThemedText style={styles.benefitTitle}>
                    {benefit.title}
                  </ThemedText>
                  <ThemedText style={styles.benefitDescription}>
                    {benefit.description}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.pricingContainer}>
            <ThemedText type="title">$9.99</ThemedText>
            <ThemedText style={styles.pricePeriod}>per month</ThemedText>
            <PressableOpacity style={[styles.button]} onPress={handleSubscribe}>
              <ThemedText style={styles.buttonText}>Subscribe Now</ThemedText>
            </PressableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 0,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    paddingTop: 60,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  headerIcon: {
    transform: [{ translateX: -2 }],
  },
  benefitsContainer: {
    marginBottom: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  benefitIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  pricingContainer: {
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  pricePeriod: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
    borderColor: "white",
    borderWidth: 1,
    width: "80%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  trialText: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default SubscriptionBenefits;
