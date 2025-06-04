import { useCallback } from "react";
import {
  EventTemplate,
  nip98,
  NostrEvent,
  Event as NostrToolsEvent,
} from "nostr-tools";
import { useNDK, useNDKCurrentPubkey } from "@nostr-dev-kit/ndk-hooks";

interface AuthHeader {
  Authorization: string;
}

interface UseNostrAuthProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<string, any>;
}

export const useNostrAuth = () => {
  const { ndk } = useNDK();
  const currentNDKPubkey = useNDKCurrentPubkey();

  const nip98Signer = async (
    event: EventTemplate
  ): Promise<NostrToolsEvent> => {
    const signature =
      ndk && ndk.signer && (await ndk.signer.sign(event as NostrEvent));
    if (!signature) {
      throw new Error("Failed to sign event");
    }

    // @ts-ignore
    event.sig = signature;
    // @ts-ignore
    return event as unknown as Event;
  };

  const getAuthHeader = useCallback(
    async ({
      url,
      method,
      body,
    }: UseNostrAuthProps): Promise<AuthHeader | undefined> => {
      try {
        if (!ndk || !currentNDKPubkey) return undefined;
        // Create the token payload
        console.log(url, method, nip98Signer, true, body || undefined);
        const token = await nip98.getToken(
          url,
          method,
          nip98Signer,
          true,
          body || undefined
        );

        // Return the Authorization header
        return {
          Authorization: token,
        };
      } catch (error) {
        console.error("Error generating NIP-98 auth header:", error);
        throw new Error("Failed to generate authentication header");
      }
    },
    [ndk, currentNDKPubkey]
  );

  return {
    getAuthHeader,
  };
};

export default useNostrAuth;
