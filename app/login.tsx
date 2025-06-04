import React, { useCallback, useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  StyleSheet,
  KeyboardAvoidingView,
  useColorScheme,
  Pressable,
} from "react-native";
import {
  NDKUser,
  useNDK,
  useNDKCurrentUser,
  useNDKSessionStart,
  useNDKSessionLogin,
} from "@nostr-dev-kit/ndk-hooks";
import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk-mobile";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TextInput, Button } from "react-native";
import { Colors } from "@/constants/Colors";

export default function Login() {
  const { ndk } = useNDK();
  const login = useNDKSessionLogin();
  const theme = useColorScheme() ?? "light";
  const currentUser = useNDKCurrentUser();
  const [privateKey, setPrivateKey] = useState("");
  const initSession = useNDKSessionStart();

  const [error, setError] = useState("");

  const handleNostrInfoLink = () => {
    WebBrowser.openBrowserAsync("https://nostr.org/#info");
  };

  const handleLogin = useCallback(async () => {
    if (!ndk) return;
    try {
      if (privateKey) {
        const signer = new NDKPrivateKeySigner(privateKey, ndk);
        const user: NDKUser = await signer.user();
        initSession(user.pubkey, { profile: true });
        await login(signer, true);
      } else {
        setError("Please enter your nsec private key");
      }
    } catch (err) {
      setError("Invalid private key format");
    }
  }, [ndk, privateKey, login]);

  useEffect(() => {
    if (currentUser) {
      router.replace("/profile");
    }
  }, [currentUser]);

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
        <ThemedText style={styles.title}>Login with Nostr</ThemedText>

        <TextInput
          style={[
            styles.input,
            { color: Colors[theme].text, backgroundColor: Colors[theme].input },
          ]}
          placeholder="Enter your nsec"
          placeholderTextColor={Colors[theme].text}
          value={privateKey}
          onChangeText={setPrivateKey}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        <Button title="Login" onPress={handleLogin} disabled={!privateKey} />
        <Pressable
          onPress={handleNostrInfoLink}
          style={{
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 30,
          }}
        >
          <ThemedText type="link">What is nostr?</ThemedText>
        </Pressable>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
