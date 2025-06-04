import NDK from "@nostr-dev-kit/ndk";
import { NDKCacheAdapterSqlite } from "@nostr-dev-kit/ndk-mobile";
export const timeZero = Date.now();

const cacheAdapter = new NDKCacheAdapterSqlite("pure-signal");
cacheAdapter.initialize();
export const explicitRelayUrls = [
  "wss://relay.puresignal.news/",
  "wss://relay.damus.io/",
  "wss://nos.lol/",
  "wss://relay.primal.net/",
  "wss://purplepag.es/",
  "wss://purplerelay.com",
  "wss://nostr-01.yakihonne.com/",
];

export function initNDKInstance() {
  const ndk = new NDK({
    cacheAdapter,
    enableOutboxModel: true,
    autoConnectUserRelays: false,
    explicitRelayUrls,
    clientName: "pure-signal",
  });

  cacheAdapter.ndk = ndk;

  ndk
    .connect()
    .then(() => console.log("NDK connected"))
    .catch((e) => console.error("NDK connection error:", e));

  return ndk;
}
