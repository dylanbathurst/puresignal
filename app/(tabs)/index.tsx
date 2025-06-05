import { useEffect, useMemo } from "react";
import {
  NDKFilter,
  NDKKind,
  useNDKCurrentPubkey,
  useSubscribe,
} from "@nostr-dev-kit/ndk-hooks";
import Feed from "@/components/Feed";
import { ArticleWithInteraction, Audicles } from "@/components/FeedItem";
import { useReactionsStore } from "@/stores/reactions";

export default function HomeScreen() {
  const { addEvents } = useReactionsStore();
  const currentUserPubkey = useNDKCurrentPubkey();

  const articlesListFilter = useMemo(
    () => [
      {
        kinds: [NDKKind.Article],
        limit: 100,
        "#client": ["Pure Signal"],
      } as NDKFilter,
    ],
    []
  );
  const { events: articles } = useSubscribe(articlesListFilter);

  const articleIds = useMemo(() => articles.map((a) => a.id), [articles]);

  const interactionsFilter = useMemo(() => {
    return [
      {
        kinds: [NDKKind.GenericRepost, NDKKind.Reaction],
        "#k": ["30023"],
        "#e": articleIds,
        // "#client": ["Pure Signal"],
      } as NDKFilter,
    ];
  }, [articleIds]);

  const { events: interactions } = useSubscribe(interactionsFilter, {
    skipVerification: true,
  });

  useEffect(() => {
    if (interactions.length > 0 && currentUserPubkey) {
      addEvents(interactions, currentUserPubkey);
    }
  }, [interactions, currentUserPubkey, addEvents]);

  const mappedInteractions = useMemo(() => {
    const mapped: Record<
      string,
      { reposts: number; quotes: number; reactions: number }
    > = {};

    interactions.forEach((interaction) => {
      const articleTag = interaction.tags.find((t) => t[0] === "e");
      if (!articleTag) return;

      if (!mapped[articleTag[1]]) {
        mapped[articleTag[1]] = {
          quotes: 0,
          reactions: 0,
          reposts: 0,
        };
      }

      switch (interaction.kind) {
        case NDKKind.GenericRepost:
          mapped[articleTag[1]].reposts += 1;
          break;
        case NDKKind.Reaction:
          mapped[articleTag[1]].reactions += 1;
          break;
        case NDKKind.Repost:
          mapped[articleTag[1]].quotes += 1;
          break;
        default:
          break;
      }
    });
    return mapped;
  }, [interactions]);

  const modifiedArticles = useMemo(() => {
    return articles
      .map((article) => {
        const interactions = mappedInteractions[article.id] || {
          quotes: 0,
          reactions: 0,
          reposts: 0,
        };
        return Object.assign(article, {
          interactions,
        }) as ArticleWithInteraction;
      })
      .sort((a, b) => {
        const pubA = a.tagValue("published_at");
        const pubB = b.tagValue("published_at");

        const normalizedPubA =
          pubA?.length === 13 ? parseInt(pubA) / 1000 : parseInt(pubA || "");

        const normalizedPubB =
          pubB?.length === 13 ? parseInt(pubB) / 1000 : parseInt(pubB || "");

        return normalizedPubB - normalizedPubA;
      });
  }, [articles, mappedInteractions]);

  return <Feed articles={modifiedArticles} />;
}
