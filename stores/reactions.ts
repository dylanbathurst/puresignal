import { getRootTag, NDKEvent, NDKKind, NDKUser } from "@nostr-dev-kit/ndk";
import { create } from "zustand";

const DEFAULT_STATS: ReactionStats = {
  likesCount: 0,
  likedByUser: false,
  quotesCount: 0,
  quotedByUser: false,
  repostsCount: 0,
  repostedByUser: false,
};

interface ReactionStats {
  likesCount: number;
  likedByUser?: boolean;
  repostsCount: number;
  repostedByUser?: boolean;
  quotesCount: number;
  quotedByUser?: boolean;
}

interface ReactionsStore {
  eventIds: Set<string>;
  reactions: Map<string, ReactionStats>;
  addEvents: (
    events: NDKEvent[],
    currentUserPubkey?: NDKUser["pubkey"]
  ) => void;
}

const useReactionsStore = create<ReactionsStore>((set) => ({
  eventIds: new Set(),
  reactions: new Map(),
  addEvents: (events: NDKEvent[], currentUserPubkey?: NDKUser["pubkey"]) => {
    set((state: ReactionsStore) => {
      const newEventIds = new Set(state.eventIds);
      const newReactions = new Map(state.reactions);

      events.forEach((event) => {
        const hasBeenSeen = newEventIds.has(event.id);
        const eventId = getRootTag(event);

        if (!eventId || hasBeenSeen) return;

        switch (event.kind) {
          case NDKKind.Reaction:
            const likeStats = {
              ...(newReactions.get(eventId[1]) || DEFAULT_STATS),
            };

            likeStats.likesCount++;
            likeStats.likedByUser = event.pubkey === currentUserPubkey;
            newReactions.set(eventId[1], likeStats);

            break;
          case NDKKind.GenericRepost:
          case NDKKind.Repost:
            const repostStats = {
              ...(newReactions.get(eventId[1]) || DEFAULT_STATS),
            };
            repostStats.repostsCount++;
            repostStats.repostedByUser = event.pubkey === currentUserPubkey;
            newReactions.set(eventId[1], repostStats);

            break;
          default:
            break;
        }
        state.eventIds = newEventIds;
        state.reactions = newReactions;
        newEventIds.add(event.id);
      });
      return state;
    });
  },
}));

export { useReactionsStore };
